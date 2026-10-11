# Backend testing and proof

**Scope:** TypeScript and Python backend actions. Runtime profiles provide their server/database fixture APIs. **Why:** test externally visible behavior and durable state with a small, meaningful suite.

**BEST-01 MUST:** Put action scenarios next to their action or in a mirrored action test folder. Test the real HTTP/API boundary and database for success, input/access rejection, state conflict and required side effects. Add isolated algorithm/query tests only for risks that action tests do not reveal clearly.

```text
features/orders/cancel_order/test_cancel_order.py  # Python action-local option
features/orders/cancel-order/cancel-order.test.ts    # TypeScript action-local option
```

**BEST-02 MUST:** The shared test fixture owns app lifespan, isolated DB state, provider-recording adapters and cleanup. Business helpers create prerequisite state through public actions; private invokers send raw requests. Keep typed defaults and per-call overrides; invalid input uses a raw request.

```text
setup: create_user() → create_order(owner)
invoke: cancel_order(owner, id)
assert: response + get_order status + committed event intent/delivery
```

**BEST-03 MUST:** Tests fail for the intended reason. Assert a specific error/state, unchanged data and no committed success intent on rejection; use bounded waits for asynchronous effects. Verify infrastructure failure matrices once, then action-specific behavior in each feature.

```text
not owner → chosen 403/404 disclosure policy + order still Pending + no OrderCancelled outbox row
owner → 200 + order Cancelled + one stable event identity (retry may republish)
```

**Verification:** run tests on the selected DB engine with isolated namespaces and inspect setup helpers for duplicated business logic. **Exception:** a focused pure unit test is appropriate for a substantial deterministic algorithm. Sources: [pytest fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html), [FastAPI testing](https://fastapi.tiangolo.com/tutorial/testing/).
