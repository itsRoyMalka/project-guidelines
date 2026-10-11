# Database connections and isolation

**Scope:** server database clients, pools and optional tenant policies. **Why:** a correct DAL still fails when connection state leaks or deployment scale exhausts capacity.

**DBC-01 MUST:** Restrict network access, authenticate clients and verify transport identity for remote connections. Deliver runtime credentials separately from migration credentials; prefer supported workload identity/short-lived access, otherwise automated secret rotation. Test pool renewal after rotation. Credentials, connection URLs and certificate secrets never enter logs or source.

```text
app/config — connection policy, provider-specific implementation
runtime credential → runtime pool; migration credential → deploy job only
remote TLS → trusted CA + hostname verification (libpq: verify-full)
rotation → new connections authenticate; old pool drains within deadline
```

**DBC-02 MUST:** Budget aggregate connections across replicas, processes, workers, overflow, rollout surge and pooler instances, reserving operational capacity. Bound acquisition/connect, statement, lock and idle-transaction time by workload. Pooling is optional; verify driver/version compatibility with its selected mode rather than assuming session features survive transaction pooling.

```text
docs/operations/database.md — illustrative capacity record
API: 4 replicas × 1 process × 10 maximum connections = 40
Workers: 2 × 5 = 10; surge API: 2 × 10 = 20
Peak application demand: 70; reserve + other clients must fit DB capacity
Budgets: separately record API, workers, migrations and support query limits
```

**DBC-03 MUST:** The handler wrapper supplies the execution context to every DAL operation: `db` in TypeScript, `session` in Python. DALs do not open, commit, roll back or close transactions, and never fall back to a global client. Ordinary and transactional calls share the DAL interface; atomic actions bind all state/audit/outbox writes to the same transaction. A generic context type alone does not prove atomicity.

```text
app-owned handler wrapper → handler → DAL(db/session)
transactional action: same bound context for all participating operations
ordinary read: regular context; wrapper still closes/releases resources
```

**DBC-04 SHOULD:** Select RLS only for an explicit isolation need. In multi-tenant apps derive scope from verified authorization, apply transaction-local context and test both read/write policies, missing scope and pooled reuse. State privileged bypasses; application-set tenant variables mitigate omitted filters, not arbitrary SQL execution under the same credential. See [PostgreSQL isolation](recipes/postgres-isolation.md).

```text
tests/infrastructure/database-isolation — selected multi-tenant profile
Tenant A transaction ends → reused connection starts Tenant B transaction
B cannot read/update A; missing context denies; runtime cannot assume owner
```

**DBC-05 MUST:** Declare consistency for replica reads and recovery from disconnects. Reads needed for authorization/state transitions use an authoritative path; stale replicas are used only within a stated lag/freshness contract. Retry known aborted transactions within a bounded policy; an unknown commit is reconciled through the durable operation identity before retrying.

```text
cancel order → primary transaction → durable operation result
lost commit response → lookup/reconcile operation ID → return or safe retry
reporting replica → freshness budget + lag monitoring; no permission shortcut
```

**Verification:** peak pool model/load evidence, timeout, rotated credentials, dropped connection, scoped reuse and unknown-commit case. **Exception:** trusted local sockets need an equivalent local authentication boundary; replica/RLS/pooler machinery is omitted when unnecessary. Sources: [PostgreSQL TLS](https://www.postgresql.org/docs/current/libpq-ssl.html), [timeouts](https://www.postgresql.org/docs/current/runtime-config-client.html), [PgBouncer compatibility](https://www.pgbouncer.org/features.html), [RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [transaction failure contract](../../typescript/recipes/transactions.md).
