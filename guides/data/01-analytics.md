# Data and analytics extension

**Applies to:** warehouses, dbt/SQL models, reporting, and analytical exports. Transactional ownership remains in [data and migrations](../backend/03-data-and-migrations.md).

**ANA-01 MUST:** State source system, grain, owner, update cadence, tenant scope, and data contract for each published model. Organize raw/staging, transformed/core, and consumer-facing marts so transformations have a clear lineage.

**ANA-02 MUST:** Deduplicate events/records with a documented key and ordering rule. Normalize timestamps to UTC and declare date/timezone interpretation. Apply tenant and test-data filtering deliberately; never let an analytical join cross scopes by accident.

**ANA-03 MUST:** Make incremental processing and backfills repeatable. Define unique keys, late-arriving data behavior, rebuild window, and reconciliation checks. A backfill cannot silently double count.

**ANA-04 MUST:** Test uniqueness, non-null business keys, accepted values, relationships, and high-value metric invariants. Add source freshness and row-volume anomaly checks where delay or loss is material.

**ANA-05 SHOULD:** Use readable SQL with named CTEs, explicit join keys, scoped filters, and performance review on large models. Publish metric definitions and version changed semantics.

**ANA-06 MUST:** Apply privacy and access controls to analytical data, including export and BI tools. Retention and deletion obligations flow into warehouse models.

**Verification:** model tests, lineage, sample reconciliation to source, backfill replay, and access review.
