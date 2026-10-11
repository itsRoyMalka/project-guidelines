# Backend effects and operations

**Scope:** events, jobs, third-party calls, logging and recovery across backend languages. Specific adapters live in the selected runtime profile.

**BESE-01 MUST:** Wrap each external provider in an application-owned port. Validate incoming provider data, set deadlines, classify retryable failures and keep provider credentials/protocols out of feature handlers. A provider call must not run inside a held DB transaction.

```text
feature action → PaymentPort.charge(command, idempotency_key)
             → Stripe/other adapter → validated provider response
```

**BESE-02 MUST:** Persist required event/job intent with the state change. Delivery uses a durable outbox/receipt or an equally proven atomic mechanism; consumers deduplicate by stable identity and make retry safety explicit. Publication proves dispatch, not consumer completion.

```text
transaction: update order + outbox(OrderCancelled, event_id)
relay: publish(event_id) → receipt/retry; consumer: dedupe(event_id) → action
```

**BESE-03 MUST:** Record safe structured context at the owning boundary. A caught exception is either propagated with context or logged when handled; avoid duplicate tracebacks. Distinguish expected rejection from actionable operational failure, and bound metric labels. Never log tokens, bodies or sensitive row content.

```python
# Python application boundary; adapter maps fields to the selected logger.
logger.warning('order cancellation rejected', extra={'reason_code': 'invalid_state'})
# Propagated exceptions are not logged again in this handler.
```

**BESE-04 MUST:** Every deployable has readiness, graceful shutdown, resource limits and recovery evidence for its selected HTTP/worker/provider topology. Treat alerts as service policy tied to actionable signals; do not assume every ERROR log must page.

```text
readiness: DB reachable + required subscriptions registered
shutdown: stop intake → drain 30s → release leases → close pools
alert: sustained failed-order rate, not one rejected user request
```

**Verification:** force provider timeout, duplicate delivery, process crash after commit, shutdown mid-work and safe-log inspection. **Exception:** a simpler synchronous effect may be used only when failure/loss semantics are acceptable and recorded. Further reading: [OpenTelemetry Python](https://opentelemetry.io/docs/languages/python/).
