# Backend action tests
**TypeScript implementation:** Apply the shared [backend rule](../shared/04-testing-and-proof.md); this guide supplies TypeScript-specific conventions and examples.

**Scope:** API-backed TypeScript features. **Why:** prove the whole action with a small suite.

**BET-01 MUST:** Put `<action>.test.ts` inside its action folder. Use the real Fastify app, policy, handler and database via `app.inject()`; use a listening socket only for network-specific behavior.

**BET-02 SHOULD:** Cover important success, input/access rejection and state/failure boundaries. Add a DAL test only for a query, constraint or concurrency risk that API tests cannot prove clearly; use real DB tests for SQL behavior.

**BET-03 MUST:** Shared `test/lib` fixtures own app/database lifecycle and cleanup. Private invokers send one request; public helpers such as `createUser` compose prerequisite invocations and assert setup success. Bind helpers to the fixture app, never a global singleton.

**BET-04 MUST:** Keep typed defaults in named constants, accept `Partial<Input>` overrides and generate unique values per call. Invalid-input tests bypass defaults through raw requests. Test invokers keep expected public paths independent of server endpoint descriptors.

**BET-05 MUST:** Tests follow setup → invoke target → assert response → assert side effects. Use the real outbox/relay with an app-scoped recording publisher; await a matching event with a bounded timeout. Test real transport wiring separately and consumers through their dispatcher.

```text
test/lib/
  api-test.ts
  users.ts                       # createUser
  orders.ts                      # createOrder, cancelOrder, getOrder
  defaults/orders.ts
  invokers/orders.ts             # private raw requests
src/features/orders/cancel-order/cancel-order.test.ts
```

```ts
// test is imported from the shared api-test fixture below.
test('owner cancels an eligible order', async ({ api }) => {
  const { createUser, createOrder, cancelOrder, getOrder, sideEffects } = api;
  const owner = await createUser();
  const order = await createOrder(owner, { quantity: 2 });
  const response = await cancelOrder(owner, order.id);
  expect(response.statusCode).toBe(HttpStatus.Ok);
  expect((await getOrder(owner, order.id)).status).toBe(OrderStatus.Cancelled);
  const event = await sideEffects.events.waitFor({
    type: OrderEvent.Cancelled,
    where: event => event.data.orderId === order.id,
  });
  expect(event.version).toBe(1);
});
```

**Check:** test isolation, real authorization, rejected-write state and relevant side effects. **Vary when:** use a targeted pure unit test for a substantial algorithm; do not require test files for every internal file. No separate YAML test-plan protocol is required. Source: [Fastify testing](https://fastify.dev/docs/latest/Guides/Testing/).

```ts
// Typed defaults; fixture closure binds invokers to its own app.
const ORDER_DEFAULTS = { quantity: 1 } satisfies Partial<CreateOrderInput>;
const createOrder = async (actor: Actor, overrides: Partial<CreateOrderInput> = {}) => {
  const itemId = overrides.itemId ?? await ensureItem(actor);
  const input = { ...ORDER_DEFAULTS, itemId, ...overrides };
  const response = await invokers.createOrder(actor, input);
  assertSetupCreated(response);
  return response.json<OrderView>();
};
```

Cleanup must cover all app DB connections; an outer transaction alone is insufficient unless every request shares it.

## Transaction and delivery regressions

Use the [failure matrix](recipes/outbox-and-consumers.md#failure-checks) and [transaction proof](recipes/transactions.md). Exercise these in shared infrastructure tests once; feature tests cover their own state transitions, access and required intent.

For a rejected action, assert unchanged state and no committed outbox intent. Do not prove absence by sleeping or requiring exactly one transport call: retries may legitimately resend. For accepted work, verify committed intent and separately observe the relay delivering it; publication alone does not prove consumer completion.

For audited actions, assert one committed success record with safe actor/resource context. On rejection or rollback, assert no committed success audit, and the selected separate attempt record. See the [audit proof cases](recipes/audit.md).

### Example: fixture ownership

```ts
// test/lib/api-test.ts — Vitest fixture extension
import { test as base } from 'vitest';
export const test = base.extend<{ api: ApiTestContext }>({
  api: async ({}, use) => {
    const api = await createApiTestContext();
    try { await use(api); }
    finally { await api.close(); }
  },
});
```

`ApiTestContext` is this app's typed collection of bound helpers, sideEffects and close. `createApiTestContext` allocates isolated DB state, constructs the real app with recording provider adapters and starts the real relay; it cleans partial setup if construction fails. `close` stops workers before closing app/DB and removing owned test data. Helpers never use a global app. This fixture example defines lifecycle ownership, not a supplied test package.
