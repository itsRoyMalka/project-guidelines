# Frontend architecture

**Applies to:** React/TypeScript web apps. The [stack guide](../02-stack.md) decides standalone framework versus an embedded host.

## Default feature

```text
src/
  app/                    # routes, providers, runtime config, composition
  pages/                  # thin route compositions
  features/orders/
    ui/                   # rendering and interaction
    model/                # feature behavior and local state
    api/                  # query and mutation adapters
    lib/                  # feature-private pure helpers
    tests/
    index.ts              # public surface
  shared/                 # app-scoped primitives with real reuse
```

**FE-01 MUST:** Keep feature behavior with its owner and pages focused on routing/composition. Cross-feature use goes through explicit public contracts; the exact folders/index files follow the chosen profile. Compose peers without cyclic imports.

**FE-02 SHOULD:** Make leaves props-in/render-out. Hooks coordinate behavior near the owning feature. Prefer composition, children, slots, and named variants over boolean-heavy component APIs or wrappers that only forward props.

**FE-03 MUST:** Centralize transport/auth/correlation/error policy while keeping domain operations and schemas with their owners. Browser feature code uses typed adapters. SSR/BFF credentials and persistence stay in server-only modules; never serialize secrets into loader data. Avoid a shared client that becomes the domain layer.

**FE-04 SHOULD:** Use the router's built-in code splitting where supported; add manual lazy boundaries only for a measured need. Shell responsibilities include navigation, identity, layout and global failure boundaries. Respect server/client boundaries and declared host contracts rather than inventing parallel config/auth clients.

**FE-05 MUST:** Gate queries/actions when the client has reliable grant information, and handle revoked/changed grants and authoritative forbidden responses. Do not invent a client permission model where none exists. Render loading, empty, error, forbidden and success states; the server always enforces access.

**FE-06 SHOULD:** Use Module Federation for a demonstrated runtime composition need. Specify shared dependencies, host/remote contracts, compatible version combinations and rollback artifacts. Prove mixed-version deployment or explicitly deploy the group atomically; a monorepo or independent builds alone do not justify federation.

**Verification:** route-to-feature trace, import-boundary check, least-privilege role test, and a review of every external client.
