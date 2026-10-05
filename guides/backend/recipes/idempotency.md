# Repeated writes, durable events and external outcomes

Read for an API write, worker, webhook or scheduled job that can repeat. Own rules: [API-06](../02-api-contracts.md), [EVT-01–06](../04-events-and-workflows.md), [DATA-06](../03-data-and-migrations.md). Choose the actual required guarantee before adding a queue.

## One business action

Scope the key by trusted tenant/principal and operation. Hash a canonicalized representation of meaningful input. Store the fingerprint and resulting public outcome under a unique scoped key; define expiry longer than the supported client retry window. Do not reuse keys across distinct actions.

Inside a transaction, reserve the key, validate current authorization/state, conditionally write the state transition and any outbox intent, and store the replayable outcome. A concurrent reservation uses a bounded wait or documented in-progress response; a different fingerprint with the same key conflicts. Recheck access before disclosing a stored result. Persist a successful result before responding; a lost response then permits replay. Transient failures before commit can be retried under the same key.

```text
UNIQUE(tenant_id, actor_id, operation, idempotency_key)
input fingerprint + state: processing/completed + safe result + expiry
order UPDATE scoped by tenant, id, expected status/version
order state + completed result + outbox intent commit together
```

This is a responsibility sketch, not drop-in SQL. Select atomic insert/conflict and locking semantics for the actual database. A natural unique business operation can replace a generic idempotency table when it proves the same invariant.

## Publication and consumption

An outbox publisher claims a bounded batch under a recoverable lease, sends, and records publication. A crash between send and record can resend. A consumer records event ID and its owned state change in one transaction and acknowledges after durable progress. Acknowledge/lease policy must match the broker; ordering is per declared aggregate/partition, not assumed global. Keep a cleanup policy that preserves required replay/retention evidence.

For email/payment/provider calls, the provider is outside the local transaction. Durably record a stable attempt identity before sending. After a worker crash or expired lease, an unfinished attempt may already have reached the provider; classify it as potentially accepted and reconcile rather than assuming failure. After timeout following possible acceptance, record **unknown outcome**. Reuse a supported provider idempotency key, reconcile through a receipt/status API, or ask the business owner to choose the documented duplicate-versus-loss policy. A local sent marker alone cannot remove the crash window. Do not blindly retry a financial effect or claim exactly-once delivery.

## Worker lifecycle

Separate permanent validation failures, transient failures and unknown outcomes. Bound attempts, elapsed time, concurrency and payloads. One layer owns retries where possible; use backoff/jitter within the deadline. Renew leases for valid long work, stop taking work on shutdown and allow safe redelivery of unfinished work. Dead letters record reason, original ID, owner and reviewed redrive path. Replays retain business identity. Scheduled jobs also define timezone, overlap lock, missed-run policy and bounded catch-up.

## Multi-step workflows and compensation

Record durable step state, input/schema version, stable business identity, deadlines and the owner of recovery. Each step is replay-safe under its actual side-effect protocol. Compensation is a new business action (for example a refund), not a distributed rollback: it can fail, incur cost or be impossible. Define which steps can compensate, required ordering, retries and manual reconciliation for irreversibility. Version workflow code/events so resuming an old execution does not reinterpret its saved history under incompatible rules. A workflow engine can supply durable scheduling/history, but cannot invent provider idempotency or undo an email already received.

**Proof:** same-key simultaneous calls; changed payload; response loss after commit; publisher crash after send; duplicate/out-of-order input; provider acceptance then timeout; lease expiry; restart/replay. Verify durable outcomes, not send-call counts. **Alternative:** synchronous idempotent domain operation when no asynchronous delivery is needed. [Outbox source](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); the lifecycle above is this handbook's implementation design.
