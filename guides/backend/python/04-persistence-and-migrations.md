# SQLAlchemy data, queries and migrations

**Scope:** Python services owning relational state. Shared [data rules](../shared/02-data-and-time.md) own constraints, index proof, migration rollout and time semantics. **Why:** a typed ORM does not remove transaction, concurrency or query design decisions.

**PYDB-01 MUST:** Define SQLAlchemy 2 `Mapped` rows with explicit primary keys and relationships, declared constraints and feature ownership. Keep models and DAL beside the feature; compose metadata centrally for Alembic. A table belongs to one writer feature; other features use its public operation. Tenant columns/filters exist only for a multi-tenant product.

```python
# features/orders/shared/models.py — Python SQLAlchemy 2, PostgreSQL profile
class OrderRow(Base):
    __tablename__ = 'orders'
    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True)
    account_id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), nullable=False)
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, values_callable=lambda kind: [item.value for item in kind], name='order_status'),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
# app/db_models.py imports feature models so Alembic target_metadata sees them.
```

**PYDB-02 MUST:** The app lifespan owns engine/pool and `async_sessionmaker` (or the chosen sync equivalent). The project-owned `define_handler` binds `ctx.session`; DAL functions accept `session` for ordinary or transactional calls and never create, commit or close one. See [session semantics and configuration](12-database-sessions.md). The wrapper must roll back on any child failure and keep external I/O outside the transaction.

```python
# features/orders/cancel_order/handler.py — Python action definition
cancel_order = define_handler(
    name=OrderAction.CANCEL,
    transaction=True,
    audit=AuditAction.ORDER_CANCELLED,
    run=cancel_order_run,  # receives HandlerContext(actor, session, deps)
)
# app/handlers.py owns session factory, transaction, audit and telemetry; HTTP error mapping stays at the API boundary.
```

**PYDB-03 MUST:** A DAL query declares its scope, ordering and expected cardinality. Use `select`/`update` with bound values, avoid implicit lazy I/O in async paths, and use a checked conditional update or lock when concurrent writes could violate state. Avoid N+1 by selecting/loading the data the action actually needs.

```python
# features/orders/shared/dal.py — Python, session is the action's AsyncSession
async def cancel_if_pending(session: AsyncSession, order_id: UUID) -> bool:
    result = await session.execute(
        update(OrderRow)
        .where(OrderRow.id == order_id, OrderRow.status == OrderStatus.PENDING)
        .values(status=OrderStatus.CANCELLED)
        .returning(OrderRow.id)
    )
    return result.scalar_one_or_none() is not None
```

**PYDB-04 MUST:** Align indexes with DAL queries and validate with PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` on representative safe data. Put equality scope first when it supports the query, then range/order columns; measure write cost and avoid speculative indexes. Use stable bounded pagination for lists.

```sql
-- features/orders/shared/dal.py lists account's pending orders newest first.
CREATE INDEX orders_account_status_created_id
  ON orders (account_id, status, created_at DESC, id DESC);
-- Query WHERE account_id=:id AND status='pending' ORDER BY created_at DESC,id DESC LIMIT 50.
```

**PYDB-05 MUST:** Keep one Alembic history per owned database at `db/migrations/`. Generated revisions are candidates: inspect the SQL, constraints, locks, large-table behavior, old-client compatibility and downgrade/forward recovery. Use raw SQL when PostgreSQL-specific online DDL requires it, not as a blanket rule. Backfills are bounded and restartable.

```text
apps/api/db/migrations/versions/20261011_add_order_status.py
expand: add compatible column → deploy readers/writers → batch backfill
contract later: enforce NOT NULL/drop old column after old versions drain
```

**PYDB-06 MUST:** Store instants according to the selected DB's explicit UTC contract, not by assuming `DATETIME` means timezone-aware. For PostgreSQL use `timestamp with time zone`/`DateTime(timezone=True)` for instants; store calendar dates as `date`. Use DB defaults for audit timestamps only when DB clock owns them; business expiry decisions use an injected clock.

```python
# features/orders/shared/models.py — Python/PostgreSQL
created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True), server_default=func.now(), nullable=False
)
# Handler: now = ctx.clock.now()  # aware UTC, independently testable
```

**Verification:** real PostgreSQL action tests, two concurrent cancellations, FK/unique rejection, index plans, migration from the prior released schema and recovery after interrupted backfill. **Exception:** MySQL/another DB keeps these invariants but selects its own DDL, timestamp driver contract and plan tool. Sources: [SQLAlchemy typed mappings](https://docs.sqlalchemy.org/en/20/orm/declarative_tables.html), [async concurrency](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html), [Alembic autogenerate](https://alembic.sqlalchemy.org/en/latest/autogenerate.html), [PostgreSQL time](https://www.postgresql.org/docs/current/datatype-datetime.html).
