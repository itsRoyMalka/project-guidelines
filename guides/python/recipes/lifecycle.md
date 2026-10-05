# Python backend lifecycle

Applies to [Python rules](../01-backend.md) with shared [identity](../../cross-cutting/recipes/identity.md), [transactions/retries](../../backend/recipes/idempotency.md) and [verification](../../cross-cutting/recipes/local-and-test.md).

## Pick one coherent I/O model

For an ordinary blocking database/client stack, use synchronous path operations and scoped synchronous sessions. For an async stack, use async drivers/clients end to end; `async def` does not make blocking calls nonblocking. FastAPI offloads its synchronous path/dependency functions; ordinary synchronous helper calls from async code still run where called. CPU-intensive or long durable work belongs in a bounded worker/process model. Offloading blocking I/O requires thread limits, deadlines and cancellation semantics; cancellation may not stop the underlying call.

Create a process-level engine/client pool during application lifespan and close it at shutdown. A database session belongs to one unit of work: Session per thread, AsyncSession per task. Concurrent tasks must not share a mutable session. Pass an explicit session to nested operations participating in one transaction; they must not commit independently.

```python
# Illustrative SQLAlchemy 2 async unit of work; engine/factory owned by lifespan.
async def cancel_order(factory, tenant_id, order_id, version):
    async with factory() as session:
        async with session.begin():
            # Scoped conditional UPDATE; assert one changed row.
            # Write audit/outbox intent in this same transaction.
            return await cancel_scoped(session, tenant_id, order_id, version)
```

`cancel_scoped` is a conceptual application operation, not supplied library code. Authenticate/authorize at the boundary and inside reusable policy-aware operations; never trust an arbitrary tenant argument. Test rollback on exceptions and cancellation. Hold no transaction open during a slow provider call. A background request task is not durable; pass IDs, not request/session objects, to a durable worker that opens its own resources and follows the outbox/outcome protocol.

## Synchronous unit of work

A synchronous FastAPI dependency and path operation are not by themselves proof that every session interaction stays on the same worker thread. Avoid concurrent use and any undocumented thread-affinity assumption. Put creation, use, transaction completion and close in the same synchronous callable; offload that whole callable when an async route needs it.

```python
# Illustrative: invoke directly from a sync path operation, or offload the whole
# callable using the framework's supported bounded thread mechanism.
def cancel_sync(factory, trusted_scope, order_id, version):
    with factory() as session:
        with session.begin():
            return cancel_scoped_sync(session, trusted_scope, order_id, version)
```

The operation returns detached public values, not lazy ORM objects requiring a session on another thread. Thread pools and database pools need a joint concurrency budget. Select one tested sync/async profile for the operation instead of scattering offloads around individual session methods.

## Tooling, migration and proof

Use a supported Python runtime, `pyproject.toml`, a chosen reproducible lock tool and one formatter/linter/typecheck policy (for example Ruff plus mypy or Pyright). Choose `src/` packaging for a new installable service; preserve a sound existing layout. Typecheck owned application boundaries; explicitly narrow dynamic library values.

For Alembic, review generated revision SQL and data assumptions manually. Run on the chosen engine/version; do not equate SQLite with production PostgreSQL. Use expand/bridge/backfill/contract from the [migration recipe](../../backend/recipes/migrations.md), including old writers, lock budget, restartability and a rollback cutoff. Do not embed a huge non-resumable backfill in a schema transaction by default.

Tests use isolated database namespaces and lifespan-managed clients, assert policy failures, rollback, concurrent sessions, worker retry and shutdown. This handbook's Python snippet is explanatory and was not executed as a full service fixture; the consuming project must verify its selected driver/framework versions.

Sources: [FastAPI async](https://fastapi.tiangolo.com/async/), [SQLAlchemy async session concurrency](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html#using-asyncsession-with-concurrent-tasks).
