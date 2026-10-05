# Analytics profile

Select only when the product has a warehouse/dbt workload. [ANA rules](../data/01-analytics.md) own requirements; operational services remain authoritative for transactional writes.

## Model contract

Record model owner, business purpose, row grain, candidate/unique key, event and ingestion timestamps, source freshness expectation, sensitivity, retention and downstream consumers. Define metric filters, dimensions, timezone and late correction semantics once; prevent two marts from silently assigning different meanings to the same metric.

## Incremental lifecycle

Choose append for truly immutable unique events; merge/upsert for corrections with a stable non-null key and adapter support. A declared `unique_key` is not proof the source is unique or a database constraint. Deduplicate incoming batches deterministically and test null/duplicate keys before applying them. Watermarks based only on event time lose late data; choose overlap/lookback plus stable dedupe, ingestion cursors or source change capture based on actual lateness. Define deletes/tombstones and schema changes explicitly.

Example: orders can change for seven days, but legal corrections can arrive later. A seven-day lookback handles the ordinary case only; a separate repair range/full reconciliation handles older corrections. Compare counts, key uniqueness and business totals against source snapshots with documented timing tolerances. Full refresh/replay must preserve deletion restrictions, cost/resource limits and downstream consistency.

## Proof and operations

Apply tests to model invariants: required keys, uniqueness at the declared grain, relationships where expected, accepted states with evolution policy, reconciled financial totals and freshness thresholds tied to use. Do not require uniqueness for a legitimate repeated-event grain. Assign failing-test/freshness alert ownership, consumer impact and recovery. Partition/cluster based on measured queries and budget; restrict sensitive columns and tenant access in serving layers. Version changed metrics/contracts and migrate consumers before retirement.

Adapter capabilities and generated SQL vary; validate the selected dbt/warehouse versions and representative late-update/delete/replay cases in the project. No warehouse execution was performed for this handbook revision.

Sources: [dbt incremental models](https://docs.getdbt.com/docs/build/incremental-models), [data tests](https://docs.getdbt.com/docs/build/data-tests).
