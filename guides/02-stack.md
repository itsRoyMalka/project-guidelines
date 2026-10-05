# Default technology choices

**Applies to:** new TypeScript web products. This is a coherent starting profile, not an instruction to replace a working stack. Record actual versions and alternatives in the project's architecture brief. Prefer supported current releases and verify compatibility at creation time.

| Concern | Default | Use another choice when |
| --- | --- | --- |
| Runtime and language | Supported Node.js LTS, TypeScript with `strict` | A platform or workload requires another runtime |
| Workspace | pnpm workspaces, one lockfile | Existing organization tooling is already standardized |
| Backend HTTP | Fastify with one runtime schema source and OpenAPI | Existing gateway/framework contract dictates otherwise |
| Data | PostgreSQL for relational data; Prisma as the default typed access/migration candidate after a version-specific migration review | Another datastore/SQL layer has a concrete workload or team advantage |
| Web | React + TypeScript; React Router framework mode for a standalone routed app | Next.js for server-rendering/RSC needs; Vite/Rsbuild SPA for an embedded host; Module Federation for independent apps |
| Client server state | TanStack Query when the framework does not already own caching/invalidation | Framework-native loaders/actions fully cover the flow |
| Forms and validation | React Hook Form plus Zod for nontrivial forms and runtime boundaries | Native form/browser validation is sufficient for a simple flow |
| Tests | Vitest, React Testing Library, MSW, Playwright | An existing test system provides the same layers reliably |
| Telemetry | OpenTelemetry-compatible traces/metrics/logs behind application interfaces | Existing platform instrumentation already supplies the same signals |

**STACK-01 MUST:** Keep one runtime version and dependency resolution policy across the workspace. Pin the project toolchain and commit the lockfile. Use an Active or Maintenance LTS Node release in production.

**STACK-02 MUST:** Select a single owner for each capability. Do not use both framework loaders and TanStack Query for the same server resource without documenting cache ownership. Do not maintain duplicate API schemas by hand.

**STACK-03 SHOULD:** Avoid Module Federation, a global client-state library, a workflow engine, a message broker, and a second database until the architecture brief identifies a need. Introduce a capability with its operational and testing model.

**STACK-04 MUST:** Recheck supported versions and cross-package compatibility before adopting this profile. This guide intentionally does not freeze version numbers.

**STACK-05 MUST:** Treat named tools in the table as a recommended project profile, not an industry requirement. Recheck major-version migration and operational behavior—especially the database layer—when the architecture brief is written. A stable existing stack that meets the same invariants does not need replacement.

 Further reading: [Node LTS policy](https://nodejs.org/en/about/previous-releases), [TypeScript strict](https://www.typescriptlang.org/tsconfig/strict), [React framework guidance](https://react.dev/learn/creating-a-react-app), [Fastify schema guidance](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/), [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview). The table's combination is a proposed baseline; the sources do not prescribe this exact bundle.
