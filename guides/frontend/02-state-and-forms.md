# Frontend state, data, and forms

**Applies to:** React apps. Choose one owner for each piece of state and make URL behavior visible to users.

| State | Default owner |
| --- | --- |
| Remote data and mutation status | React Router loaders/actions for ordinary route data; TanStack Query where persistent client cache, polling, or complex invalidation is justified. Select one owner per resource. |
| Shareable search, filters, sort, tab, pagination | URL, parsed and validated |
| Ephemeral dialog/input disclosure | Local component state |
| Durable cross-feature client state | Small named store only after need is proven |
| Form draft and validation | Form library or native form scope |

**STATE-01 MUST:** Do not copy props or query data into component state with an effect merely to derive another value. Derive during render or memoize an expensive pure transformation. Effects synchronize with external systems.

**STATE-02 MUST:** Cache identities include every scope/filter that changes returned data or visibility. On identity/tenant transitions, cancel obsolete work and clear or partition protected data; SSR caches are request-isolated. Mutations update/revalidate through the selected owner. See [state lifecycle](recipes/state-and-forms.md).

**STATE-03 MUST:** Keep shareable navigation state in the URL and validate it on read. Avoid losing filters on refresh, back/forward navigation, or copied links. Secrets and large drafts do not belong in URLs.

**STATE-04 SHOULD:** Use React Hook Form with schema validation for complex drafts; native forms are enough when simpler. Reuse compatible wire constraints without equating draft transforms with backend authorization/domain rules. Define initialization, dirty/reset state, field errors, conflict handling and edit preservation on recoverable failure.

**STATE-05 MUST:** Show pending state at the initiating action and prevent accidental duplicates; backend deduplication still follows API-06. Optimistic changes need rollback and conflict behavior. Define retry/cancel/unknown-outcome recovery and preserve the original idempotency key for retries of the same action.

**STATE-06 SHOULD:** Introduce Zustand/Jotai/Redux only for state that truly crosses feature/component boundaries and is not server or URL state. Select the smallest subscribed slice. Record why context/local state is insufficient.

**STATE-07 MUST:** When a route loader and TanStack Query both touch the same resource, declare which owns freshness, mutation updates, and error handling. A loader may prefetch/dehydrate a query cache, but must not create an independent second cache with conflicting staleness rules.

**Verification:** refresh/back-link behavior, mutation failure and retry tests, and a state-ownership review. Further reading: [React Router modes](https://reactrouter.com/start/modes), [TanStack Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [React effects](https://react.dev/learn/you-might-not-need-an-effect).
