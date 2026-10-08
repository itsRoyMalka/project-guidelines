# Data ownership and migrations

**Applies to:** transactional application data. Analytical data is in [data and analytics](../data/01-analytics.md).

**DATA-01 MUST:** Give tables and writes a domain owner. Enforce invariants using keys, uniqueness, foreign keys and checks, including tenant keys in relationships where needed. Design indexes separately for query performance. Application validation is additional protection; check-then-write alone is not a concurrency guard.

**DATA-02 MUST:** Add tenant columns, filters and composite relationships only for a multi-tenant product. Resolve trusted scope from verified membership; apply it to reads, writes, caches, jobs and exports. Test cross-tenant access when applicable.

**DATA-03 SHOULD:** Use PostgreSQL for new relational workflows and Prisma for ordinary typed data access in the default stack when its current version fits the schema and migration needs. Keep persistence behind feature operations; use reviewed SQL where ORM abstraction harms correctness or performance. Record a different datastore or access layer against workload requirements. Prisma's migration format and commands vary by major version; follow the selected version's official workflow.

**DATA-04 MUST:** Store instants consistently and dates as dates; preserve business timezone/recurrence definitions for future local schedules. Use stable identifiers and deliberate decimal/money types. Scope public representation through [domain values](../recipes/domain-values.md), not incidental ORM serialization.

**DATA-05 MUST:** Review migration data loss, locks, backfill load and recovery. Use expand/migrate/contract for overlapping versions, bounded restartable backfills and realistic rehearsal. Do not rewrite applied migrations; create a new correction. Review generated operations and customize through the selected version's supported source. Engine-specific recipes must name their engine. See [live migration](recipes/migrations.md).

**DATA-06 MUST:** Align transaction scope with business invariants and select an isolation/conflict strategy. Shared operations join the owner's context; keep backfills out of unbounded startup work. Cached data has an owner, scope, consistency policy and invalidation method; see [cache lifecycle](recipes/caching.md).

**DATA-07 SHOULD:** Prefer normalized columns and explicit indexes for frequently queried domain data. Use JSON fields only where schema flexibility is a real requirement and queries/validation are defined.

**Verification:** schema review, representative query plan for performance-sensitive paths, migration rehearsal on realistic data, and tenant isolation tests. Further reading: [PostgreSQL data definition](https://www.postgresql.org/docs/current/ddl.html), [current Prisma migration editing](https://www.prisma.io/docs/orm/migrations/editing-a-migration).

For concrete scoped joins, tenant foreign keys and conflict strategy see [persistence](recipes/persistence.md).

**DATA-08 MUST:** Features own table/enumeration definitions in `features/<feature>/db/`; shared infrastructure owns its tables beside its capability. The deployable owns one composed schema and one migration history under top-level `db/`. When Prisma is selected, explicitly select `db/prisma.config.ts`; prove discovery/generation for the installed Prisma major. Do not mix v7 schema-directory commands with v8 contract commands.

**DATA-09 MUST:** Comment each model's class: reference, operational, event or audit. Record mutation, retention and growth decisions. Size alone does not justify partitions or change the table's class.

**DATA-10 MUST:** Review a consequential DAL query with its filters, joins, order, bounds and supporting indexes. Check realistic plans for risky paths; avoid unbounded reads, N+1 calls and one-index-per-function rules.

**DATA-11 SHOULD:** Use time partitions for measured retention/query needs. Prefer pg_partman for rolling partitions when supported; monitor future partitions, maintenance failures and default-partition rows. Verify archives before removal and account for partition-key uniqueness limits.

```text
db/prisma.config.ts
db/migrations/                       # history format depends on selected Prisma major
src/features/orders/db/orders.prisma # class: operational; mutable order state
src/features/audit/db/audit.prisma   # class: audit; append-only; owned retention
```

Prisma v8 supports an explicit contract glob; v7 reads a configured schema directory and needs deliberate composition when models live elsewhere. Verify all feature models are included, rather than assuming discovery. See [Prisma config](https://www.prisma.io/docs/cli/configuration) and [v7 multi-file schema](https://www.prisma.io/blog/organize-your-prisma-schema-with-multi-file-support). Generated output is never the hand-edited source.

### Example: feature-owned model

```prisma
// src/features/orders/db/orders.prisma — Prisma ORM 7 schema excerpt
// class: operational; mutable state; retention owned by Orders
model Order {
  id        String      @id @default(uuid()) @db.Uuid
  status    OrderStatus @default(Pending)
  version   Int         @default(0)
  createdAt DateTime    @default(now()) @db.Timestamptz(3) @map("created_at")
  @@map("orders")
}
// enums.prisma — storage values agree with the public OrderStatus map
// In the real tree this enum is in the feature's second schema file.
enum OrderStatus {
  Pending   @map("pending")
  Cancelled @map("cancelled")
}
```

This single-tenant excerpt does not introduce a tenant column. Prisma-generated enums stay behind the DAL; public DTOs use the shared wire map. Compose both files with the selected-major configuration; add indexes for demonstrated DAL queries, not merely to decorate the example.
