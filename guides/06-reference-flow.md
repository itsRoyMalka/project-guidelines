# Reference feature flow

**Purpose:** demonstrate how the baseline guides fit together. This is an illustrative “cancel an order” action, not a required domain model. Each rule remains in its owning guide.

```text
User opens order page
  → route reads validated order ID and shareable URL state
  → selected owner loads order: server loader → operation, or SPA client loader → API
  → backend authenticates, derives tenant, authorizes read, scopes query
  → UI shows loaded/empty/error/forbidden state

User requests cancellation (confirmation/undo depends on actual impact)
  → action sends expected version and stable operation/idempotency key where retries need it
  → backend validates request and authorizes this order
  → order operation conditionally checks invariant/version and commits state + required durable intent
  → API maps result or stable error code
  → router revalidates, or the chosen query owner invalidates; UI shows confirmed/conflict/unknown outcome
  → if an external effect is required, worker uses dedupe/provider key and reconciles unknown outcomes
```

| Boundary | Owner | Proof |
| --- | --- | --- |
| Route and user action | `orders` frontend feature; shell owns identity/layout | Component test of states and keyboard flow |
| Wire shape | Canonical API contract; versioned when consumed independently | Request/response contract test |
| Cancellation decision | `orders` backend operation/domain | Unit tests for permitted, conflict, repeat cases |
| Tenant and authorization | Trusted backend context and data guard | Cross-tenant and least-privilege integration tests |
| Persistence and publication | Order feature transaction/outbox | Integration test including rollback/retry |
| Downstream delivery | Event consumer | Duplicate, failure, and replay tests |
| Whole journey | Product E2E smoke | User-visible cancel path and recovery |

This flow uses [architecture](01-architecture.md), [repository](03-repository.md), [API contracts](backend/02-api-contracts.md), [data](backend/03-data-and-migrations.md), [events](backend/04-events-and-workflows.md), [frontend state](frontend/02-state-and-forms.md), [security](cross-cutting/01-security.md), and [testing](cross-cutting/03-testing.md). If a new rule would make this journey inconsistent, update the relevant owners and the internal review record (not distributed) together.

For the actual mechanics see [idempotency](backend/recipes/idempotency.md), [identity](cross-cutting/recipes/identity.md) and [state/forms](frontend/recipes/state-and-forms.md). No broker/worker is needed when the feature has no durable asynchronous effect.
