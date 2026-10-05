# TypeScript backend service design

**Applies to:** API and worker deployables. Choose the deployable boundary in [architecture](../01-architecture.md); this guide defines the inside of one backend.

## Feature shape

```text
src/
  app/                       # composition, config, transport registration
  features/orders/
    contracts/               # validated inputs/outputs and domain types
    http/                    # transport adaptation
    operations/              # use cases; authorization and transaction boundary
    domain/                  # business decisions and pure rules
    persistence/             # owned data access
    tests/
    index.ts                 # public operations
```

Use the few folders a feature needs; this is a responsibility map, not a demand for empty directories. A normal request flows transport → operation → domain/persistence → response mapping. The operation owns one business action, including authorization and transaction scope; HTTP files stay thin.

**BE-01 MUST:** One feature owns its invariant and write path. Other features call a named public operation. Do not export write repositories as a cross-feature API.

**BE-02 MUST:** Parse untrusted request data at the edge, authorize the action and resource before work, then execute the use case. The frontend's visibility rules never substitute for backend authorization.

**BE-03 SHOULD:** Keep domain decisions independent of HTTP, ORM, queue, and vendor SDKs. Inject clocks, clients, and gateways at the composition boundary when they affect behavior or tests. Avoid an interface for every trivial function.

**BE-04 MUST:** Define a stable error taxonomy (validation, unauthenticated, forbidden, absent, conflict, rate-limited, unavailable, unexpected) and map it once at the transport boundary. Never expose stack traces or raw provider messages to clients.

**BE-05 MUST:** Treat a transaction as a business operation boundary. Do not commit from shared helpers. When writing state and publishing an event, use a transactional outbox or another proven atomic mechanism.

**BE-06 SHOULD:** Keep bootstrap separate from demo/seed data. Validate required config before readiness. Health/readiness, graceful shutdown, and background-worker lifecycle are part of the service composition, not feature business logic.

**Verification:** trace one use case through its public operation, authorization, transaction, tests, and error mapping.
