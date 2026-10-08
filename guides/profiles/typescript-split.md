# TypeScript web/API profile

**Choose when:** separate clients, hosting, trust or release needs justify web and API deployables.

- React Router web and Fastify API; explicitly select static SPA or SSR/BFF hosting.
- TanStack Query owns API server data; route loaders may prefetch its cache.
- Browser-safe Zod endpoint descriptors in `packages/contracts` are the one source; Fastify adapters own policy, validation, response serialization and OpenAPI export.
- A same-origin session with HttpOnly cookie and CSRF protection is the browser default. Cross-origin/BFF/OAuth profiles explicitly define trusted origins and delegated identity.
- Static hosting needs deep-link fallback. Even SPA shell builds may render before browser globals exist.

```text
apps/web/src/{app,pages,features,shared}/
apps/api/src/features/<feature>/<action>/
packages/contracts/<feature>/endpoints.const.ts
packages/test-ids/<feature>.ts
apps/e2e/web/
```

**Check:** invalid input, safe output, runtime response validation, auth/CSRF, generated contract compatibility and one Query mutation/revalidation flow. **Alternative:** [fullstack](typescript-fullstack.md) for one runtime. See [contracts](../backend/recipes/contracts.md) and [FE architecture](../frontend/01-architecture.md). Verify the selected dependency versions in the adopting project.

### Example: app composition

```ts
// apps/api/src/app/create-app.ts — project-owned composition API
const app = createApiApp({ config, db, integrations });
app.registerFeatures([ordersFeature]);
await app.ready();
```

`createApiApp` owns Fastify plugins, endpoint policies and serializers; feature registration binds handlers and dependencies once. Tests create their own app/database and call `app.inject`; production listens only after startup checks. Browser code imports contracts, never this module.
