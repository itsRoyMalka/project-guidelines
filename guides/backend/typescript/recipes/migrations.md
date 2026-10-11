# Live schema migration

Read for schema/backfill changes while old and new versions overlap. Own rules: [DATA-05](../03-data-and-migrations.md), [DEL-04](../../../cross-cutting/05-delivery.md). Record database/access-tool versions first. This recipe describes PostgreSQL decisions; copy no MySQL DDL or unverified ORM command.

Example: rename required `old_name` to `new_name` without losing writes.

1. Inventory every reader/writer: API, jobs, reports, exports, raw SQL and rollback binaries. Determine row count, lock/load budget, backup/recovery and stop criteria. Consider keeping the physical name and changing the application mapping instead.
2. Expand by adding a nullable new column. Keep the old required column. Before backfill, establish a compatibility strategy: old-only writes populate new; new-only writes populate old; conflicting explicit values fail. A reviewed trigger can bridge old binaries. Alternatively continue writing the old physical column until those binaries retire. New-app dual writes alone do not protect writes from old binaries.
3. Deploy compatible application reads/writes. Backfill in bounded primary-key batches using the current database value in the update, not a stale application snapshot. Record checkpoint/progress, pause on lock/load thresholds, and make reruns safe. Evaluate lock timeout, statement timeout, deadlock retry and transaction size using real data.
4. Reconcile nulls, mismatches, row counts and representative business values while concurrent old/new writes run. Add/enforce required constraints with a supported low-impact strategy. Review indexes, references, views and replicas. Test old/new application compatibility and query plans.
5. Switch reads gradually; retain compatibility writes and the old column through the rollback window. Contract only after old binaries, consumers and rollback artifacts are retired. Removal is a later release, not the same rollout that first stops using the field.

Before contraction, rollback can mean the old app using the still-compatible schema. After contraction, that binary may be unsafe; plan forward repair or restore plus reconciliation of writes since backup. A destructive down migration is not automatically a safe rollback. Preserve applied migration history and use new corrective migrations.

**Proof:** empty and populated databases; interrupted backfill; simultaneous old/new writes; constraint and lock behavior; resumed batches; rollback before contract; documented recovery after contract. Capture exact engine/tool versions and actual commands/results. **Alternative:** a maintenance window is acceptable when explicitly justified by product availability requirements and rehearsed.

Sources: [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html), [Prisma version-specific editing](https://www.prisma.io/docs/orm/migrations/editing-a-migration). Prisma 8's source/generated artifact workflow differs from older majors; Alembic uses its own history. The core rollout invariant is independent of that syntax.

### Example: expansion only

```sql
-- db/migrations/<selected-history-entry> — reviewed PostgreSQL SQL excerpt
ALTER TABLE orders ADD COLUMN display_name text;
```

This adds a nullable column; it is not the entire rename rollout. Establish compatibility for old writers, then run the bounded backfill, reconcile, and contract in a later release. Apply with the chosen migration tool and lock budget; do not run schema changes in every app replica's startup.
