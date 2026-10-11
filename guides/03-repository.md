# Repository and module boundaries

**Applies to:** new TypeScript or Python product repositories. See [architecture](01-architecture.md) for choosing separate repos/services.

## Example: one product monorepo

```text
apps/
  web/                 # frontend deployable
  mobile/              # optional React Native deployable
  desktop/             # optional installable desktop deployable
  services/
    orders-api/        # independently deployable backend service
  e2e/                 # cross-app user journeys
packages/
  contracts/           # only genuinely shared wire contracts
  ui/                  # shared design system if multiple consumers exist
infra/                 # declarative deployment/infrastructure source
.github/CODEOWNERS     # area owners and reviewers
docs/                  # architecture, decisions, operations
```

For a modular backend with one deployable, use `apps/api/` instead of `apps/services/*`. For one fullstack deployment, use the [fullstack profile](profiles/typescript-fullstack.md) with server/browser feature boundaries inside one app; do not create a second API just to match this example. An installable desktop app uses the [desktop profile](desktop/01-app-and-security.md). A Python backend uses the [Python profile](backend/python/01-backend.md) inside its deployable and may share this monorepo without importing another app's implementation. Add optional apps and packages only when they exist.

Create a package only for a real consumer boundary. Do not create empty `packages/` entries just to match this tree. Keep each app's config and tests near the app; cross-app E2E lives at the workspace level when needed.

**REPO-01 SHOULD:** Organize growing application behavior by domain feature and expose a small explicit public surface using package exports, named entrypoints or a feature index. Keep implementation-private files private. Retain a coherent existing layered layout when it meets ownership and dependency requirements.

**REPO-02 MUST:** Define allowed dependency edges: packages do not import applications; a deployable does not import another deployable's implementation. Features may depend on declared lower-level capabilities or public operations, with no cycles. Compose peer features at an application/use-case boundary or introduce an owned contract when necessary. Enforce meaningful boundaries with the target project's lint/dependency checks.

**REPO-03 SHOULD:** Keep code local until at least two consumers share the same *meaning* and lifecycle. Similar names or repeated syntax alone do not justify sharing. Name shared code for its domain or capability, never `misc`/`common` as a dumping ground.

**REPO-04 MUST:** Define the owning module for schema, data write, API operation, user-visible feature, and background job. Cross-feature writes go through named operations rather than another feature's repository.

**REPO-05 SHOULD:** Prefer named, explicit public exports and avoid wildcard barrels or deep imports that bypass a boundary. Framework-required default exports and generated entrypoints are valid. Aliases name stable public paths; they do not change dependency direction.

**REPO-06 SHOULD:** Keep related web, optional mobile, backend deployables, E2E, genuinely shared packages and infrastructure in one product monorepo by default. Independent service releases do not require separate repositories. Use path-based `CODEOWNERS` for applications, shared packages, infrastructure, CI and the ownership file itself, with protected-branch review controls under [GIT-06](cross-cutting/08-git-collaboration.md). Cross-app changes may touch several owned areas; request the relevant owners. Split repositories when access/compliance isolation, separate products or governance make a shared repository unsuitable. See [Git collaboration](cross-cutting/08-git-collaboration.md) for branch and PR rules.

**Verification:** a reader can locate a behavior and its tests from the domain name; a dependency graph has no cycles across features or apps; shared-package changes mark consumers affected; owners are requested for changed paths. Further reading: [Nx module boundaries](https://nx.dev/docs/features/enforce-module-boundaries), [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).

### Example: expose an owned operation

```ts
// apps/api/src/features/orders/index.ts — public feature entrypoint
export { cancelOrder } from './cancel-order/handler';
// Do not export ./shared/dal.shared or import it from another feature.
```

The handler still applies the [service rules](backend/typescript/01-service-design.md), including trusted actor/resource scope and its transaction policy. Application composition calls this public operation; another feature never writes Orders tables through a private DAL.

### Example: Python service public boundary

```python
# apps/services/orders-api/src/orders/app/main.py — Python composition
from orders.features.orders.api import router as orders_router

app.include_router(orders_router)
# Another feature imports the published orders operation, never shared/dal.py.
```
