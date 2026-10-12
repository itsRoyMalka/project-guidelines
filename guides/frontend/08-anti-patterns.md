# Frontend anti-patterns

**Scope:** React web and shared React Native feature flows. These are review signals; the owning [architecture](01-architecture.md), [state](02-state-and-forms.md), [UI](03-ui-and-accessibility.md) and [testing](07-testing.md) guides define the rules.

| Avoid | Why it fails | Use instead |
| --- | --- | --- |
| Copy props, Query data or a computed list into state with an effect | Two values drift and cause extra renders | Derive during render; keep state only for an actual edit draft |
| Give both the fullstack router and Query ownership of the same server record | Refetch and invalidation disagree | Choose the profile's single server-data owner |
| Fetch in a view or import a vendor client in a feature | UI now owns transport and lifecycle | Flow `api/` plain request, options and hook; shared injectable client/adapter |
| Leave scope, filter or locale out of a Query key; invalidate only a detail after a list mutation | Wrong cached result or stale list | Central key factory with every result-changing input; invalidate affected keys |
| Silently mirror URL filters into local state | Back/Forward and shared links show different results | URL owns applied state; input draft is temporary and reconciles on navigation |
| Put server records or every form field in Zustand | Duplicates Query/router and form lifecycles | Query/router for server data, React Hook Form for drafts, local state for local UI; store only genuinely shared client state |
| Put order policy in the design system or build raw controls in a feature | Reuse and accessibility boundaries break | DS owns accessible primitives; feature composes business behavior |
| Navigate, log analytics or mutate data during render | Re-renders duplicate effects | User event or confirmed outcome handler; effect only for external synchronization |
| Hide an action only in the UI and treat that as authorization | Direct requests can still reach the backend | Backend enforces permission; FE gate improves the experience |
| Hard-code `left`/`right`, English text or array-position test IDs | RTL, localization and stable automation fail | Logical CSS, feature messages, shared semantic IDs forwarded to controls |
| Snapshot every child component and mock away the feature's behavior | Large maintenance cost with little flow proof | A focused feature interaction test plus selected E2E journeys |
| Invent padding, type sizes or motion timings in each feature | Screens drift and global changes become expensive | Semantic DS roles and the [visual defaults](11-visual-composition.md) |
| Design only with short demo text and a successful response | Real content hides actions or breaks layout | Typed difficult-content fixtures and rendered state review under VIS-06 |
| Animate every update or delay completion for an effect | Repeated tasks feel slow and state becomes misleading | Purposeful, interruptible motion under [MOT-01–04](12-interaction-and-motion.md) |

### Small correction

```tsx
// features/orders/browse/ui/order-list/order-list.tsx
const pendingOrders = orders.filter(order => order.status === OrderStatus.Pending);
return <OrderListView orders={pendingOrders} />;
```

`orders` comes from the flow's selected server-data owner; `OrderStatus` comes from the shared contract. Imports are omitted. `pendingOrders` needs no effect or second state owner. If the user is editing filters, keep that draft separate from the URL's applied filter until Apply. **Check:** change the input, navigate Back/Forward, and confirm the displayed state matches its owner.

**Exception:** A measured expensive pure calculation may be memoized; a draft can deliberately diverge from committed data until Save/Discard. Record the ownership and reconciliation under [GOV-05](../00-governance.md). Sources: [React: effects](https://react.dev/learn/you-might-not-need-an-effect), [React: state structure](https://react.dev/learn/choosing-the-state-structure), [TanStack Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [React Router state](https://reactrouter.com/explanation/state-management).
