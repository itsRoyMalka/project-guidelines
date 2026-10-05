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

**STATE-02 MUST:** Give cached server resources stable identities that include all scope and filter parameters; in TanStack Query, encode them in query keys. Mutations define revalidation/invalidation or optimistic update/rollback according to the chosen owner. Do not use cached server data as a second business database.

**STATE-03 MUST:** Keep shareable navigation state in the URL and validate it on read. Avoid losing filters on refresh, back/forward navigation, or copied links. Secrets and large drafts do not belong in URLs.

**STATE-04 SHOULD:** Use React Hook Form and a shared schema for nontrivial forms. Validate on both client and server, show field errors near fields, and preserve edits on recoverable server failure. The server is authoritative.

**STATE-05 MUST:** Show pending state on the action that initiated a mutation, prevent unintended duplicates, and explain failure with a recovery path. Use optimistic UI only with a defined rollback and conflict story.

**STATE-06 SHOULD:** Introduce Zustand/Jotai/Redux only for state that truly crosses feature/component boundaries and is not server or URL state. Select the smallest subscribed slice. Record why context/local state is insufficient.

**STATE-07 MUST:** When a route loader and TanStack Query both touch the same resource, declare which owns freshness, mutation updates, and error handling. A loader may prefetch/dehydrate a query cache, but must not create an independent second cache with conflicting staleness rules.

**Verification:** refresh/back-link behavior, mutation failure and retry tests, and a state-ownership review. Further reading: [React Router modes](https://reactrouter.com/start/modes), [TanStack Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [React effects](https://react.dev/learn/you-might-not-need-an-effect).
