# Repository and module boundaries

**Applies to:** new TypeScript products. See [architecture](01-architecture.md) for choosing separate repos/services.

## Example: split web/API profile

```text
apps/
  web/                 # frontend deployable
  api/                 # backend deployable
packages/
  contracts/           # only genuinely shared wire contracts
  ui/                  # shared design system if multiple consumers exist
docs/                  # architecture, decisions, operations
```

For one fullstack deployment, use the [fullstack profile](profiles/typescript-fullstack.md) with server/browser feature boundaries inside one app; do not create a second API just to match this example.

Create a package only for a real consumer boundary. Do not create empty `packages/` entries just to match this tree. Keep each app's config and tests near the app; cross-app E2E lives at the workspace level when needed.

**REPO-01 SHOULD:** Organize growing application behavior by domain feature and expose a small explicit public surface using package exports, named entrypoints or a feature index. Keep implementation-private files private. Retain a coherent existing layered layout when it meets ownership and dependency requirements.

**REPO-02 MUST:** Define allowed dependency edges: packages do not import applications; a deployable does not import another deployable's implementation. Features may depend on declared lower-level capabilities or public operations, with no cycles. Compose peer features at an application/use-case boundary or introduce an owned contract when necessary. Enforce meaningful boundaries with the target project's lint/dependency checks.

**REPO-03 SHOULD:** Keep code local until at least two consumers share the same *meaning* and lifecycle. Similar names or repeated syntax alone do not justify sharing. Name shared code for its domain or capability, never `misc`/`common` as a dumping ground.

**REPO-04 MUST:** Define the owning module for schema, data write, API operation, user-visible feature, and background job. Cross-feature writes go through named operations rather than another feature's repository.

**REPO-05 SHOULD:** Prefer named, explicit public exports and avoid wildcard barrels or deep imports that bypass a boundary. Framework-required default exports and generated entrypoints are valid. Aliases name stable public paths; they do not change dependency direction.

**Verification:** a reader can locate a behavior and its tests from the domain name; a dependency graph has no cycles across features or apps.
