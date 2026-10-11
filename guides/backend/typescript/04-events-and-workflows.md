# Events, queues, and durable workflows
**TypeScript implementation:** Apply the shared [backend rule](../shared/03-effects-and-operations.md); this guide supplies TypeScript-specific conventions and examples.

**Applies to:** TypeScript asynchronous cross-feature or cross-service work. Start with the need described in [architecture](../../01-architecture.md), not a broker preference.

**EVT-01 MUST:** Identify command versus committed-fact event. Declare owner, ID, version, occurrence time, correlation, trusted scope, producers/consumers and required ordering key. Authenticate the producer and validate delegated scope; a tenant field in a message is not inherently trusted.

**EVT-02 MUST:** Design for duplicates and stale/out-of-order work. Deduplicate atomically with owned state changes, acknowledge only after required durable progress, and define replay. Transport guarantees do not establish exactly-once external effects; handle provider-side idempotency or uncertain outcomes explicitly. See [idempotency](recipes/idempotency.md).

**EVT-03 MUST:** When a state change requires an event or job start, write durable intent through the outbox in that same database transaction. Only the relay calls the transport after commit; feature handlers never publish directly. CDC is an alternative only with equivalent verified guarantees; see [outbox and consumer receipts](recipes/outbox-and-consumers.md).

**EVT-04 MUST:** Bound attempts, elapsed retry budget, concurrency and processing time. Classify transient/permanent/unknown outcomes, coordinate retry ownership, renew leases when needed and drain safely. Dead letters have an owner, alert and reviewed replay path; retain original identity on retry. See [worker lifecycle](recipes/idempotency.md).

**EVT-05 SHOULD:** Use self-hosted Temporal as the selected runtime when durable jobs are needed. Features define provider-neutral jobs/workflows under `background/`; the app selects adapters. Follow [background rules](08-background.md), including provider capability and replay proof.

**EVT-06 MUST:** Plan compatibility for old/new consumers and replay of stored events. Extra fields, new enum values and changed semantics need separate handling; tolerate supported additive data and reject/quarantine unsupported versions deliberately. Remove old fields/semantics only after consumers and replay policy permit it.

**Verification:** duplicate/replay and failure-path tests, dashboard for backlog/dead letters, and an operator-owned recovery procedure.

**EVT-07 MUST:** `defineEvent` declares a meaningful committed fact and validated payload. The envelope includes ID, source, version, occurredAt, correlation and data; omit `v1` from ordinary symbols/files. Share public TS event schemas in a narrow producer-owned contracts package.

**EVT-08 MUST:** Features own named consumers; app subscriptions register them. The dispatcher authenticates/validates, then commits a unique `(consumerId, eventSource, eventId)` receipt with the consumer's DB changes and new outbox intent. A separate handler is optional; it joins that transaction. Acknowledge after commit.

**EVT-09 MUST:** Configure each destination explicitly. Fanout keeps one event ID and separate outbox delivery state per destination; consumers tolerate duplicates across routes. Never claim universal ordering or exactly-once side effects.

```ts
// packages/contracts/orders/events.ts — z is Zod; factories are project-owned
export const OrderCancelled = defineEvent({
  type: OrderEvent.Cancelled,
  version: 1,
  data: z.object({ orderId: orderIdSchema }),
});
// features/payments/request-refund/consumer.ts
export const requestRefund = defineConsumer({
  name: PaymentConsumer.RequestCancellationRefund,
  event: OrderCancelled,
  handle: requestRefundHandler, // joins receipt transaction; records refund intent
});
```

`OrderCancelled.create` validates feature data; `deps.outbox.add(db, event)` assigns the stable envelope ID/source/time/correlation from the trusted execution context and persists it with the business write. Provider SDKs live in `src/integrations/events/`; Kafka, EventBridge, SQS or another adapter must preserve the declared semantics. [Tests](07-testing.md) observe publication through an app-scoped recorder and exercise consumers through the dispatcher.

Consumer names are durable IDs, never inferred from function names. A receipt means the declared DB effect or durable work intent committed; it does not mean an external payment completed. The [recipe](recipes/outbox-and-consumers.md) defines inbox admission, relays, replay and adapter acknowledgements.
