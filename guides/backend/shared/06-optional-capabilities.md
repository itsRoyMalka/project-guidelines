# Optional backend capabilities

**Scope:** TypeScript and Python services. Add a capability only for a named product need; select its runtime adapter in the chosen profile.

**BESO-01 SHOULD:** Add cache only after measured benefit and a freshness/staleness contract. Declare owner, key scope, TTL/invalidation, observability and failure fallback. Provider choices such as Valkey/Redis live behind one port; cache is never the sole owner of required business state.

```text
cache: order_summary; owner=Orders; key=account_id+order_id
TTL=60s; invalidate on OrderCancelled; miss/failure reads DB
```

**BESO-02 MUST:** Files use metadata/authorization in the DB and bytes in an object store or selected document store. Uploads move through pending → scan/verify → available; never serve unverified bytes. Downloads recheck actor/resource access and use short-lived access or a controlled stream.

```text
upload → pending metadata → object bytes → scan outcome → available
GET /documents/{id} → authorize → serve verified object
```

**BESO-03 SHOULD:** Use synchronous service RPC only when a separate service needs an immediate answer. Define the schema in the owning feature, propagate trusted identity/deadline and keep provider/client transport in an adapter. Prefer one in-process public operation when both features share a deployable.

```text
Orders.CancelOrder RPC contract → Orders service API → cancel_order handler
client adapter handles deadline/retry; caller never imports Orders DAL
```

**Verification:** cache stale/miss/invalidations, file scan denial and access revocation, RPC timeout/compatibility. **Exception:** omit entire optional capability when no selected journey needs it. Sources: [OWASP file upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html), [HTTP caching](https://www.rfc-editor.org/rfc/rfc9111).
