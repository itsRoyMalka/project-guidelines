# Database identities and access

**Scope:** server-managed databases used by TypeScript or Python services; local embedded desktop databases use the desktop profile. **Why:** application authorization and database privileges protect different boundaries. Runtime examples live in [TypeScript](../../typescript/15-database-access.md) and [Python](../../python/12-database-sessions.md).

**DBA-01 MUST:** Separate object ownership, migration execution, runtime access and human investigation. Runtime identities are service/environment-specific, cannot own application objects or assume owner/admin roles, and receive only necessary operations. A monolith need not create a login per feature; independent services do not share runtime credentials.

```text
infra/<selected-provider>/database — identity policy excerpt
orders_owner:    no login; owns application schema/objects
orders_migrator: deployment only; explicitly assumes owner for migrations
orders_runtime:  required DML; no DDL, grant management or owner membership
support reader: named/delegated identity; approved tables/views only
emergency admin: controlled elevation; audited and revoked after use
```

**DBA-02 MUST:** Declare permissions for existing and newly created objects through reviewed definitions. Migrations consistently create objects as the declared owner. Prefer explicit grants where operational, audit, vault and migration tables have different permissions; schema-wide defaults are valid only for uniform access. Revoke unnecessary public access and secure schema resolution. See the [PostgreSQL access recipe](recipes/postgres-access.md).

```sql
-- db/migrations/<migration>/migration.sql — PostgreSQL excerpt
GRANT SELECT, INSERT, UPDATE ON orders.orders TO orders_runtime;
GRANT INSERT ON audit.records TO orders_runtime;
-- Runtime cannot update/delete audit history or write migration metadata.
```

**DBA-03 MUST:** Human and agent access is attributable, purpose-scoped and time-bounded under organization policy. Use the identity/MFA boundary, approved data projections, query/export limits, activity records and enforced revocation of access and active sessions. Agents use delegated identities tied to operator/task; they do not borrow application credentials. Emergency access has an owner, bounded scope and a reviewable record.

```text
ops/access/<ticket> — example access record; no credentials
Purpose: ODR-123, investigate cancellations
Principal: named operator / delegated task identity
Scope: orders_support view; no raw customer PII
Window: 30 minutes; broker closes sessions at expiry
Evidence: grant/revoke times, actor, operations, export destination if permitted
```

**DBA-04 MUST:** Verify effective permissions using actual runtime/support identities, including inherited roles, owners, routines and new-object defaults. Check allowed operations and forbidden operations; compare deployed definitions with reviewed state. A reader endpoint or read-only transaction setting is not a substitute for grants.

```text
tests/infrastructure/database-access — integration acceptance cases
runtime: create/update allowed order → succeeds
runtime: ALTER TABLE / SET ROLE owner / edit audit history → denied
support: approved view → succeeds; restricted source table → denied
migration: create new object → expected owner/grants; runtime DDL still denied
```

**Verification:** bootstrap/migration trial, negative permissions, expired session test and drift report. Run this suite for access/bootstrap changes, not in every feature test. **Exception:** provider-managed owner roles may differ but must prove equivalent separation. Local disposable tooling can use broader provisioning rights; production application rights remain restricted. Sources: [OWASP database security](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html), [PostgreSQL privileges](https://www.postgresql.org/docs/current/ddl-priv.html), [default privileges](https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html), [role expiry semantics](https://www.postgresql.org/docs/current/sql-createrole.html).
