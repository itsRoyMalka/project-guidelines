# Tenant relationships and concurrent persistence

Applies to [DATA rules](../03-data-and-migrations.md). PostgreSQL illustration; actual schema and SQL require project integration tests.

## Scope every relation

This example selects a multi-tenant product. Omit tenant keys/filters for single-tenant products and enforce their actual account/resource policy.

```sql
CREATE TABLE customers (
  tenant_id uuid NOT NULL,
  id uuid NOT NULL,
  PRIMARY KEY (tenant_id, id)
);
CREATE TABLE orders (
  tenant_id uuid NOT NULL,
  id uuid NOT NULL,
  customer_id uuid NOT NULL,
  version integer NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('pending', 'cancelled')),
  PRIMARY KEY (tenant_id, id),
  FOREIGN KEY (tenant_id, customer_id) REFERENCES customers (tenant_id, id)
);
-- $1 is server-verified scope, not a raw header/URL claim.
SELECT o.id, o.status
FROM orders o JOIN customers c
  ON c.tenant_id = o.tenant_id AND c.id = o.customer_id
WHERE o.tenant_id = $1 AND o.id = $2;
UPDATE orders SET status = 'cancelled', version = version + 1
WHERE tenant_id = $1 AND id = $2 AND version = $3 AND status = 'pending'
RETURNING id, version;
```

The composite relationship prevents a wrong-tenant customer reference even if application code is defective. Authorization still applies; database scope is not a complete permission model. Choose delete restriction/cascade deliberately from retention and aggregate ownership. Add indexes for actual query/filter/order paths; foreign keys do not automatically create every useful referencing-side index.

## Conflict strategy

Require exactly one changed row for the versioned transition. Zero means a conflict or inaccessible/missing resource under the chosen disclosure policy; do not follow with an unscoped lookup. A repeated action may return the recorded idempotent outcome, but a different stale action must not silently overwrite newer state.

A conditional row update protects that row's transition. Cross-row invariants (for example a total credit allocation) may require constraints, locking a stable aggregate row in a consistent order, or serializable isolation with bounded whole-transaction retries. Select from the actual engine semantics and workload; a transaction at default isolation does not magically prevent every race. Retried transaction callbacks contain no irreversible provider effects. Deadlock/serialization retries use a total deadline and preserve the operation's identity.

Apply the [transaction contract](transactions.md), including rollback-only child failures and rejection of transaction-disabled calls inside active transactions. The owning operation passes its transaction context into participating writes, including audit/outbox where required. External-effect delivery follows [idempotency](idempotency.md). Row-level security is useful defense in depth where selected; test pooled connection scope/reset and privileged bypasses before relying on it.

**Proof:** wrong-tenant ID and relation, simultaneous same-version changes, multi-row invariant races, rollback, retry limit and representative query plan. No live PostgreSQL trial was run in this handbook revision; these cases are consuming-project gates.

Sources: [constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), [transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html).
