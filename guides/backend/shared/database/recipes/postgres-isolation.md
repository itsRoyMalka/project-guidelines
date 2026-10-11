# PostgreSQL tenant isolation recipe

Implements [DBC-04](../02-connections-and-isolation.md). Optional multi-tenant profile. Runtime is neither owner, superuser nor `BYPASSRLS`; migrations own the table and policy. The app verifies tenant membership before opening the unit of work. Tenant keys in relationships and application authorization remain required.

```sql
-- db/migrations/<migration>/migration.sql — PostgreSQL policy excerpt
-- Assumes orders.orders already has tenant_id uuid NOT NULL and scoped keys.
ALTER TABLE orders.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders.orders FORCE ROW LEVEL SECURITY;
CREATE POLICY orders_tenant ON orders.orders TO orders_runtime
  USING (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid);
```

```sql
-- app database wrapper — SQL issued through the driver's parameter API
-- Inside the same explicit transaction as all scoped queries:
SELECT set_config('app.tenant_id', $1, true);
-- $1 comes from verified actor scope. true makes the setting transaction-local.
```

Missing scope denies rows; invalid scope fails. `FORCE` subjects the owner to policies during ordinary access, but an owner can alter policies and superuser/`BYPASSRLS` still bypass them. Do not grant runtime `TRUNCATE`; RLS does not govern it. Constraints may disclose existence through errors, so return safe public errors.

This setting protects against accidentally omitted filters. An attacker able to execute arbitrary SQL as this runtime can change it; stronger credential/tenant isolation needs a different trust boundary. Cross-tenant support/reporting uses a separately authorized role or carefully reviewed projection. Views may execute with owner privileges; verify that path explicitly.

**Proof:** read/update/insert with another tenant, missing context, rollback and pooled connection reuse, privileged bypass review, and cross-tenant relationship rejection. Run under the actual runtime role; running tests as owner/superuser can conceal a broken policy. With transaction pooling, set context inside each transaction and verify the selected driver/pooler combination.

Sources: [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [PgBouncer feature matrix](https://www.pgbouncer.org/features.html).
