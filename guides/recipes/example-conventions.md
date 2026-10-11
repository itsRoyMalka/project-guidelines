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
| macOS boundary | `DesktopChannel.SaveExport`, `DesktopIntent.OpenOrder`, `DesktopCommand.OpenOrder`: app-owned maps, not Electron exports |
| macOS windows | `WindowKind.OrderDetails`: app-owned window identity, not a string repeated in routes or menus |
| macOS sync | `SyncCommand.SaveOrderDraft`, `SyncStatus.Pending`: app-owned maps declared beside the local/remote contract |

Boundary literals are declared once; call sites import the map. Field keys and human prose need not become constants just for ceremony. SQL/schema literals are wire/storage declarations and must agree with contract values.

```ts
// packages/contracts/orders/orders.const.ts — shared declaration source
export const OrderStatus = { Pending: 'pending', Cancelled: 'cancelled' } as const;
export const OrderAction = { Read: 'orders:read', Cancel: 'orders:cancel', Confirm: 'orders:confirm' } as const;
export const OrderEvent = { Cancelled: 'orders.cancelled' } as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
```

Other examples introduce capability-specific maps such as `AuditAction`, `PaymentConsumer` and `DocumentState` at their owning declaration boundary. They are not guessed SDK exports. Values from those maps are reused in handlers, schemas and tests.

## Keep examples coherent across guides

Use the same `orders.cancel` story and names across API, handler, data, UI and E2E excerpts. When a guide needs another scenario, name its boundary and avoid reusing an unrelated action or flag. Before adding an example, check the [reference flow](../06-reference-flow.md) and the relevant anti-pattern guide. In particular, preserve the selected profile's data owner, shared constant maps, authorization, transaction/outbox boundary, DS/i18n/test-ID rules and per-action tests. A snippet that intentionally omits one of these names that omission and links its owner.

Every rule prescribing code, config, file placement or call flow shows a small example beside the decision in its owning guide (GOV-06). Several adjacent rules may share one example when it visibly demonstrates each decision. A recipe can add detail but cannot be the only example. Workflow and governance guides use a filled record or trace when application code would misrepresent the rule. These examples are instructional excerpts, not a runnable shared package.

## Keep an excerpt honest

- State whether code is library usage, project-owned API design, or pseudocode. Use `text` for algorithms instead of pretending a partial algorithm compiles.
- Preserve authorization, transaction context, checked writes, audit/outbox and retry identity when those affect the example's correctness.
- Keep FE Query examples in split/mobile profiles; fullstack route examples use router ownership. Render feature UI through DS components with translations and shared test IDs.
- Name omitted dependencies and point to their owner. A file tree should agree with the snippet's placement and the selected runtime.
- Show a relevant failure/assertion alongside the happy path or link the owning proof cases. Do not imply a snippet was run without evidence.

Policy guides use small filled records/config examples rather than unrelated code. Indexes link to current examples instead of duplicating them. [Reference flow](../06-reference-flow.md) shows the shared contract/API/FE boundary. The adopting project records actual checks for its implementation.
