# Python backend action tests

**Scope:** FastAPI actions, consumers and DAL risks. Shared [test philosophy](../shared/04-testing-and-proof.md) owns what to prove. **Why:** a small real-boundary suite catches integration failures without maintaining tests for every internal file.

**PYTEST-01 MUST:** Put `test_<action>.py` in the action folder (or a mirrored folder when package tooling requires it). Use the real ASGI app and target DB engine, with an isolated database namespace and lifespan-managed clients (see [test harness](recipes/test-harness.md)). The test stack uses HTTPX plus `asgi-lifespan` for async app startup/shutdown. No test-only branch in production code. Exclude co-located tests from release artifacts.

```text
src/orders/features/orders/cancel_order/test_cancel_order.py
tests/lib/api.py       # app+DB lifecycle; one fixture owns cleanup
tests/lib/orders.py    # business helpers bound to this fixture's client
```

**PYTEST-02 MUST:** A shared `ApiTestContext` owns the client, real DB, app lifespan, recording provider adapter and cleanup. Private invokers send requests; public business helpers compose actions (`create_user`, `create_order`) with typed defaults/overrides and assert setup success. Use raw requests for invalid-input cases.

```python
# tests/lib/orders.py — Python helper, bound to one ApiTestContext
class CreateOrderOverrides(TypedDict, total=False):
    quantity: int
    item_id: UUID

@dataclass(frozen=True)
class OrderDefaults:
    quantity: int = 1

ORDER_DEFAULTS: Final = OrderDefaults()

async def create_order(api: ApiTestContext, actor: Actor,
                       overrides: CreateOrderOverrides | None = None) -> OrderView:
    values = overrides or {}
    payload = CreateOrderInput(
        quantity=values.get('quantity', ORDER_DEFAULTS.quantity),
        item_id=values.get('item_id') or await api.ensure_item(actor),
    )
    response = await api.invokers.create_order(actor, payload)
    assert response.status_code == 201
    return OrderView.model_validate(response.json())
```

Defaults are immutable, overrides are typed and each helper call creates the prerequisite item only when needed. The `assert` here is test code; invalid-input tests use raw requests rather than the helper.

**PYTEST-03 MUST:** Each action scenario follows setup → invoke → assert response → assert durable state/side effects. Test success, validation/authorization rejection, state conflict and one high-risk edge. For a rejected write assert unchanged state and no committed success audit/outbox intent. Do not assert absence by sleeping.

```python
# features/orders/cancel_order/test_cancel_order.py — Python async action test
pytestmark = pytest.mark.anyio

async def test_owner_cancels_order(api: ApiTestContext) -> None:
    owner = await api.create_user()
    order = await api.create_order(owner)

    response = await api.cancel_order(owner, order.id)

    assert response.status_code == 200
    assert (await api.get_order(owner, order.id)).status == OrderStatus.CANCELLED
    await api.events.wait_for(OrderEvent.CANCELLED, order_id=order.id)
```

**PYTEST-04 MUST:** Provider tests inspect URL/headers/body and response/error translation at the adapter boundary. Consumer tests invoke the dispatcher with a real receipt store; infrastructure tests separately prove relay retry/duplicate behavior. A focused DAL test is added only for a query plan, constraint or concurrency case not clearly proved through the API.

```text
provider adapter: request idempotency key + 429 retry policy + malformed response
consumer: duplicate event ID → one committed effect; exhausted retry → recovery record
```

**Verification:** `pytest` passes against the selected DB engine, isolation holds under parallel runs, partial setup is cleaned and fixture teardown drains workers before closing DB. **Exception:** a pure algorithm test can be narrower; an external live provider check is recorded separately. Further reading: [FastAPI testing](https://fastapi.tiangolo.com/tutorial/testing/), [async tests](https://fastapi.tiangolo.com/advanced/async-tests/), [pytest fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html).
