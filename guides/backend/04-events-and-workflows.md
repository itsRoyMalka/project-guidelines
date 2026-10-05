# Events, queues, and durable workflows

**Applies to:** asynchronous cross-feature or cross-service work. Start with the need described in [architecture](../01-architecture.md), not a broker preference.

**EVT-01 MUST:** Name whether a message is a command (requested work) or event (fact already committed). Give it an owner, schema, version/evolution policy, correlation ID, tenant scope, and producer/consumer list.

**EVT-02 MUST:** Assume at-least-once delivery unless the platform proves otherwise. Consumers are idempotent, handle duplicates and stale/out-of-order messages, and expose a replay/dead-letter procedure. Use stable event IDs and idempotency records or domain uniqueness constraints.

**EVT-03 MUST:** Publish state changes and corresponding events atomically via an outbox or equivalent mechanism. Do not send a message before a transaction commits and assume both will succeed.

**EVT-04 MUST:** Bound retries, backoff, and processing time. A poison message goes to a dead-letter path with alerting and safe re-drive. Preserve sensitive-data policy in payloads and logs.

**EVT-05 SHOULD:** Use a durable workflow engine for long-running, multi-step work that requires timers, compensation, or resumption. A queue worker is enough for a short independent task. Record why orchestration complexity is needed.

**EVT-06 MUST:** Treat schema changes as a compatibility rollout. Consumers tolerate additive fields; producers do not remove or reinterpret fields until consumers have migrated. Contract tests cover the change.

**Verification:** duplicate/replay and failure-path tests, dashboard for backlog/dead letters, and an operator-owned recovery procedure.
