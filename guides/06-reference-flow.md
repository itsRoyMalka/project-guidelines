# Reference feature flow

**Purpose:** demonstrate how the baseline guides fit together. This is an illustrative “cancel an order” action, not a required domain model. Each rule remains in its owning guide.

```text
User opens order page
  → route reads validated order ID and shareable URL state
  → feature query loads order through typed API adapter
  → backend authenticates, derives tenant, authorizes read, scopes query
  → UI shows loaded/empty/error/forbidden state

User confirms cancellation
  → mutation sends a stable idempotency key
  → backend validates request and authorizes this order
  → order operation checks invariant and commits state + outbox event
  → API maps result or stable error code
  → frontend invalidates the order query and shows outcome at the surface
  → worker processes the event idempotently and records delivery result
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
