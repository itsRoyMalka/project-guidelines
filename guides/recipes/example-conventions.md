# Read and write examples consistently

Examples demonstrate the owning guide's rules. They are excerpts, not a shipped framework. Each technical example names its target file and runtime; application-owned helpers must be implemented and proven in the consuming project. Imports and surrounding setup may be omitted only when the required context is stated.

## Names and placement

| Concept | Convention/example |
| --- | --- |
| Action files | `features/orders/cancel-order/{api,contract,handler}.ts` on BE; `features/orders/cancel/{api,ui}/` on FE |
| Feature sharing | `shared/dal.shared.ts`, `shared/contract.shared.ts`; only genuinely reused definitions |
| Constants/types | `OrderStatus.Pending`, `OrderAction.Cancel`, `OrderEvent.Cancelled`; PascalCase types/maps |
| Functions/hooks | `cancelOrder`, `cancelOrderRequest`, `useCancelOrder`; camelCase behavior names |
| UI | `CancelOrder`, `OrderRow`; PascalCase DS/feature components |
| Tests | `cancel-order.test.ts` / `cancel.test.tsx`; descriptive scenario names |
| Factories | `defineHandler`, `defineEndpoint`, `defineConsumer`: application conventions, not library exports |

Boundary literals are declared once; call sites import the map. Field keys and human prose need not become constants just for ceremony. SQL/schema literals are wire/storage declarations and must agree with contract values.

```ts
// packages/contracts/orders/orders.const.ts — shared declaration source
export const OrderStatus = { Pending: 'pending', Cancelled: 'cancelled' } as const;
export const OrderAction = { Read: 'orders:read', Cancel: 'orders:cancel', Confirm: 'orders:confirm' } as const;
export const OrderEvent = { Cancelled: 'orders.cancelled' } as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
```

Other examples introduce capability-specific maps such as `AuditAction`, `PaymentConsumer` and `DocumentState` at their owning declaration boundary. They are not guessed SDK exports. Values from those maps are reused in handlers, schemas and tests.

## Keep an excerpt honest

- State whether code is library usage, project-owned API design, or pseudocode. Use `text` for algorithms instead of pretending a partial algorithm compiles.
- Preserve authorization, transaction context, checked writes, audit/outbox and retry identity when those affect the example's correctness.
- Keep FE Query examples in split/mobile profiles; fullstack route examples use router ownership. Render feature UI through DS components with translations and shared test IDs.
- Name omitted dependencies and point to their owner. A file tree should agree with the snippet's placement and the selected runtime.
- Show a relevant failure/assertion alongside the happy path or link the owning proof cases. Do not imply a snippet was run without evidence.

Policy guides use small filled records/config examples rather than unrelated code. Indexes link to current examples instead of duplicating them. [Reference flow](../06-reference-flow.md) shows the shared contract/API/FE boundary. The adopting project records actual checks for its implementation.
