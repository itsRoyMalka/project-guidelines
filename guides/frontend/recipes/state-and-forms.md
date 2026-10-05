# State, forms and identity transitions

Applies to [STATE rules](../02-state-and-forms.md). Select a [runtime profile](../../profiles/README.md) first.

## One owner per resource

For ordinary routes, the router loader reads the resource and the action changes it; successful actions trigger loader revalidation. In a split SPA these are client loaders/actions calling the API. In fullstack they are server functions calling the application operation. Do not also fetch the same resource in a mount effect. Forward cancellation to supported network calls; an aborted request is not proof a mutation was rolled back.

Choose TanStack Query when persistent client caching, polling or shared background refresh warrants it. Then queries own remote data and mutations invalidate affected keys; the route can prefetch into that cache. Include all result-changing arguments and tenant scope in keys. Server authorization still checks every request. Never put secrets in keys or persist sensitive caches without an explicit data policy.

## Form lifecycle

1. Read the resource and version; initialize a draft once per resource identity. Do not overwrite dirty fields on background refresh.
2. Use native inputs and browser semantics first; choose React Hook Form for complex field arrays or rich validation. Client schemas improve feedback; the server remains authoritative.
3. Submit the version with the intended change. Keep field errors separate from global errors; map only stable, safe server field paths. Focus an error summary or the first invalid field.
4. A version conflict keeps the draft and offers refresh/compare/reapply. A timeout keeps the operation identity and offers status/retry with the same idempotency key when supported; do not invent a second operation.
5. On confirmed success, revalidate the owner and reset against confirmed values. Disable duplicate submission while pending, without trapping navigation or losing a draft silently.

```ts
// Conceptual draft state; the chosen form library can own these fields.
type Draft<T> = {
  scopeKey: string; // account/tenant identity; no secrets
  generation: number; // reject late work, including A → B → A transitions
  resourceId: string; baseVersion: number; values: T; dirty: boolean;
};
type SaveResult =
  | { kind: 'saved'; version: number }
  | { kind: 'invalid'; fields: Record<string, string> }
  | { kind: 'conflict' }
  | { kind: 'unknown'; operationId: string };
```

## Identity changes

On logout or tenant/account switch: stop new work under the old identity; abort pending reads, clear/partition remote caches and drafts, replace scoped subscriptions, then fetch with the new verified session. Guard against a late old response updating the new view (generation/scope check). SSR caches and mutable session state are request-scoped, never shared module globals. Revalidate privileges after membership changes; revocation is enforced by the backend even if an old UI remains open.

## Proof and alternatives

Test dirty draft plus refetch, safe field errors, stale version, unknown outcome, logout during a slow read, and two SSR users concurrently. For read-only/simple forms, native forms plus router state are enough. Offline mutation queues require a separate conflict/sync profile and are outside this baseline.
