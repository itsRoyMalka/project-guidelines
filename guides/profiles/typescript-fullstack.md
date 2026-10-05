# TypeScript full-stack profile

**Choose when:** one web product and release owner benefit from one server deployment. Prerequisites: [architecture](../01-architecture.md), [identity](../cross-cutting/recipes/identity.md), [TypeScript](../04-typescript.md).

Use React Router framework mode with SSR enabled and a supported Node adapter. Routes export loaders/actions; server-only feature operations own authorization, domain rules and persistence. A browser receives public loader/action data, never sessions, provider tokens or database objects. Use the framework's `.server` module boundary, and verify the client bundle as well as reviewing imports.

```text
app/root.tsx                  # shared document/layout
app/routes.ts                 # route map
app/routes/orders.tsx         # loader/action and UI composition
app/features/orders/
  order.server.ts             # authorized operation + persistence boundary
  order.contract.ts           # public wire schema, if a wire contract is needed
  order-view.tsx              # browser-safe UI
```

A loader calls a server operation directly. A Form/fetcher action parses input, validates session and CSRF controls, invokes the operation, then lets the router revalidate the route data. Do not introduce internal HTTP solely to communicate within the same runtime. Public machine APIs, when actually needed, use the [HTTP contract pipeline](../backend/recipes/contracts.md).

Session, config and database connections are request/process-scoped appropriately. The module export surface prevents browser imports of persistence. Repeated writes and concurrent transitions still require [idempotency](../backend/recipes/idempotency.md); a disabled submit button is insufficient.

**Proof:** build client/server artifacts; reject a deliberate server-only import in client code; test a loader→action→revalidation path and public output; verify auth/CSRF and real persistence in the target project. The handbook fixture tests a narrow runtime flow, not production identity/storage.

**Alternative:** the [split profile](typescript-split.md) when external API consumers or independent deployment justify it. Framework-required default route exports are valid. Source: [React Router modes](https://reactrouter.com/start/modes); the architecture choice is contextual.
