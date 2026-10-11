# Python API test harness

Applies to [PYTEST-01/02](../06-testing.md). The fixture owns app startup, isolated PostgreSQL state, provider recording and teardown; helpers are bound to its client. This is project-owned scaffolding, not a supplied library.

```python
# tests/lib/api.py — Python async pytest fixture excerpt
@pytest.fixture
async def api(test_database_url: str) -> AsyncIterator[ApiTestContext]:
    app = create_app(
        settings=test_settings(database_url=test_database_url),
        providers=RecordingProviders(),
    )
    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url='http://test') as client:
            context = ApiTestContext(client=client, app=app)
            try:
                yield context
            finally:
                await context.stop_workers_and_clear_owned_data()
```

`test_database_url` allocates an isolated schema/database per parallel worker and drops only what it owns. `create_app` takes injected adapters but runs the same production route, auth, handler and DB code. `LifespanManager` is a selected test dependency because `ASGITransport` does not itself run app lifespan. The context exposes business helpers (`create_user`, `create_order`) and private raw invokers; it is never a process-global singleton. Clean up partial startup as well as normal teardown.

```python
# features/orders/cancel_order/test_cancel_order.py — Python action proof
pytestmark = pytest.mark.anyio

async def test_non_owner_cannot_cancel(api: ApiTestContext) -> None:
    owner = await api.create_user()
    other = await api.create_user()
    order = await api.create_order(owner)

    response = await api.cancel_order(other, order.id)

    assert response.status_code == 404  # chosen no-existence disclosure policy
    assert (await api.get_order(owner, order.id)).status == OrderStatus.PENDING
    assert await api.outbox.count(OrderEvent.CANCELLED, order_id=order.id) == 0
```

**Proof:** fixture works under parallel pytest workers, closes sessions/clients/workers, and a rejected action leaves no committed audit/outbox success. Sources: [FastAPI async tests](https://fastapi.tiangolo.com/advanced/async-tests/), [HTTPX ASGITransport](https://www.python-httpx.org/advanced/transports/), [ASGI LifespanManager](https://github.com/florimondmanca/asgi-lifespan).
