# Events, queues, and durable workflows

**Applies to:** asynchronous cross-feature or cross-service work. Start with the need described in [architecture](../01-architecture.md), not a broker preference.

**EVT-01 MUST:** Identify command versus committed-fact event. Declare owner, ID, version, occurrence time, correlation, trusted scope, producers/consumers and required ordering key. Authenticate the producer and validate delegated scope; a tenant field in a message is not inherently trusted.

**EVT-02 MUST:** Design for duplicates and stale/out-of-order work. Deduplicate atomically with owned state changes, acknowledge only after required durable progress, and define replay. Transport guarantees do not establish exactly-once external effects; handle provider-side idempotency or uncertain outcomes explicitly. See [idempotency](recipes/idempotency.md).

**EVT-03 MUST:** When durable state and notification must agree, commit state plus publication intent atomically, then publish asynchronously with retry. An outbox does not atomically commit broker delivery with the database. Publishers and consumers tolerate resend; recovery must not lose unpublished intent.

**EVT-04 MUST:** Bound attempts, elapsed retry budget, concurrency and processing time. Classify transient/permanent/unknown outcomes, coordinate retry ownership, renew leases when needed and drain safely. Dead letters have an owner, alert and reviewed replay path; retain original identity on retry. See [worker lifecycle](recipes/idempotency.md).

**EVT-05 SHOULD:** Use a durable workflow engine for long-running, multi-step work that requires timers, compensation, or resumption. A queue worker is enough for a short independent task. Record why orchestration complexity is needed.

**EVT-06 MUST:** Plan compatibility for old/new consumers and replay of stored events. Extra fields, new enum values and changed semantics need separate handling; tolerate supported additive data and reject/quarantine unsupported versions deliberately. Remove old fields/semantics only after consumers and replay policy permit it.

**Verification:** duplicate/replay and failure-path tests, dashboard for backlog/dead letters, and an operator-owned recovery procedure.
