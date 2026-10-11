# Backend pattern inventory
**TypeScript implementation:** Apply the shared [backend rule](../shared/01-actions-and-boundaries.md); this guide supplies TypeScript-specific conventions and examples.

**Scope:** TypeScript backend. Select for a concrete invariant; a pattern does not require its own class or package. [Feature layout](01-service-design.md) and [example names](../../recipes/example-conventions.md) remain authoritative.

| Pattern | Use when | Shape here / limit |
| --- | --- | --- |
| Vertical feature/action slice | An action has API, rules and data work | `features/orders/cancel-order/{api,contract,handler}.ts`; omit unused files |
| Composition root | A service binds DB, ports, telemetry and feature registrations | `src/app/` binds once; feature files do not create process clients |
| Transactional handler / unit of work | Several writes must succeed together | `defineHandler({ transaction: true })` joins one context; no nested independent commits |
| Conditional state transition | A write must win exactly once | DAL update checks state/version and returns affected count; use constraints for cross-row invariants |
| Transactional outbox | Committed state requires event or job-start intent | Handler writes intent through `db`; relay sends after commit and may resend |
| Idempotent consumer | Broker can redeliver | Stable `(consumerId, source, eventId)` receipt with owned effect; ack after commit |
| Port and adapter | External protocol or vendor may vary | Feature imports `ShippingRates`; `integrations/outbound/shipping/` owns provider SDK |
| Anti-corruption adapter | Provider words/states differ from ours | Inbound adapter translates signed Stripe callback to our validated event; no provider type in handler |
| RPC capability client | A separate service must answer synchronously | Feature owns protobuf method; caller uses a narrow generated-client wrapper and deadline |
| Workflow / compensation | Ordered durable steps, timers or recovery are required | Feature `background/` definition; adapter executes supported subset; compensation is a new action |
| Cache-aside | A measured read bottleneck tolerates declared staleness | Named `cache.ts`; handler authorizes and calls `getOrLoad` visibly |
| Declarative audit | A consequential action needs attributable evidence | Feature declares action/resource; factory persists confirmed success with state |

### One operation, two patterns

```ts
// features/orders/cancel-order/handler.ts — project-owned factory API
export const cancelOrder = defineHandler({
  name: OrderAction.Cancel,
  transaction: true,
  audit: {
    action: AuditAction.OrderCancelled,
    resourceType: AuditResource.Order,
    resourceId: ({ result }) => result.id,
  },
  run: async ({ input, actor, db, deps }) => {
    const order = await orderDal.getOwned(db, actor, input.orderId);
    assertCancellable(order);
    const changed = await orderDal.cancelIfPending(db, order.id);
    if (changed !== 1) throw new OrderConflictError();
    await deps.outbox.add(db, OrderCancelled.create({ orderId: order.id }));
    return { id: order.id, status: OrderStatus.Cancelled };
  },
});
```

The state change, required audit and event intent commit together. The relay and consumers follow [outbox/receipt rules](recipes/outbox-and-consumers.md). The named rule explains eligibility; the DAL condition enforces it under concurrency. Factory APIs and adapters are project conventions, not library exports.

**Choose simply:** start with a plain function for a local pure decision, an in-process public operation for another feature in the same service, and direct calls when no durable handoff exists. Add a port, broker, cache or workflow when its named failure/scale need is present. **Check:** trace one action through trusted scope, conditional write, commit, delivery and repeat handling. Sources: [microservice pattern catalog](https://microservices.io/patterns/), [Fastify encapsulation](https://fastify.dev/docs/latest/Reference/Encapsulation/), [Temporal workflows](https://docs.temporal.io/workflow-definition).
