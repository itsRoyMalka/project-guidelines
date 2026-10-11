# Find the rule you need

Start with [usage](../USAGE.md), [governance](00-governance.md) and the chosen [profile](profiles/README.md). Load only the task's boundaries; examples do not create extra rules. Read [example conventions](recipes/example-conventions.md) before copying a snippet into an app.

| Area | Canonical guides and examples |
| --- | --- |
| New project | [PRD setup](08-project-setup.md), [worked setup](recipes/project-setup.md), [product brief](07-product-and-decisions.md) |
| Architecture and code | [Architecture](01-architecture.md), [stack](02-stack.md), [repo](03-repository.md), [TypeScript](04-typescript.md), [one feature](06-reference-flow.md), [example conventions](recipes/example-conventions.md) |
| BE action | [Slices/chassis](backend/01-service-design.md), [transaction contract](backend/recipes/transactions.md), [endpoint/contracts](backend/02-api-contracts.md), [contract example](backend/recipes/contracts.md), [time/clock](backend/14-time-and-dates.md), [tests](backend/07-testing.md), [anti-patterns](backend/12-anti-patterns.md), [pattern inventory](backend/13-design-patterns.md) |
| Database | [Schema/migrations/indexes](backend/03-data-and-migrations.md), [migration example](backend/recipes/migrations.md), [concurrency](backend/recipes/persistence.md) |
| Data lifecycle | [Retention/soft delete/vault/audit](backend/06-data-lifecycle.md), [audit factory example](backend/recipes/audit.md), [DocStore/bulk](backend/11-docstore.md) |
| Async and remote work | [Events](backend/04-events-and-workflows.md), [outbox/receipts](backend/recipes/outbox-and-consumers.md), [jobs/workflows](backend/08-background.md), [RPC](backend/09-rpc.md), [idempotency](backend/recipes/idempotency.md) |
| Providers and cache | [Inbound/outbound](backend/05-integrations.md), [cache](backend/10-cache.md) |
| FE structure/API | [Feature flows](frontend/01-architecture.md), [state/forms/store](frontend/02-state-and-forms.md), [state example](frontend/recipes/state-and-forms.md) |
| FE UI | [RTL/i18n/a11y/test IDs](frontend/03-ui-and-accessibility.md), [DS](frontend/04-design-system.md), [time/date input and display](frontend/10-time-and-dates.md), [UI example](frontend/recipes/ui-patterns.md) |
| FE app | [Routing/auth/deep links](frontend/05-routing-and-access.md), [flags/providers/telemetry](frontend/06-flags-and-telemetry.md), [tests](frontend/07-testing.md), [anti-patterns](frontend/08-anti-patterns.md), [pattern inventory](frontend/09-design-patterns.md) |
| Mobile | [Native profile](mobile/01-react-native.md), [telemetry/build/release](mobile/02-operations.md) |
| Desktop (Windows/macOS/Linux) | [Runtime/boundaries/security](desktop/01-app-and-security.md), [experience/system integration](desktop/02-experience-and-integration.md), [local service/data/sync](desktop/05-local-data-and-sync.md), [quality/delivery](desktop/03-quality-and-delivery.md), [optional capabilities](desktop/06-optional-capabilities.md), [patterns/pitfalls](desktop/04-patterns-and-pitfalls.md), [platform selector](desktop/07-platform-profiles.md), [macOS](desktop/macos/01-platform.md), [Windows](desktop/windows/01-platform.md), [Linux](desktop/linux/01-platform.md) |
| E2E | [Web/device journeys](e2e/01-journeys.md), [shared dev](e2e/02-environments.md), [anti-patterns](e2e/03-anti-patterns.md), [pattern inventory](e2e/04-design-patterns.md) |
| Security/config | [Security/threats](cross-cutting/01-security.md), [identity profiles](cross-cutting/recipes/identity.md), [configuration](cross-cutting/02-configuration.md) |
| Quality/operations | [Testing philosophy](cross-cutting/03-testing.md), [local setup](cross-cutting/recipes/local-and-test.md), [operations](cross-cutting/04-operations.md) |
| CI/CD | [Delivery/versions/rollback/hotfix](cross-cutting/05-delivery.md), [infra/rollout](cross-cutting/09-infrastructure.md), [delivery example](cross-cutting/recipes/delivery.md) |
| Work | [Agent pipeline](cross-cutting/06-workflow-and-docs.md), [project/sprints](cross-cutting/07-project-work.md), [Git](cross-cutting/08-git-collaboration.md), [Git/Project setup](cross-cutting/recipes/git-project-setup.md), [ticket examples](cross-cutting/recipes/project-work.md) |
| Data analytics | [Analytics](data/01-analytics.md), [warehouse profile](profiles/analytics.md) |
| Python | [Profile](python/01-backend.md), [I/O lifecycle](python/recipes/lifecycle.md) |
| Adoption/docs | [Adoption](05-adoption.md), [templates](templates/decisions.md), [pattern selection](recipes/pattern-selection.md), [domain values](recipes/domain-values.md) |

Rules have stable IDs and MUST/SHOULD within their scope. Each guide supplies a check and exception/alternative. Framework versions and custom factory implementations still need project-level verification.
