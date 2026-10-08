# Backend feature slices

**Scope:** TypeScript server code. **Why:** each action is easy to find, understand and test. Deployable boundaries belong to [architecture](../01-architecture.md).

```text
src/features/orders/
  db/{orders,enums}.prisma
  shared/{contract,dal,types,errors}.shared.ts
  cancel-order/
    api.ts
    contract.ts                 # local contract; re-export shared wire contract if present
    validations.ts              # optional extra parsed-request checks
    handler.ts
    cancel-order.test.ts
  create-order/{api,contract,handler}.ts
  api.ts                        # this feature's endpoint list
  index.ts                      # public business operations
src/app/                        # composition and service lifecycle
src/shared/                     # genuine cross-feature capabilities
src/integrations/               # provider ports and adapters
```

Brace notation abbreviates separate files. Create only responsibilities the action needs.

**BE-01 MUST:** Organize by feature, then action. A feature owns its writes; other features call its public operations and never its private DAL.

**BE-02 MUST:** The API parses input and establishes trusted identity; the handler checks resource access and business state. Tenant scope exists only in multi-tenant products.

**BE-03 SHOULD:** Use `api`, `contract`, `handler`, `dal` and optional `validations` responsibilities. Keep reusable code in feature `shared/`, grouped by responsibility; extract business helpers only when useful.

**BE-04 MUST:** Map typed internal failures to safe public errors once at the transport boundary. Preserve the cause for diagnostics and log unexpected errors once; do not return provider messages or stacks.

**BE-05 MUST:** The handler definition chooses transaction scope. A small app-owned `defineHandler` supplies app dependencies, telemetry and transaction execution; callers cannot override that choice. Nested actions join an explicit context, never silently open independent commits.

**BE-06 SHOULD:** A service chassis owns config validation, telemetry startup, feature registration, HTTP/RPC, workers, readiness and bounded shutdown. Register dependencies once; keep seed/demo data outside bootstrap.

**BE-07 MUST:** Keep transactions short and exclude external network calls. Commit state plus required event/job intent together; external effects use [durable outcome rules](recipes/idempotency.md).

**BE-08 SHOULD:** Use factories only where they perform real work. `defineEndpoint`, `defineHandler`, `defineEvent` and job registration can enforce policy; a `defineDal` or `defineContract` wrapper is unnecessary without a repeated problem.

```ts
// Project-owned factory API: illustrative, not an installed package.
export const cancelOrder = defineHandler({
  name: OrderAction.Cancel,
  transaction: true,
  run: async ({ input, actor, tx }) => {
    const order = await orderDal.getOwned(tx, actor, input.orderId);
    assertCancellable(order);
    await orderDal.cancelIfPending(tx, order.id);
    await outbox.add(tx, OrderCancelled.create({ orderId: order.id }));
    return { id: order.id, status: OrderStatus.Cancelled };
  },
});
```

**Check:** follow one request through policy, handler, DAL, commit and [action test](07-testing.md). **Vary when:** an existing healthy layout can remain under a recorded exception. Further reading: internal review record (not distributed).

Chassis startup: telemetry → validated config → DB/provider capabilities → feature manifests → HTTP/RPC/consumers/workers → readiness. Shutdown stops new work, drains with a deadline, releases leases and closes resources. Features do not own process hooks.
