# Backend guide map

Read [shared backend rules](shared/01-actions-and-boundaries.md) first, then select one runtime profile:

- [TypeScript service design](typescript/01-service-design.md) for Fastify/TypeScript services.
- [Python backend profile](python/01-backend.md) for FastAPI/Python services.

Follow each profile's linked recipes only when that capability is selected. The shared guides own language-independent decisions about [data and time](shared/02-data-and-time.md), [effects](shared/03-effects-and-operations.md), [testing](shared/04-testing-and-proof.md), [data lifecycle](shared/05-data-lifecycle.md) and [optional capabilities](shared/06-optional-capabilities.md). Runtime guides show how to implement them without redefining those decisions.
