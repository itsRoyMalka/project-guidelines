# Backend action tests

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
test('owner cancels an eligible order', async ({ createUser, createOrder, cancelOrder, getOrder, sideEffects }) => {
  const owner = await createUser();
  const order = await createOrder(owner, { quantity: 2 });
  const response = await cancelOrder(owner, order.id);
  expect(response.statusCode).toBe(200);
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
