# Guide map

Read [usage](../USAGE.md) and [governance](00-governance.md) first. Then select by task; you do not need to load the whole library.

| Subject | Guide |
| --- | --- |
| Architecture, domain and deployable boundaries | [Architecture](01-architecture.md) |
| Recommended stack and selection criteria | [Stack](02-stack.md) |
| Workspace, modules, packages, imports | [Repository structure](03-repository.md) |
| TypeScript language rules | [TypeScript](04-typescript.md) |
| How the decisions connect in one feature | [Reference feature flow](06-reference-flow.md) |
| Backend layers and domain work | [TypeScript backend](backend/01-service-design.md) |
| HTTP API and contracts | [API contracts](backend/02-api-contracts.md) |
| Data ownership, persistence, migration | [Data and migrations](backend/03-data-and-migrations.md) |
| Events, queues, durable work | [Events and workflows](backend/04-events-and-workflows.md) |
| React feature organization | [Frontend architecture](frontend/01-architecture.md) |
| URL, server and local state; forms | [Frontend state](frontend/02-state-and-forms.md) |
| Design system, accessibility, localization | [UI and accessibility](frontend/03-ui-and-accessibility.md) |
| Identity, authorization, tenant isolation | [Security](cross-cutting/01-security.md) |
| Configuration, environments, feature flags | [Configuration](cross-cutting/02-configuration.md) |
| Unit through E2E verification | [Testing](cross-cutting/03-testing.md) |
| Logs, traces, metrics, reliability and speed | [Operations](cross-cutting/04-operations.md) |
| CI, deployment, infrastructure | [Delivery](cross-cutting/05-delivery.md) |
| Reading, planning, review, docs | [Workflow](cross-cutting/06-workflow-and-docs.md) |
| Python services | [Python backend profile](python/01-backend.md) |
| Warehouses, dbt and analytics | [Data and analytics profile](data/01-analytics.md) |
| Greenfield and existing-project adoption | [Adoption](05-adoption.md) |

Rules use **MUST** for a baseline requirement and **SHOULD** for a strong default with a documented reason to vary. The exact framework, provider, and deployment mechanism can change when the architecture brief explains why. The stable rule ID is for discussion and traceability, not a substitute for the rule text.

## Task routes and deeper recipes

Core = governance plus the task's owning guide. Profile = load once when selecting/understanding a runtime. Conditional = load only if the change touches that boundary. Following every link is unnecessary.

| Task | Core / profile | Conditional depth |
| --- | --- | --- |
| New application | [Product brief](07-product-and-decisions.md), architecture, [profile chooser](profiles/README.md) | [Decisions/templates](templates/decisions.md), identity, delivery |
| HTTP contract change | API contracts, selected TS profile | [Schema pipeline](backend/recipes/contracts.md), [domain values](recipes/domain-values.md) |
| Mutation / durable work | Backend, security, events | [Idempotency/concurrency/outbox](backend/recipes/idempotency.md) |
| Database evolution | Data and delivery | [Tenant/concurrency SQL](backend/recipes/persistence.md), [migration/backfill](backend/recipes/migrations.md), [caching](backend/recipes/caching.md) |
| UI feature | Frontend, state, UI | [State/forms](frontend/recipes/state-and-forms.md), [UI patterns](frontend/recipes/ui-patterns.md) |
| Identity or permissions | Security | [Identity profiles](cross-cutting/recipes/identity.md), [threat/control map](cross-cutting/recipes/security-controls.md) |
| Provider / webhook / upload | [Integrations](backend/05-integrations.md) | [Files/bulk](backend/recipes/files-and-bulk.md), retry/outcome protocol |
| Account deletion / audit | [Data lifecycle](backend/06-data-lifecycle.md) | Caches, files/bulk, analytics, recovery |
| Test or local environment | Configuration and testing | [Local/test recipe](cross-cutting/recipes/local-and-test.md) |
| Release / infrastructure | Delivery | [CI and rollout](cross-cutting/recipes/delivery.md), migrations |
| Debug or incident | Operations | [Operations/recovery](cross-cutting/recipes/operations.md), [incident skill](../skills/diagnose-incident/SKILL.md) |
| Python service | Python profile | [I/O and resource lifecycle](python/recipes/lifecycle.md), shared boundary recipes |
| Warehouse/dbt | Data/analytics rules | [Analytics profile](profiles/analytics.md) |
| Choosing abstractions | Architecture, backend, TypeScript | [Pattern selection](recipes/pattern-selection.md) |

[Profile verification](profiles/verification.md) records exact tested versions and limits. internal review record (not distributed) tracks the original subject inventory. Optional extensions in the root README need a project-specific profile before claiming coverage.
