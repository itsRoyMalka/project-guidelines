# Data ownership and migrations

**Applies to:** transactional application data. Analytical data is in [data and analytics](../data/01-analytics.md).

**DATA-01 MUST:** Each table and write path has one owning domain feature. Enforce important invariants in the database through keys, unique constraints, foreign keys, check constraints, and appropriate indexes; application validation is additional protection.

**DATA-02 MUST:** Derive tenant/site scope from trusted identity context, not a caller-supplied query/body field. Apply scope on every read and write, including background jobs. Test attempted cross-tenant access. A global/admin operation needs a named exceptional path and audit evidence.

**DATA-03 SHOULD:** Use PostgreSQL for new relational workflows and Prisma for ordinary typed data access in the default stack when its current version fits the schema and migration needs. Keep persistence behind feature operations; use reviewed SQL where ORM abstraction harms correctness or performance. Record a different datastore or access layer against workload requirements. Prisma's migration format and commands vary by major version; follow the selected version's official workflow.

**DATA-04 MUST:** Store instants in UTC and preserve calendar dates as dates. Name time zones and units at API boundaries. Use stable internal identifiers; expose opaque public identifiers when the internal key should not be a contract.

**DATA-05 MUST:** Review every migration for data loss, lock time, backfill cost, and rollback/forward recovery. Use expand → migrate/backfill → contract for changes spanning deployments. Review generated migration operations and customize them through the selected tool's supported source format when necessary; do not hand-edit a generated artifact that its tool treats as immutable.

**DATA-06 MUST:** Keep transaction boundaries aligned with business operations. Make backfills restartable and observable; do not make application startup run an unbounded migration. Cache entries have an owner, invalidation rule, and consistency expectation.

**DATA-07 SHOULD:** Prefer normalized columns and explicit indexes for frequently queried domain data. Use JSON fields only where schema flexibility is a real requirement and queries/validation are defined.

**Verification:** schema review, representative query plan for performance-sensitive paths, migration rehearsal on realistic data, and tenant isolation tests. Further reading: [PostgreSQL data definition](https://www.postgresql.org/docs/current/ddl.html), [current Prisma migration editing](https://www.prisma.io/docs/orm/migrations/editing-a-migration).
