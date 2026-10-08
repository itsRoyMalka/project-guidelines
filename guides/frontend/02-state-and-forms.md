# Frontend state, data, and forms

**Applies to:** React apps. Choose one owner for each piece of state and make URL behavior visible to users.

| State | Default owner |
| --- | --- |
| Remote data and mutation status | TanStack Query in split/mobile apps; loaders/actions in fullstack route data. One owner per resource. |
| Shareable search, filters, sort, tab, pagination | URL, parsed and validated |
| Ephemeral dialog/input disclosure | Local component state |
| Durable cross-feature client state | Central Zustand store with feature-owned slices, only when needed |
| Form draft and validation | React Hook Form |

**STATE-01 MUST:** Do not copy props or query data into component state with an effect merely to derive another value. Derive during render or memoize an expensive pure transformation. Effects synchronize with external systems.

**STATE-02 MUST:** Cache identities include every scope/filter that changes returned data or visibility. On identity/tenant transitions, cancel obsolete work and clear or partition protected data; SSR caches are request-isolated. Mutations update/revalidate through the selected owner. See [state lifecycle](recipes/state-and-forms.md).

**STATE-03 MUST:** Keep shareable navigation state in the URL and validate it on read. Avoid losing filters on refresh, back/forward navigation, or copied links. Secrets and large drafts do not belong in URLs.

**STATE-04 MUST:** Use React Hook Form for every actual form, with explicit defaults and a Zod draft schema. Keep draft constraints separate where incomplete editing differs from the wire contract; preserve input on failed submission and map server field errors.

**STATE-05 MUST:** Show pending state at the initiating action and prevent accidental duplicates; backend deduplication still follows API-06. Optimistic changes need rollback and conflict behavior. Define retry/cancel/unknown-outcome recovery and preserve the original idempotency key for retries of the same action.

**STATE-06 SHOULD:** Use Zustand for genuinely global mutable client state; features own slice definitions and selectors, while `app/store.ts` composes them. Allow only the narrow feature-to-store-hook import edge; prevent runtime cycles. Redux Toolkit is a justified alternative.

**STATE-07 MUST:** Split web/API and mobile use TanStack Query by default; fullstack route data uses loaders/actions. One resource has one freshness owner; loaders may prefetch Query without creating a second cache.

**Verification:** refresh/back-link behavior, mutation failure and retry tests, and a state-ownership review. Further reading: [React Router modes](https://reactrouter.com/start/modes), [TanStack Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [React effects](https://react.dev/learn/you-might-not-need-an-effect).

**STATE-08 MUST:** URL owns applied shareable state; form owns its draft. Commit search on submit by default. Live search debounces URL updates, replaces history and cancels obsolete requests; never debounce save/destructive actions.

**STATE-09 MUST:** Save resets the draft baseline only after confirmed success; discard uses the latest known saved snapshot. Never overwrite dirty edits on a background refresh. Persist drafts only for a defined product need, privacy policy and expiry.

```ts
const form = useForm<SearchDraft>({ defaultValues: { query: params.query } });
const submit = form.handleSubmit(draft => updateParams({ query: draft.query, page: 1 }));
```

Reset form drafts on external Back/Forward navigation without remounting the input. Live-search synchronization must distinguish its own URL write from external navigation. Global stores are request-scoped for SSR; neither server data, URL state nor form drafts belong there.
