# Backend data and time

**Scope:** transactional data and time semantics in TypeScript or Python services. Runtime/database guides own implementation details. **Why:** correctness comes from declared authority, constraints and query behavior, not an ORM choice.

**BESD-01 MUST:** Give each table an owner and a key, classify retention/sensitivity and enforce important relationships/uniqueness in the database. Add tenant scope only in a multi-tenant product; when present, enforce it on reads, writes, joins and uniqueness, not just in API filters. Choose public IDs separately from internal keys; opaque IDs reduce guessability but never replace authorization.

```sql
-- Multi-tenant example only; single-tenant products omit tenant_id.
SELECT o.id FROM orders AS o
WHERE o.tenant_id = :tenant_id AND o.public_id = :public_id;
```

**BESD-02 MUST:** Design each important index from a named query's equality/range filters, joins and ordering; verify with the target database's execution plan and representative data. Avoid a blanket index-prefix rule or an index for every column. Paginate bounded lists with a stable order.

```sql
-- Query: account's recent pending orders, newest first.
CREATE INDEX orders_account_status_created_id
  ON orders (account_id, status, created_at DESC, id DESC);
```

**BESD-03 MUST:** Review generated migrations against the actual DB engine, table size, lock budget, deployed old writers and rollback/forward-recovery plan. Use expand → backfill → contract for incompatible changes. Raw SQL is valid when precise engine-specific DDL or online behavior is needed; it is not required for every migration.

```text
Release A: add nullable column; old writers still work
Backfill: bounded, resumable batches
Release B: new readers/writers, verify
Release C: enforce constraint/drop old column after old clients are gone
```

**BESD-04 MUST:** Distinguish an instant, a calendar date and a future local schedule. Persist instants with an explicit UTC contract; use the entity's IANA zone for calendar/business decisions. Inject a clock for decisions, and choose database versus application clock ownership for audit timestamps. Never use device/server local time as an implicit zone.

```text
instant: 2026-10-11T08:00:00Z
birthday: 1990-04-12 (date, no timezone)
future opening: 09:00 + Europe/London + recurrence policy
```

**Verification:** inspect a representative plan, concurrent write/constraint case, migration on the production engine, and DST/calendar cases. **Exception:** an alternative key/index/time representation needs a stated semantic or measured operational reason. Sources: [PostgreSQL time types](https://www.postgresql.org/docs/current/datatype-datetime.html), [Alembic review](https://alembic.sqlalchemy.org/en/latest/autogenerate.html).
