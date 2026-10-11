# Audit through handler metadata

Owners: [LIFE-04/10–12](../06-data-lifecycle.md). Scope: selected consequential mutations, access changes, sensitive reads and security attempts. This is declarative wrapper/decorator behavior in our app-owned factory; TypeScript decorator syntax is not required.

## Feature definition

```ts
// features/orders/cancel-order/handler.ts — project-owned handler factory
export const cancelOrder = defineHandler({
  name: OrderAction.Cancel,
  transaction: true,
  audit: {
    action: AuditAction.OrderCancelled,
    resourceType: AuditResource.Order,
    resourceId: ({ result }) => result.id,
  },
  run: cancelOrderLogic,
});
```

The metadata mapper is pure: no I/O, no side effects and no automatic request/result snapshots. The feature owns its business meaning. The factory enriches the record from trusted execution context and validates it before commit. An audit mapping/storage failure aborts a mutation requiring atomic audit.

## What gets recorded

| Field | Owner |
| --- | --- |
| Audit ID, occurrence time, schema version | Audit infrastructure; stable across delivery retries |
| Action, resource type/ID, safe changed-field names | Feature declaration; shared named constants |
| Actor type/ID, delegated initiator when relevant | Verified request/service/job context |
| Outcome and safe reason code | Boundary/factory based on observed result |
| Operation/attempt ID, correlation, causation | Execution context; no bearer tokens or raw headers |
| Tenant scope | Verified context, only in multi-tenant products |

Metadata is allowlisted and bounded. Do not capture secrets, sensitive values, raw bodies or stack traces. A before/after diff requires an explicit field policy; changed-field names are the simpler default. Actor/resource references are still controlled data with retention and access policy.

## Write and delivery behavior

| Situation | Audit behavior |
| --- | --- |
| Successful transactional mutation | Persist audit record with business state; rollback removes both |
| Central audit service selected | Persist immutable audit envelope in local outbox; central consumer deduplicates by audit ID |
| Failure or rollback | Outer boundary writes a separate attempt record after transaction cleanup |
| Authentication/authorization denial | Policy boundary records the attempt even though the handler never ran |
| Sensitive read/reveal/export | Record the precise observed stage; require durable admission before release when policy demands it |
| Unknown commit or external outcome | Record uncertainty; append a correlated resolution after reconciliation |

For one deployable, a local `audit_records` table is sufficient. If central storage is needed, reuse the [outbox/consumer protocol](outbox-and-consumers.md). A dedicated audit envelope has its own schema and identity; subscribing to ordinary business events alone misses rejected actions and sensitive reads. Do not add a broker solely to write a local audit table.

A nested handler's success is provisional until the root commits. Nested audited actions may produce distinct records if their declared meaning warrants it; correlate them to the parent. Wrapper layers must not emit duplicate records for the same declared occurrence. Replaying a completed idempotent operation does not create another business-success record; a separate access/retry attempt may be recorded when policy requires.

A committed durable audit intent is enough to decouple a central sink outage from the action. Failure to persist required local audit/intention aborts the mutation. Failed/denied attempt logging cannot turn a denied request into an allowed one; use a bounded independent sink/spool and alert on loss. Sensitive-read audit failure follows the declared fail-closed policy. Do not open a hidden independent audit transaction inside a failing business transaction.

## Ownership and protection

```text
src/features/orders/cancel-order/handler.ts  # declares audit meaning
src/shared/audit/{contract,recorder}.ts       # common validated envelope
src/shared/audit/db/audit-records.prisma     # local store, when selected
src/shared/transactions/                    # factory commits audit with state
src/shared/messaging/                       # optional central delivery
```

The factory records successful outcomes; the outer API/RPC/consumer boundary records selected failures once through the same recorder. Unknown identities stay unknown—never infer a trusted actor from submitted credentials. Rejected untrusted resource identifiers must not be presented as verified resource ownership.

App identities may append but cannot edit/delete historical records. Authorized retention operations are separate and auditable. Append-only permissions are not tamper-proof against database administrators; select independent storage, immutability or integrity controls when the threat model requires them. Corrections append linked records rather than rewriting history.

**Proof:** success commits audit and business state; required-audit failure rolls both back; denied/rolled-back attempt remains discoverable; nested rollback emits no committed success; redelivery creates one central record; sink outage retains intent; secret fields never enter the envelope; sensitive-read audit failure follows policy.

Source: [OWASP logging guidance](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) supports purpose-specific event selection, safe context and log protection. Factory syntax and atomic audit/outbox composition are this handbook's selected convention, not an OWASP-provided API.
