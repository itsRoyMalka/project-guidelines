# Backend actions and boundaries

**Scope:** TypeScript and Python services. Runtime profiles implement these rules in [TypeScript](../typescript/01-service-design.md) or [Python](../python/01-backend.md). **Why:** a request, event or job must reach one findable business action through an explicit trust boundary.

**BES-01 MUST:** Organize business code by feature and action. The transport parses untrusted input and establishes trusted identity; the action authorizes the resource and owns the state transition; the DAL performs persistence without owning business policy. Feature-private DALs are not cross-feature APIs.

```text
features/orders/
  shared/                 # order-owned DAL, values and errors
  cancel_order/           # API/consumer/job entry, contract, handler, action test
  api                    # feature entry list
```

**BES-02 MUST:** Keep one declared contract for each external boundary. Validate HTTP, events, provider responses, configuration and persisted untrusted values at entry; do not treat a type annotation as runtime validation. Public errors expose safe codes, never stacks or provider bodies.

```text
HTTP JSON → parsed CancelOrderInput + verified Actor → cancel_order action
         → safe CancelOrderOutput | mapped public error
```

**BES-03 MUST:** Declare the transaction owner for every write action. It starts or joins one transaction, commits business state with required audit/outbox intent, and rolls back on failure. A participating child failure must not be silently committed; external network calls stay outside the database transaction. The runtime profile supplies the wrapper/session implementation.

```text
cancel_order(transaction=true): read + conditional update + audit + outbox → commit
relay(after commit): publish outbox intent with stable event ID
```

**BES-04 SHOULD:** Use a service composition root for validated settings, DB/client lifecycle, telemetry, route/consumer/worker registration, readiness and bounded shutdown. Build a factory/decorator only when it enforces a repeated invariant; avoid wrappers around simple data declarations.

```text
app startup: settings → telemetry → DB/providers → feature actions/routes → readiness
shutdown: stop intake → drain deadline → close clients/DB
```

**Verification:** trace an action from entry through identity, authorization, transaction, DAL and side effects; prove rejection commits neither state nor success intent. **Exception:** an existing coherent layout may remain if these boundaries are explicit and tested. Sources: [FastAPI dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/), [Fastify testing](https://fastify.dev/docs/latest/Guides/Testing/).
