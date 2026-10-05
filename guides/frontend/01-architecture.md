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

**FE-01 MUST:** Put domain behavior in its feature. A page composes features and handles route-level concerns; it does not become a second business layer. Cross-feature imports use public `index.ts` only.

**FE-02 SHOULD:** Make leaves props-in/render-out. Hooks coordinate behavior near the owning feature. Prefer composition, children, slots, and named variants over boolean-heavy component APIs or wrappers that only forward props.

**FE-03 MUST:** Keep API transport, authentication headers, correlation IDs, error normalization, and runtime schema parsing in shared adapters. Feature code calls typed operations; it does not scatter raw `fetch` or vendor SDK calls.

**FE-04 SHOULD:** Use route-level lazy loading for substantial features. Keep the shell responsible for navigation, identity, layout, and global error boundaries. A feature must work through its declared host contracts; it does not create parallel auth/config clients.

**FE-05 MUST:** Gate data queries as well as visible actions by user grants. The server still enforces authorization. Render explicit loading, empty, error, forbidden, and success states.

**FE-06 SHOULD:** Introduce Module Federation only when independently deployed frontend teams need runtime composition. Specify shared dependency versions, host contracts, rollback behavior, and cross-app tests. A monorepo alone is not a reason to federate.

**Verification:** route-to-feature trace, import-boundary check, least-privilege role test, and a review of every external client.
