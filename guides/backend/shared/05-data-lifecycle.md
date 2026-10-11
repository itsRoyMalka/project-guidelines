# Backend data lifecycle

**Scope:** TypeScript and Python services collecting personal or sensitive data. The selected project determines legal obligations; the runtime profile implements storage. **Why:** a deletion or access rule must follow data across all copies.

**BESL-01 MUST:** Classify each dataset before collection: owner, purpose, sensitivity, access, retention trigger and every derived copy. Minimize fields and keep secrets in a secret manager. App-encrypted sensitive DB fields use a vault port with key version, rotation, audit and recovery when classification requires it.

```text
customer_phone: owner=Customers; class=PII; store=vault ciphertext
copies=primary DB + backup + search index; retention=account closure + policy window
```

**BESL-02 MUST:** A delete/retention action covers DB rows, files, caches, outbox/event projections, analytics and backups according to the selected policy. Soft delete is a visibility/state tool, not permanent erasure. Make retries idempotent and record completion/failure without sensitive payloads.

```text
close account → mark unavailable → enqueue durable purge by dataset owner
→ verify DB/files/cache/projections; backups expire under recorded schedule
```

**BESL-03 MUST:** Consequential state changes write a safe success audit in the same transaction as the change. Rejected attempts, when required, use a separate failure record so rollback cannot erase evidence. An audit record does not grant permission; authorization occurs before mutation.

```text
transaction: cancel order + success audit + OrderCancelled outbox → commit
rejection: rollback transaction; optional safe attempt record outside it
```

**Verification:** account switch/delete, backup/restore, event replay, audit rollback and key rotation; no erased record reappears from a projection. **Exception:** omit vault or soft delete when classification/behavior does not need it. Sources: [OWASP data protection](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html), [NIST Privacy Framework](https://www.nist.gov/privacy-framework).
