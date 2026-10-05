# External integrations and webhooks

Read when calling or receiving work from another system. Depends on [API](02-api-contracts.md), [events](04-events-and-workflows.md) and [security](../cross-cutting/01-security.md). Provider adapters own protocol details; domain operations own business interpretation.

**INT-01 MUST:** Record provider contract/version, credential owner, scope, request/response bounds, timeout/deadline, rate limits, error mapping and lifecycle. Keep retries at one deliberate boundary and use the provider's documented idempotency/reconciliation guarantees.

**INT-02 MUST:** For signed webhooks, verify the signature using the provider's prescribed raw payload representation, trusted key and replay-window rules before using the content. Support bounded key rotation; do not trust claimed tenant or callback URLs. Map external account identity to verified local scope.

**INT-03 MUST:** Acknowledge webhook acceptance only after the required durable progress. Record event identity and deduplicate; then process with bounded retries/ordering policy. A 2xx receipt does not promise that all business effects completed. Repeated delivery returns a compatible acknowledgement.

**INT-04 MUST:** Validate destination/protocol and redirects when accepting outbound URLs. Protect private/link-local/metadata destinations and DNS-resolution changes through approved egress controls. Bound response size/time; never forward arbitrary credentials to a user-supplied destination.

**INT-05 SHOULD:** Keep provider failure behavior observable through safe correlation and owned alerts. Reconcile delayed callbacks, ambiguous success and external drift. Contract/sandbox tests and a small controlled real integration check have different proof boundaries.

Example path: verify signed raw callback → map account to scope → validate public event → atomically record accepted ID/work → acknowledge → operation/consumer → audit outcome. Outbound delivery retains stable identity, supports secret rotation and records permanent/unknown failures. Never keep a database transaction open while waiting for an uncontrolled provider.

**Proof:** invalid signature, altered body, expired replay window, duplicate valid events, wrong account/scope, redirect to a blocked network, key rotation overlap and unknown provider outcome. **Alternative:** polling with durable checkpoints when webhooks are unavailable; document freshness/cost. Sources: [OWASP REST](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), [SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html). Provider-specific signature algorithms belong in the project's adapter documentation.
