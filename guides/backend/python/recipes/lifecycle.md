# Python backend I/O lifecycle

Applies to [PY-03](../01-backend.md), [PYDB-02](../04-persistence-and-migrations.md) and [action lifecycle](action-lifecycle.md). The app composition root owns process-level resources; each action owns a unit of work.

## Choose one coherent path

- Async profile: `async def` route → async provider/driver calls → one `AsyncSession` per action task. Do not share it with concurrent tasks or make a blocking call inside the event loop.
- Sync profile: synchronous route and operation → synchronous clients and scoped `Session`. Do not assume separate FastAPI sync dependencies and route bodies always execute on the same thread; create/use/close the session inside one synchronous callable.
- CPU-heavy or durable work: bounded worker/process with its own resources. A FastAPI background task is not a durable queue.

```python
# app/main.py — Python async profile; simplified lifespan ownership
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    engine = create_async_engine(settings.database_url.get_secret_value())
    app.state.sessions = async_sessionmaker(engine, expire_on_commit=False)
    app.state.actions = create_actions(app.state.sessions, providers, clock)
    try:
        yield
    finally:
        await providers.aclose()
        await engine.dispose()
```

`create_actions` is project-owned composition. It binds [transaction/audit behavior](action-lifecycle.md); feature handlers do not reach into `app.state`, create sessions or close engines. Real code initializes providers and readiness before yielding, configures [pool/TLS budgets](../12-database-sessions.md), and drains workers before closing resources.

```python
# app/sync_operation.py — Python alternative for a synchronous-only service

def cancel_sync(
    factory: sessionmaker[Session], input: CancelOrderInput, actor: Actor,
) -> CancelOrderOutput:
    with factory() as session, session.begin():
        return cancel_order_run_sync(HandlerContext(actor=actor, session=session), input)
```

The sync example is an alternative profile, not a helper called directly from the async route. Select one profile per operation; if bridging is necessary, offload the entire sync callable with bounded threads and test shutdown/cancellation behavior. Return detached public values, not lazy ORM rows that need the closed session.

**Proof:** app shutdown closes all pools, concurrent requests use different sessions, child operations join one transaction, rollback survives cancellation, and no provider call holds a DB transaction open. Sources: [FastAPI async](https://fastapi.tiangolo.com/async/), [lifespan](https://fastapi.tiangolo.com/advanced/events/), [SQLAlchemy AsyncSession concurrency](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html#using-asyncsession-with-concurrent-tasks).
