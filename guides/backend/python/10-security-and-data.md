# Python security and data lifecycle

**Scope:** Python identity, authorization, audit, sensitive data and retention. Shared [security](../../cross-cutting/01-security.md), [identity](../../cross-cutting/recipes/identity.md) and [data](../shared/02-data-and-time.md) own policy; this guide makes Python boundaries concrete.

**PYSEC-01 MUST:** Treat headers, tokens, gateway claims and provider callbacks as untrusted until verified by their owning adapter. Resolve an `Actor` from verified identity; never merge client JSON with trusted auth fields. Enforce function and resource authorization in the action, even when a route dependency already requires a session.

```python
# app/auth.py — Python trusted identity boundary
actor = await identity.verify_request(request)  # signature, issuer, audience, expiry
# cancel_order/handler.py: require_action(actor, OrderAction.CANCEL, order)
# Client body cannot set actor.account_id or grants.
```

**PYSEC-02 MUST:** Classify sensitive fields before storing/logging them. Use the selected vault/encrypted-store port for data requiring app-level encryption, with key version, rotation, access audit and recovery. Keep provider secrets in a secret manager, not in database rows or logs. Retention and deletion propagate through DB, outbox, files, caches and analytics exports according to the product policy.

```python
# features/customers/update_phone/handler.py — nontransactional orchestration
ciphertext = await vault.encrypt(PiiField.CUSTOMER_PHONE, plaintext, key_version=active_key)
await ctx.customer_actions.save_phone(actor, customer_id, ciphertext)
# Transactional public action authorizes and passes session to the DAL.
# Logs use customer_id only if classification allows; never plaintext/ciphertext.
```

**PYSEC-03 MUST:** Write a success audit in the same transaction as an audited state change, with safe actor/action/resource context. Failed/rejected attempts, when required, use a separate durable record outside the rolled-back success transaction; do not call a provider synchronously from the audit decorator.

```text
cancel_order transaction: state update + OrderCancelled outbox + OrderCancelled audit → commit
rejection: rollback success intent; optional separate safe attempt record
```

**Verification:** forged identity, cross-account resource, callback replay, log redaction, key rotation/recovery, retention propagation and rollback audit behavior. **Exception:** data not classified as sensitive does not require a vault; tenant scope is required only for multi-tenant products. Further reading: [OWASP API authorization risks](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/).
