# Data lifecycle, audit and retention

Read when collecting personal/sensitive data or publishing derived data. Owners for transactional writes remain in [data](03-data-and-migrations.md). Security classifies access; this guide owns propagation and retention decisions. Organization policy supplies applicable legal obligations.

**LIFE-01 MUST:** Classify datasets by purpose, sensitivity, owner, access, retention and deletion behavior. Include operational logs, uploads, exports, caches, backups and analytical copies. Avoid collecting data merely because a field is available.

**LIFE-02 MUST:** Define account/tenant lifecycle: invite/provision, membership/role changes, suspension/offboarding, revocation and eventual removal. Separate legal hold/retention exceptions from ordinary delete behavior. Verify removal of access immediately according to policy, even when data deletion is delayed.

**LIFE-03 MUST:** Propagate deletion/correction to owned replicas, derived models, caches and exports. Maintain authorized deletion markers or equivalent source state so rebuild/replay does not reintroduce erased data. Define backup expiry and restore-time reconciliation; do not claim immediate physical deletion from immutable backups.

**LIFE-04 MUST:** Define audit event semantics, actor, trusted scope, action/resource, outcome and time; keep sensitive payloads out. Restrict access and modification with the required tamper resistance/retention. Distinguish “download authorized,” “stream started” and “delivery completed”; a server cannot prove client receipt merely from issuing a URL.

**LIFE-05 SHOULD:** Make bulk repair/deletion jobs dry-runnable or previewable, scoped, resumable and rate-limited. Record selected population, counts, progress, failures and reconciliation. Define irreversible cutoff and actual authorization before execution.

**Proof:** revoke a member and attempt reads/jobs/cache reuse; delete a record and rebuild a derived model; restore a backup and reapply current deletion state; simulate partial bulk progress. An audit write failure policy is explicit: block the business action if atomic audit is required, or durably retry where acceptable. **Alternative:** an organization data-governance platform can own these controls if its guarantees are linked and verified. Use [retention/restore policy](../cross-cutting/04-operations.md) alongside applicable security policy.
