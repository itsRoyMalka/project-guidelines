# PostgreSQL access recipe

Implements [DBA-01–04](../01-identities-and-access.md). PostgreSQL 16+ membership syntax; authentication is provisioned separately. This is a new-database excerpt, not a script to run unreviewed against an existing shared cluster. Database `orders` already exists; a bootstrap administrator executes the first block while connected to it.

```sql
-- infra/<provider>/database/bootstrap.sql — PostgreSQL roles and schema
CREATE ROLE orders_owner NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
CREATE ROLE orders_runtime LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
CREATE ROLE orders_migrator LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
GRANT orders_owner TO orders_migrator WITH INHERIT FALSE, SET TRUE;

REVOKE ALL ON DATABASE orders FROM PUBLIC;
GRANT CONNECT ON DATABASE orders TO orders_runtime, orders_migrator;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
CREATE SCHEMA orders AUTHORIZATION orders_owner;
GRANT USAGE ON SCHEMA orders TO orders_runtime;
ALTER ROLE orders_runtime IN DATABASE orders SET search_path = pg_catalog, orders;
ALTER DEFAULT PRIVILEGES FOR ROLE orders_owner
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
```

Revoking public database privileges affects all clients; separately grant operational connections that the selected platform needs. This example uses explicit per-table DML grants rather than broad future grants. Default privileges apply only to future objects made by that creator role; membership does not inherit its defaults. Existing objects require a separate ownership/grant audit. Public function execution must be revoked at the global default level; a schema-only default revoke cannot undo that grant.

```sql
-- db/migrations/<migration>/migration.sql — migration identity, PostgreSQL
BEGIN;
SET LOCAL ROLE orders_owner;
CREATE TABLE orders.orders (
  id uuid PRIMARY KEY,
  status text NOT NULL CHECK (status IN ('pending', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON orders.orders TO orders_runtime;
COMMIT;
```

The explicit transaction illustrates ordinary transactional DDL. The migration runner must preserve ownership for nontransactional operations too; do not blindly nest this block into a framework-managed transaction. Qualify object names; only trusted creators can write schemas used in `search_path`. Grant sequences/routines when actually needed. A `SECURITY DEFINER` function requires separate review of trusted search path (`pg_temp` last), owner powers and restricted execution.

```sql
-- tests/infrastructure/database-access — runtime connection, independent cases
SELECT has_table_privilege(current_user, 'orders.orders', 'UPDATE'); -- true
SELECT has_table_privilege(current_user, 'orders.orders', 'DELETE'); -- false
-- In an isolated test DB, assert these fail; rollback each failed test:
ALTER TABLE orders.orders ADD COLUMN forbidden text;
SET ROLE orders_owner;
```

Also perform permitted DML, verify new-object privileges via the real migration runner, and test support views/audit denial. Catalog queries alone do not prove behavior through deployed identities. Store bootstrap definitions with infrastructure and object grants with their migrations; framework files select the migration credential only in deployment tooling.

Sources: [role membership](https://www.postgresql.org/docs/current/role-membership.html), [default privileges](https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html), [schemas](https://www.postgresql.org/docs/current/ddl-schemas.html), [security-definer functions](https://www.postgresql.org/docs/current/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY).
