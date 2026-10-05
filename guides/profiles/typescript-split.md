# TypeScript separate web/API profile

**Choose when:** distinct API clients, static hosting, trust or release requirements warrant separate deployables. Prerequisites: [API](../backend/02-api-contracts.md), [identity](../cross-cutting/recipes/identity.md), [frontend state](../frontend/02-state-and-forms.md).

Default shape: a static React Router SPA and Fastify API. Set the selected framework's SPA mode explicitly. Route data uses client loaders/actions calling a typed API adapter; server-only loaders are not available in static hosting. API operations own identity/resource policy, transactions and public errors. For React Router framework SPA mode, put `HydrateFallback` on the root route and keep document markup plus `<Scripts />` in the shared root `Layout`, so the fallback can hydrate. Even SPA mode renders the initial shell during build; do not access browser-only globals at module evaluation/render without the framework-supported boundary. Deploy routing fallback and cache headers so deep links and hashed assets work.

```text
apps/web/app/routes/          # clientLoader/clientAction + UI
apps/web/app/api/             # transport policy + generated API types
apps/api/src/features/       # schemas, HTTP, operations, persistence
packages/contracts/          # only when schemas/types have genuine shared consumers
```

Choose identity topology before implementation. A same-origin reverse proxy may route `/api` to the API, which can own an HttpOnly session and CSRF validation. If web/API are cross-origin, explicitly define trusted credentialed origins and cookie policy; do not scatter tokens in web storage. A browser-only OAuth client uses its separate public-client controls.

If SSR/BFF is needed, choose an explicit server-rendered web runtime instead of pretending it is static. The BFF can own session/token mediation; API still authorizes trusted delegated principal/resource scope. Record this third runtime role in the architecture brief, rather than accidentally duplicating business logic.

Fastify owns canonical Zod wire schemas; the profile installs a compatible Zod type provider, validator/serializer compilers and OpenAPI transform. Generate consumers from published OpenAPI. [Contract recipe](../backend/recipes/contracts.md) and [verified versions](verification.md) show the integration boundary. TanStack Query may own a resource where justified; router loaders then coordinate that owner rather than retaining an independent cache.

**Proof:** invalid input rejected, forbidden response fields excluded, generated consumer typecheck, independent deployment compatibility, mutation revalidation and cross-origin/session behavior where applicable. **Alternative:** one [full-stack app](typescript-fullstack.md) when separate deployables add no value. Source: [SPA mode](https://reactrouter.com/how-to/spa).
