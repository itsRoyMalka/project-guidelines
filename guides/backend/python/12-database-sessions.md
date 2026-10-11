# Python database sessions and configuration

**Scope:** SQLAlchemy 2 services with Alembic. [PYDB](04-persistence-and-migrations.md) owns models/migrations; shared [access](../shared/database/01-identities-and-access.md) and [connections](../shared/database/02-connections-and-isolation.md) own guarantees. **Why:** a session is the DAL interface; transaction lifetime belongs to the wrapper.

**PYSES-01 MUST:** Name the DAL parameter `session` and choose `Session` or `AsyncSession` for the operation's I/O model. Use the same DAL for ordinary and explicitly transactional calls; it never creates, commits, rolls back or closes the session. A session is mutable unit-of-work state: one per thread/task, not a global singleton or an object shared across concurrent `gather` tasks.

```python
# features/orders/shared/dal.py — SQLAlchemy 2 async profile
async def get_owned(
    session: AsyncSession, account_id: UUID, order_id: UUID,
) -> OrderRow:
    row = await session.scalar(
        select(OrderRow).where(
            OrderRow.id == order_id, OrderRow.account_id == account_id,
        )
    )
    if row is None:
        raise OrderNotFound()
    return row
```

The scoped read hides inaccessible resources; the handler still checks action authorization before mutation.

**PYSES-02 MUST:** The wrapper creates/cleans up sessions and binds one to `ctx.session`. Begin a transactional action before its first SQL; child actions join that context and never independently commit. Ordinary reads still trigger SQLAlchemy autobegin; closing the session releases the implicit transaction. `transaction=False` means no coordinated business transaction, not database autocommit. A write requires explicit wrapper commit policy; closing a session does not persist it.

```python
# app/handlers.py — SQLAlchemy lifecycle fragments inside the app-owned wrapper
async with session_factory() as session:
    async with session.begin():
        result = await run_action(context.with_session(session), input)
        context.require_committable()  # rejects a caught participating child failure
    # commit succeeded; wrapper records telemetry and returns public result

# Ordinary read path; read_order builds a detached public value before closing.
async with session_factory() as session:
    result = await read_order(session, actor, order_id)
```

`run_action`, `with_session` and `require_committable` are project-owned interfaces illustrating [action lifecycle](recipes/action-lifecycle.md). No network calls while either implicit or explicit transaction is held. A nontransactional orchestration uses short owned read/write operations and closes their sessions before external I/O.

**PYSES-03 MUST:** App lifespan owns engine/session factory and receives runtime credentials only. Configure bounded pool size/overflow/acquisition, driver connect timeout and verified TLS; set server query/lock/idle limits by workload. Dispose resources after draining work and test new connections after credential rotation. Pool pre-ping detects stale connections but cannot safely replay an interrupted transaction.

```python
# app/db.py — SQLAlchemy 2 + psycopg async PostgreSQL; validated settings
engine = create_async_engine(
    settings.database_url.get_secret_value(),
    pool_size=settings.db_pool_size,
    max_overflow=settings.db_max_overflow,
    pool_timeout=settings.db_pool_wait_seconds,
    pool_pre_ping=True,
    connect_args={
        'connect_timeout': settings.db_connect_timeout_seconds,
        'sslmode': 'verify-full',
        'sslrootcert': settings.db_ca_path,
    },
)
session_factory = async_sessionmaker(engine, expire_on_commit=False)
# Lifespan finally: await engine.dispose()
```

The selected URL uses the `postgresql+psycopg` driver; local disposable databases may use a documented local transport profile. Server statement/lock/idle budgets are provisioned separately; connect and pool timeouts do not replace them. Do not copy these options to another driver without checking support.

**PYSES-04 MUST:** Make flush/loading behavior intentional. Autoflush can send pending writes before a query; flush is not commit. After a failed flush, abort the action and let its wrapper clean up rather than catching and continuing. Use explicit eager loading/projections for async queries, and create public Pydantic values before closing the session; no lazy SQL during response serialization.

```python
# features/orders/cancel_order/handler.py — before wrapper closes the session
return CancelOrderOutput(id=row.id, status=OrderStatus.CANCELLED)
# Return the declared outcome after the checked write, not a lazy ORM graph.
```

**PYSES-05 MUST:** Alembic runs with a separately delivered migration identity; runtime settings do not contain migration credentials. Compose all feature metadata centrally and review revisions, grants and policies, including objects autogenerate does not fully cover. Verify actual object ownership; configure role assumption in the runner for both transactional and nontransactional DDL.

```text
db/alembic.ini                 # points at the owned migration directory
db/migrations/env.py           # migration-only settings; metadata composition
db/migrations/versions/        # reviewed schema/grant/policy revisions
src/orders/app/db_models.py   # imports all selected feature models
src/orders/app/db.py          # runtime identity, engine/session factory only
```

**Verification:** both session paths use the same DAL; rollback/flush failure, concurrent tasks, no SQL during serialization, runtime permission denial, metadata discovery and migration identity proof. **Exception:** the sync profile uses `Session` and creates/uses/closes it inside one synchronous callable; do not mix sync I/O into an async route. Sources: [SQLAlchemy session lifecycle](https://docs.sqlalchemy.org/en/20/orm/session_basics.html), [async loading/concurrency](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html), [pool disconnects](https://docs.sqlalchemy.org/en/20/core/pooling.html), [Alembic autogenerate limitations](https://alembic.sqlalchemy.org/en/latest/autogenerate.html).
