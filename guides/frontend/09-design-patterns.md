# Frontend pattern inventory

**Scope:** React web and shared React Native feature conventions. Use a pattern to solve a named ownership or interaction problem; skip unused files. [FE architecture](01-architecture.md) and the selected [profile](../profiles/README.md) own the actual rules.

| Pattern | Use when | Shape here / limit |
| --- | --- | --- |
| Page composition + feature flow | A page combines independent user capabilities | `pages/orders/page.tsx` composes public `features/orders/*` surfaces; no private cross-feature imports |
| Smart flow + presentational view | Fetch/mutation/permission state would clutter reusable UI | Flow component binds hooks and callbacks; view accepts data/state/callbacks |
| Plain request + hook | Split/mobile feature needs testable transport and Query lifecycle | `api/cancel-order.ts` accepts `ApiClient`; `use-cancel-order.ts` binds client/Query |
| Server-data owner | Data is loaded or mutated across navigation | Fullstack loader/action/revalidation **or** split/mobile Query; never both for the same datum |
| Query key factory | Result varies by ID, filter, auth scope or locale | `shared/api/query-keys.const.ts`; include every result-changing input |
| URL state codec | Filters, selection or section must survive reload/deep link | Page `params.ts` parses/serializes applied state; temporary input stays local |
| Form draft | User can edit, validate, Save or Discard | React Hook Form + contract schema; explicit reset after confirmed save/external change |
| Feature-owned store slice | Client state must be shared across distant components | Feature exports selectors/actions; `app/store.ts` composes; no server-data mirror |
| Design-system component | A control or visual primitive has reusable states and accessibility behavior | DS owns tokens, semantics and test-ID forwarding; feature owns order policy |
| Port + provider hook | Analytics, flags or another external service may vary | App provider binds adapter; feature calls a narrow typed hook |
| Capability gate | UI should show allowed actions | `useCan(OrderAction.Cancel, order)` guides UI; backend remains authoritative |
| Feature interaction test | A feature has a meaningful user-visible state change | Render with shared providers/handlers, act by shared IDs, assert state and effects |

### One flow boundary

```ts
// features/orders/shared/api/query-keys.const.ts — split/mobile profile
export const orderKeys = {
  all: (scope: OrderScope) => ['orders', scope] as const,
  list: (scope: OrderScope, filter: OrderFilter) =>
    [...orderKeys.all(scope), 'list', filter] as const,
  detail: (scope: OrderScope, id: string) =>
    [...orderKeys.all(scope), 'detail', id] as const,
};
```

`OrderScope` and `OrderFilter` are project-owned contract types; imports are omitted. Scope includes the result-changing identity/tenant context where relevant; filter is normalized before keying. The cancel mutation invalidates the affected list and detail. Fullstack loader data instead revalidates through its router. **Check:** a scope/filter change reads a distinct result, and a cancellation refreshes every affected surface.

**Choose simply:** keep a pure view local until reused; add a store, provider or abstraction only when a real cross-component owner or integration exists. Sources: [React state structure](https://react.dev/learn/choosing-the-state-structure), [React effects](https://react.dev/learn/you-might-not-need-an-effect), [TanStack Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [Testing Library principle](https://testing-library.com/docs/guiding-principles/).
