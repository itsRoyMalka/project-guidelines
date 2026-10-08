# One transaction owner

Owners: [BE-05/07](../01-service-design.md), [DATA-01/06](../03-data-and-migrations.md), [API-06](../02-api-contracts.md). Scope: related writes in one database. The factory and context methods below are project-owned illustrative APIs.

## Definition and invocation

| Definition | Direct invocation | Invocation with an active transaction |
| --- | --- | --- |
| `transaction: true` | Factory opens, executes and commits/rolls back | Join the same context; never commit independently |
| `transaction: false` | No transaction context; suitable for reads or separately managed external work | Reject before running; never suspend the parent implicitly |

Set the mode in the handler definition, not request data or caller options. A read requiring a consistent multi-query snapshot can use `true`. A single atomic write may use `false` only when it needs no coordinated audit, receipt, result record or publication intent.

App composition binds dependencies once. Each invocation gets trusted actor, correlation/deadline and its own execution context. Transactional DALs and the outbox require that context's transaction client; do not fall back to a process-global DB connection. Do not retain the context after completion or pass it to another service/process.

```ts
// features/orders/confirm/handler.ts — both child handlers use transaction:true.
export const confirmOrder = defineHandler({
  name: OrderAction.Confirm,
  transaction: true,
  run: async ({ input, ctx }) => {
    await ctx.call(reserveStock, input.stock);
    return ctx.call(markOrderConfirmed, input.order);
  },
});
// ctx.call propagates the trusted actor and same transaction automatically.
```

`ctx.call` preserves feature authorization; trusted context is not an authorization bypass. An independently owned service has a different database boundary: use a durable command/workflow and explicit compensation instead of sharing a transaction object.

## Failure contract

Handlers return success values or throw typed failures. If a participating child throws, the factory marks the shared unit rollback-only before propagating the error. Catching it cannot turn partial writes into a successful root commit. The root rejects and rolls back. Validation should precede writes where practical.

Savepoint recovery is an explicit, separately proven extension for workflows that intentionally recover within one transaction. No hidden savepoints, independent child commits or “catch and continue” default. Expected no-op business outcomes must be explicitly defined as successful outcomes, not swallowed failures.

Use conditional writes or constraints for concurrency. A prior read does not reserve the row. Check the affected row count before emitting the event:

```ts
const changed = await orderDal.cancelIfPending(tx, orderId);
if (changed !== 1) throw new OrderConflictError();
await deps.outbox.add(tx, OrderCancelled.create({ orderId }));
```

Required [audit records](audit.md) are written before commit through the same transaction; rollback removes provisional success records. Failure-attempt recording belongs to the outer boundary after cleanup.

An outermost call returns success only after the database confirms commit. A nested result remains provisional until the parent commits. A connection loss during commit can leave the outcome unknown; reconcile through the operation's durable idempotency/result record rather than assuming rollback.

## Bounds and retries

The transaction owner selects timeout/isolation and a bounded whole-transaction retry policy for known serialization/deadlock aborts. Child handlers do not retry independently. Re-read state on each attempt; preserve logical operation/idempotency identity. Do not retry policy rejection or unknown commit outcomes blindly.

Keep network calls and slow computation outside transactions. Queue required external effects through durable intent. Avoid concurrent use of a transaction client unless the selected driver explicitly supports the intended semantics. SQL constraints and affected-row checks still enforce invariants.

**Proof:** concurrent state transition; child failure after writing with parent catching it; outbox write failure; serialization retry; unknown commit reconciliation. Assert business data and intent agree in every case. Sources: [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html), [persistence recipe](persistence.md). The rollback-only factory contract is our convention, not automatic JavaScript or ORM behavior.
