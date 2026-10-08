# External integrations and webhooks

Read when calling or receiving work from another system. Depends on [API](02-api-contracts.md), [events](04-events-and-workflows.md) and [security](../cross-cutting/01-security.md). Provider adapters own protocol details; domain operations own business interpretation.

**INT-01 MUST:** Record provider contract/version, credential owner, scope, request/response bounds, timeout/deadline, rate limits, error mapping and lifecycle. Keep retries at one deliberate boundary and use the provider's documented idempotency/reconciliation guarantees.

**INT-02 MUST:** For signed webhooks, verify the signature using the provider's prescribed raw payload representation, trusted key and replay-window rules before using the content. Support bounded key rotation; do not trust claimed tenant or callback URLs. Map external account identity to verified local scope.

**INT-03 MUST:** Acknowledge webhook acceptance only after the required durable progress. Record event identity and deduplicate; then process with bounded retries/ordering policy. A 2xx receipt does not promise that all business effects completed. Repeated delivery returns a compatible acknowledgement.

**INT-04 MUST:** Validate destination/protocol and redirects when accepting outbound URLs. Protect private/link-local/metadata destinations and DNS-resolution changes through approved egress controls. Bound response size/time; never forward arbitrary credentials to a user-supplied destination.

**INT-05 SHOULD:** Keep provider failure behavior observable through safe correlation and owned alerts. Reconcile delayed callbacks, ambiguous success and external drift. Contract/sandbox tests and a small controlled real integration check have different proof boundaries.

Example path: verify signed raw callback → map account to scope → validate public event → atomically record accepted ID/work → acknowledge → operation/consumer → audit outcome. Outbound delivery retains stable identity, supports secret rotation and records permanent/unknown failures. Never keep a database transaction open while waiting for an uncontrolled provider.

**Proof:** invalid signature, altered body, expired replay window, duplicate valid events, wrong account/scope, redirect to a blocked network, key rotation overlap and unknown provider outcome. **Alternative:** polling with durable checkpoints when webhooks are unavailable; document freshness/cost. Sources: [OWASP REST](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), [SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html). Provider-specific signature algorithms belong in the project's adapter documentation.

**INT-06 MUST:** Top-level `integrations/outbound/<capability>/` owns a narrow app port and provider adapters. `integrations/inbound/<provider>/` verifies and translates incoming protocols. Features import app capabilities and events, never vendor SDKs.

**INT-07 MUST:** Async notifications enter a durable inbox, then a feature consumer under the [admission/receipt protocol](recipes/outbox-and-consumers.md). Synchronous challenges/decision callbacks invoke an authorized feature action and return the provider response immediately; do not wait for an async consumer.

| Provider example | Adapter | Feature sees |
| --- | --- | --- |
| Stripe payment notice | Verify raw body; accept durable Stripe event ID; reconcile latest state | `ExternalPaymentChanged` |
| GitHub issue callback | Verify signature; dedupe delivery ID; handle own-write callbacks | `ExternalIssueChanged` |
| Twilio delivery status | Verify exact provider protocol; select callback-specific dedupe | `MessageDeliveryChanged` |
| Twilio voice decision | Verify, call action, render TwiML synchronously | `answerIncomingCall(input)` |

```ts
interface ShippingRates {
  quote(input: QuoteInput): Promise<Quote>;
}
// app composition selects the provider once
const shippingRates = createShippingAdapter(config);
```

Check each provider's current signature, delivery identity and response deadline; these examples are not implemented adapters. Sources: [Stripe](https://docs.stripe.com/webhooks), [GitHub](https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks), [Twilio](https://www.twilio.com/docs/usage/webhooks/webhooks-security).
