# Guide map

Read [governance](00-governance.md) first. Then select by task; you do not need to load the whole library.

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
