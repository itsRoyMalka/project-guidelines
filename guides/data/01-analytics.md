# Data and analytics extension

**Applies to:** warehouses, dbt/SQL models, reporting, and analytical exports. Transactional ownership remains in [data and migrations](../backend/03-data-and-migrations.md).

**ANA-01 MUST:** State source system, grain, owner, update cadence, tenant scope, and data contract for each published model. Organize raw/staging, transformed/core, and consumer-facing marts so transformations have a clear lineage.

**ANA-02 MUST:** Define source identity and ordering before deduplicating; preserve legitimate repeated events. Normalize instants consistently and declare the business timezone for calendar metrics. Apply tenant/test-data filtering deliberately, including analytical joins.

**ANA-03 MUST:** Make incremental processing/backfills repeatable. Define strategy, keys/null handling, late-data window, checkpoints and reconciliation; configured unique keys do not enforce uniqueness. Test replay and duplicate prevention in the selected warehouse. See the [analytics profile](../profiles/analytics.md).

**ANA-04 MUST:** Assert the model's declared grain and business invariants: uniqueness, non-null, accepted values and relationships only where semantically required. Permit valid nullable/late dimensions. Check freshness/volume when material and reconcile high-value metrics to source.

**ANA-05 SHOULD:** Use readable SQL with named CTEs, explicit join keys, scoped filters, and performance review on large models. Publish metric definitions and version changed semantics.

**ANA-06 MUST:** Apply access, retention and deletion policy to staging, marts, replicas, exports and BI. Rebuild/replay must honor deletion state instead of reintroducing erased records. Use the [data lifecycle](../backend/06-data-lifecycle.md) and assign ownership of derived-data propagation.

**Verification:** model tests, lineage, sample reconciliation to source, backfill replay, and access review. Further reading: [dbt data tests](https://docs.getdbt.com/docs/build/data-tests), [dbt incremental models](https://docs.getdbt.com/docs/build/incremental-models).

**ANA-07 MUST:** Product analytics events have one name, meaning, emission point, owner and allowlisted properties. Use typed app ports; operational events that trigger work have separate contracts. Exclude test traffic and unnecessary personal data.

**ANA-08 MUST:** Publish one owned metric definition with eligible population, exclusions, numerator/denominator, timezone, cadence and change policy. Reconcile high-value totals and test late/duplicate/backfilled data; replay must honor deletion state.

```text
cancel_rate = eligible cancelled orders / eligible created orders
Scope: real orders only; business calendar timezone declared
Grain: one row per order; source: Orders; owner: Operations analytics
```
