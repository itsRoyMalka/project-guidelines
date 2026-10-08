# Events, queues, and durable workflows

**Applies to:** asynchronous cross-feature or cross-service work. Start with the need described in [architecture](../01-architecture.md), not a broker preference.

**EVT-01 MUST:** Identify command versus committed-fact event. Declare owner, ID, version, occurrence time, correlation, trusted scope, producers/consumers and required ordering key. Authenticate the producer and validate delegated scope; a tenant field in a message is not inherently trusted.

**EVT-02 MUST:** Design for duplicates and stale/out-of-order work. Deduplicate atomically with owned state changes, acknowledge only after required durable progress, and define replay. Transport guarantees do not establish exactly-once external effects; handle provider-side idempotency or uncertain outcomes explicitly. See [idempotency](recipes/idempotency.md).

**EVT-03 MUST:** When durable state and notification must agree, commit state plus publication intent atomically, then publish asynchronously with retry. An outbox does not atomically commit broker delivery with the database. Publishers and consumers tolerate resend; recovery must not lose unpublished intent.

**EVT-04 MUST:** Bound attempts, elapsed retry budget, concurrency and processing time. Classify transient/permanent/unknown outcomes, coordinate retry ownership, renew leases when needed and drain safely. Dead letters have an owner, alert and reviewed replay path; retain original identity on retry. See [worker lifecycle](recipes/idempotency.md).

**EVT-05 SHOULD:** Use self-hosted Temporal as the selected runtime when durable jobs are needed. Features define provider-neutral jobs/workflows under `background/`; the app selects adapters. Follow [background rules](08-background.md), including provider capability and replay proof.

**EVT-06 MUST:** Plan compatibility for old/new consumers and replay of stored events. Extra fields, new enum values and changed semantics need separate handling; tolerate supported additive data and reject/quarantine unsupported versions deliberately. Remove old fields/semantics only after consumers and replay policy permit it.

**Verification:** duplicate/replay and failure-path tests, dashboard for backlog/dead letters, and an operator-owned recovery procedure.

**EVT-07 MUST:** `defineEvent` declares a meaningful committed fact and validated payload. The envelope includes ID, source, version, occurredAt, correlation and data; omit `v1` from ordinary symbols/files. Share public TS event schemas in a narrow producer-owned contracts package.

**EVT-08 MUST:** Features own `consumer.ts`; app `events/subscriptions.ts` composes consumers. `defineConsumer` validates and deduplicates through the production dispatcher; a separate handler is optional. Transport adapters own acknowledgement, retry and ordering behavior.

**EVT-09 MUST:** Configure each destination explicitly. Fanout keeps one event ID and separate outbox delivery state per destination; consumers tolerate duplicates across routes. Never claim universal ordering or exactly-once side effects.

```ts
export const OrderCancelled = defineEvent({
  type: OrderEvent.Cancelled,
  version: 1,
  data: z.object({ orderId: orderIdSchema }),
});
export const refundCancelledOrder = defineConsumer({
  event: OrderCancelled,
  handle: refundCancelledOrderHandler,
});
```

Provider SDKs live in `src/integrations/events/`; Kafka, EventBridge, SQS or another adapter must preserve the declared semantics. [Tests](07-testing.md) observe publication through an app-scoped recorder and exercise consumers through the dispatcher.
