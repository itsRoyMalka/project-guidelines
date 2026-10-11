# Database administration and recovery

**Scope:** production database operations. Existing [recovery rules](../../../cross-cutting/04-operations.md) own RPO/RTO and restore proof; this guide specifies database acceptance evidence. **Why:** availability, recoverability and access control must survive routine operations and incidents.

**DBO-01 MUST:** Keep provisioning, roles/grants, database parameters and permitted extensions in reviewed infrastructure/migration definitions, with a declared owner for each. Detect drift and reconcile emergency changes. Separate routine migrations from cluster administration; protect infrastructure state when providers store secrets there.

```text
infra/<provider>/database/   # network, instance, bootstrap identities, parameters
apps/api/db/migrations/     # schema, constraints, table grants, policies
ops/access/<ticket>         # temporary elevation and emergency-change evidence
```

**DBO-02 MUST:** Prove the selected recovery target with an isolated restore, correct keys/configuration/roles and application checks. Select PITR/HA/replication according to product RPO/RTO. Replication does not replace backups, and failover may lose writes depending on replication guarantees. Rehearse client reconnection and reconcile uncertain operations before reopening traffic.

```text
docs/operations/database-recovery.md — drill record template
Target/actual: RPO and RTO; restored timestamp; missing/reconciled operations
Checks: constraints, runtime grants, tenant policy, required audit/outbox
Before serving: apply deletion restrictions; confirm keys and app compatibility
Result: measured evidence + owner/date of any remaining gap
```

**DBO-03 MUST:** Audit selected direct SQL, DDL, role/grant changes and sensitive access outside application handlers. Separate this operational audit from transactional business audit. Bound volume, retention and access; avoid logging raw parameters/PII. A logged statement may roll back, and best-effort DB logging is not proof of committed business success.

```text
docs/operations/database-audit.md — event policy
Capture: actor/session, time, database/object, operation class, outcome
Protect: controlled sink, retention, privileged change visibility
Omit: credentials and sensitive parameter values; review SQL text exposure
```

**DBO-04 MUST:** Monitor actionable saturation/recovery risks and maintain supported engine/extension versions. Track connections, pool waits, locks, slow-query aggregates, replication/WAL/archive health, storage growth and vacuum health where applicable. Rehearse upgrades on representative restored data with driver/extension compatibility and a recovery plan; choose maintenance budgets from workload evidence.

```text
docs/operations/database.md — example runbook entries
pool wait rising → compare replicas/concurrency with connection budget
old idle transaction → identify owner; bound/cancel under incident procedure
archive failure → repair before retention window loses recoverability
upgrade → restore rehearsal → app/permission checks → rollout/recovery plan
```

**Verification:** drift, restore, rotation/reconnection, failover when selected and upgrade evidence. **Exception:** managed services may perform maintenance/backups but the product owner still verifies resulting access and recovery guarantees. Sources: [PostgreSQL PITR](https://www.postgresql.org/docs/current/continuous-archiving.html), [replication tradeoffs](https://www.postgresql.org/docs/current/warm-standby.html), [upgrades](https://www.postgresql.org/docs/current/upgrading.html), [pgAudit](https://github.com/pgaudit/pgaudit).
