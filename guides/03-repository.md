# Repository and module boundaries

**Applies to:** new TypeScript products. See [architecture](01-architecture.md) for choosing separate repos/services.

## Default shape

```text
apps/
  web/                 # frontend deployable
  api/                 # backend deployable
packages/
  contracts/           # only genuinely shared wire contracts
  ui/                  # shared design system if multiple consumers exist
docs/                  # architecture, decisions, operations
```

Create a package only for a real consumer boundary. Do not create empty `packages/` entries just to match this tree. Keep each app's config and tests near the app; cross-app E2E lives at the workspace level when needed.

**REPO-01 MUST:** Organize application behavior by domain feature, not a global collection of controllers, hooks, or utilities. Give each feature one public `index.ts`; cross-feature imports use that surface. Private files remain private.

**REPO-02 MUST:** Dependency direction is inward: apps may use packages; packages may not import apps; one deployable may communicate with another only through a contract/transport, not `src/` imports. Enforce this with lint or dependency checks in the target project.

**REPO-03 SHOULD:** Keep code local until at least two consumers share the same *meaning* and lifecycle. Similar names or repeated syntax alone do not justify sharing. Name shared code for its domain or capability, never `misc`/`common` as a dumping ground.

**REPO-04 MUST:** Define the owning module for schema, data write, API operation, user-visible feature, and background job. Cross-feature writes go through named operations rather than another feature's repository.

**REPO-05 SHOULD:** Use named exports and explicit public exports; avoid wildcard barrels and deep imports that bypass a feature boundary. Use aliases for stable public package paths, not to conceal dependency direction.

**Verification:** a reader can locate a behavior and its tests from the domain name; a dependency graph has no cycles across features or apps.
