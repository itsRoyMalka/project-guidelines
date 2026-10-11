# Python integrations, events and background work

**Scope:** outbound providers, inbound hooks, events, jobs and service calls in Python. Shared [effects](../shared/03-effects-and-operations.md) own durability and recovery. **Why:** feature handlers should express business intent without binding to Stripe, Kafka, SQS or Temporal.

**PYWORK-01 MUST:** Define a feature-facing provider port at the app boundary and implement it in `integrations/<provider>/`. The adapter owns auth, timeouts, retries, response parsing and provider errors; the handler receives a typed app result. Verify the request and translation, not only deserialization. Do not call a provider inside a DB transaction.

```python
# integrations/payments/port.py — Python app-owned contract
class PaymentPort(Protocol):
    async def charge(self, command: ChargeCommand, *, idempotency_key: str) -> ChargeResult: ...
# integrations/payments/stripe_adapter.py translates Stripe SDK data to ChargeResult.
```

**PYWORK-02 MUST:** Inbound webhooks verify provider signatures/raw bytes in the adapter before parsing, map to a typed internal event and dispatch through the normal consumer. The feature never imports provider event types. Dedupe delivery IDs and bound clock skew according to the provider protocol.

```text
Stripe HTTP hook → verify signature → PaymentSucceeded(event_id, order_id)
→ payment consumer → feature public operation → receipt/ack
```

**PYWORK-03 MUST:** Events/jobs use stable IDs, versioned payload contracts and an outbox/receipt when state and publication must agree. Consumers validate the envelope, deduplicate and call a public feature action. Retry only safe/idempotent work; route exhausted failures to a visible recovery path.

```python
# features/orders/cancel_order/handler.py — Python transaction excerpt
await ctx.outbox.add(ctx.tx, OrderCancelled(order_id=row.id, event_id=ctx.event_ids.new()))
# Consumer receives OrderCancelled and calls an operation; adapter owns Kafka/SQS details.
```

**PYWORK-04 SHOULD:** Prefer a durable workflow engine only for a named long-running business flow. Keep simple background work as registered jobs with `contract.py`, `handler.py` and a worker adapter; Temporal-specific workflow code stays in the integration adapter where portability is feasible. Record any capability loss if the business flow requires provider-native signals, queries or child workflows.

```text
features/orders/background/expire_reservation/{contract,handler}.py
integrations/temporal/{worker,workflow_adapter}.py
```

**PYWORK-05 MUST:** Bound all outbound I/O with a deadline, concurrency limit and cancellation/shutdown policy. Choose sync or async clients consistently with the selected request path; no blocking `requests` call inside `async def`. Service RPC uses a declared schema and the same identity/authorization boundaries as HTTP.

```python
# integrations/payments/stripe_adapter.py — Python bounded HTTP adapter
response = await self._client.post(url, json=provider_payload, headers=signed_headers)
response.raise_for_status()
return payment_response_model.model_validate(response.json()).to_result()
# self._client is created with a 5-second timeout at app lifespan and closed on shutdown.
```

**Verification:** timeout, malformed response, duplicate webhook/event, crash after DB commit, consumer retry, worker stop and provider swap contract. **Exception:** a provider SDK may own transport when its retry/timeouts and observability are configured and tested. Sources: [FastAPI async](https://fastapi.tiangolo.com/async/), [httpx timeouts](https://www.python-httpx.org/advanced/timeouts/).
