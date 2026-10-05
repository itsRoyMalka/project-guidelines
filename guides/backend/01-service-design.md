# TypeScript backend service design

**Applies to:** server-side application operations in fullstack web, API and worker deployables. Choose the deployable boundary in [architecture](../01-architecture.md); this guide defines the inside of one backend.

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

**BE-02 MUST:** Validate at the edge, authenticate before sensitive work, and authorize the action/resource using trusted scope. A minimal scoped read may be necessary to evaluate resource policy. Avoid revealing inaccessible existence or properties; the selected API disclosure policy decides forbidden versus not-found. Frontend gates never replace backend enforcement.

**BE-03 SHOULD:** Keep domain decisions independent of HTTP, ORM, queue, and vendor SDKs. Inject clocks, clients, and gateways at the composition boundary when they affect behavior or tests. Avoid an interface for every trivial function.

**BE-04 MUST:** Define internal error categories and map them once at the transport boundary to [API-03](02-api-contracts.md). Decide hidden-resource behavior explicitly. Return safe documented details; log an unexpected failure with its cause at the responsible boundary, never expose provider messages or stacks. See [contract example](recipes/contracts.md).

**BE-05 MUST:** The business operation owns the transaction. Helpers may participate in its transaction context but do not commit independently. Define composition when operations call each other; avoid external network waits in long transactions. When state and a durable notification must agree, commit state plus publication intent atomically under [EVT-03](04-events-and-workflows.md).

**BE-06 SHOULD:** Keep bootstrap separate from demo/seed data. Validate required config before readiness. Health/readiness, graceful shutdown, and background-worker lifecycle are part of the service composition, not feature business logic.

**Verification:** trace one use case through its public operation, authorization, transaction, tests, and error mapping.
