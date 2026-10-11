# Technology selection

**Read when:** starting a product or changing a platform dependency. First read [architecture](01-architecture.md), then choose a [profile](profiles/README.md). This table is a selected starting point; local compatibility evidence decides actual versions.

| Concern | Selected default | Alternative trigger |
| --- | --- | --- |
| TypeScript runtime | Supported Node LTS, strict TS, one declared package-manager policy | Existing supported platform or workload constraint |
| Repository | Cohesive workspace; pnpm and shared lockfile when workspace packages share resolution | Separate repositories/lockfiles for real release/access boundaries |
| Web | React Router framework mode with an explicit SPA or SSR deployment choice | Next.js for its particular capabilities/ecosystem; existing React SPA router when adequate |
| HTTP API, if separate | Fastify with Zod, compatible type provider and OpenAPI transform | JSON Schema/TypeBox, generated OpenAPI/protobuf, or existing framework contract |
| Relational persistence | PostgreSQL; Prisma evaluated against the chosen major's migration/operational needs | Reviewed SQL/query builder or another store justified by workload |
| Server data | TanStack Query for split web/API and mobile; router loaders/actions for fullstack route data | One freshness owner per resource; loaders may prefetch Query |
| Forms | React Hook Form for every actual form, Zod for drafts | Non-form controls use local state |
| Application tests | Existing runner or Vitest, Testing Library, MSW and focused Playwright journeys | Equivalent established tools; choose test layers by risk |
| Observability | OpenTelemetry-compatible signals with bounded metric labels | Platform instrumentation providing required evidence |

React Router supports server rendering; SSR alone does not select Next.js. A full-stack web server may call operations directly; a static SPA calls a separate API. Do not accidentally add both server ownership models. Verify the actual compiler, schema generator, framework and deployment combination selected for the project.


**STACK-01 MUST:** Declare supported versions and dependency resolution for each runtime/profile. Prefer one version per runtime in a cohesive workspace, allowing documented migration windows. Commit the appropriate lockfiles and pin the toolchain; production Node uses an Active or Maintenance LTS release.

**STACK-02 MUST:** Select a single owner for each capability. Do not use both framework loaders and TanStack Query for the same server resource without documenting cache ownership. Do not maintain duplicate API schemas by hand.

**STACK-03 SHOULD:** Avoid Module Federation, a global client-state library, a workflow engine, a message broker, and a second database until the architecture brief identifies a need. Introduce a capability with its operational and testing model.

**STACK-04 MUST:** Before adoption or a major upgrade, record the tested runtime, framework, compiler, schema adapters and deployment mode. Prove the relevant contract/build path against these versions. A source link is not compatibility proof.

**STACK-05 MUST:** Treat named tools in the table as a recommended project profile, not an industry requirement. Recheck major-version migration and operational behavior—especially the database layer—when the architecture brief is written. A stable existing stack that meets the same invariants does not need replacement.

### Example: one workspace dependency boundary

```yaml
# pnpm-workspace.yaml — split web/API profile; list only existing packages
packages:
  - apps/web
  - apps/api
  - apps/e2e
  - packages/contracts
  - packages/test-ids
```

The root lockfile pins compatible resolutions; the project records actual runtime and package-manager versions. This workspace file does not imply that every app shares a deployment or that an optional package should be created before a consumer needs it. See [repository shape](03-repository.md).

## Selected optional capabilities

| Need | Selected convention |
| --- | --- |
| Monorepo orchestration | pnpm workspace/lockfile; Nx affected tasks and boundaries; Turbo is a simpler alternative |
| Global client state | Zustand, composed centrally from feature-owned slices |
| Native mobile | React Native + TS; evaluate Expo, prove required native integrations |
| desktop | Electron + TS/React for web-stack reuse across Windows, macOS and Linux; evaluate Tauri or a native stack against product/OS needs |
| Durable background work | Self-hosted Temporal behind the app background port |
| Cache after measured need | Valkey or Redis adapter |
| Internal service RPC | Protobuf + Buf + Connect behind app clients |
| Native E2E | Detox + TypeScript; prove Expo builds when selected |
| Infrastructure | OpenTofu; established Terraform/equivalent is valid |
| Managed DS | React Aria behavior, DTCG tokens, Storybook; keep a healthy existing Radix system |

Versions are selected and checked during project setup, never inferred from these names. Local conventions such as test IDs and factory names are not framework mandates.

### Example: selected stack record

```text
docs/architecture/overview.md
Profile: split web/API; Node LTS + Fastify; React Router SPA + Query
Forms: RHF + Zod; DB: PostgreSQL + selected Prisma major
Optional now: none; add jobs/cache only for an identified need
Versions: record the exact verified versions and lockfile in this project
Proof: API contract + client build + first action integration test
```
