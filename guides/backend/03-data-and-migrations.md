# Data ownership and migrations

**Applies to:** transactional application data. Analytical data is in [data and analytics](../data/01-analytics.md).

**DATA-01 MUST:** Give tables and writes a domain owner. Enforce invariants using keys, uniqueness, foreign keys and checks, including tenant keys in relationships where needed. Design indexes separately for query performance. Application validation is additional protection; check-then-write alone is not a concurrency guard.

**DATA-02 MUST:** A user may select a tenant, but the server verifies membership/delegation and creates trusted scope before access. Apply it to reads, joins, writes, caches, jobs and exports. Explicit global/reference data and privileged admin paths have their own policy and audit. Test cross-tenant identifiers and relationships; see [identity and scope](../cross-cutting/recipes/identity.md).

**DATA-03 SHOULD:** Use PostgreSQL for new relational workflows and Prisma for ordinary typed data access in the default stack when its current version fits the schema and migration needs. Keep persistence behind feature operations; use reviewed SQL where ORM abstraction harms correctness or performance. Record a different datastore or access layer against workload requirements. Prisma's migration format and commands vary by major version; follow the selected version's official workflow.

**DATA-04 MUST:** Store instants consistently and dates as dates; preserve business timezone/recurrence definitions for future local schedules. Use stable identifiers and deliberate decimal/money types. Scope public representation through [domain values](../recipes/domain-values.md), not incidental ORM serialization.

**DATA-05 MUST:** Review migration data loss, locks, backfill load and recovery. Use expand/migrate/contract for overlapping versions, bounded restartable backfills and realistic rehearsal. Do not rewrite applied migrations; create a new correction. Review generated operations and customize through the selected version's supported source. Engine-specific recipes must name their engine. See [live migration](recipes/migrations.md).

**DATA-06 MUST:** Align transaction scope with business invariants and select an isolation/conflict strategy. Shared operations join the owner's context; keep backfills out of unbounded startup work. Cached data has an owner, scope, consistency policy and invalidation method; see [cache lifecycle](recipes/caching.md).

**DATA-07 SHOULD:** Prefer normalized columns and explicit indexes for frequently queried domain data. Use JSON fields only where schema flexibility is a real requirement and queries/validation are defined.

**Verification:** schema review, representative query plan for performance-sensitive paths, migration rehearsal on realistic data, and tenant isolation tests. Further reading: [PostgreSQL data definition](https://www.postgresql.org/docs/current/ddl.html), [current Prisma migration editing](https://www.prisma.io/docs/orm/migrations/editing-a-migration).

For concrete scoped joins, tenant foreign keys and conflict strategy see [persistence](recipes/persistence.md).
