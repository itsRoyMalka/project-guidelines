# Python action transaction lifecycle

Applies to [PYDB-02](../04-persistence-and-migrations.md) and [BES-03](../../shared/01-actions-and-boundaries.md). `define_handler` is an app-owned convention, not a published Python package.

```text
invoke action(input, actor)
  → allocate one AsyncSession from app-owned factory
  → start transaction when transaction=True
  → run handler with HandlerContext(actor, tx, deps, clock)
  → persist success audit and required outbox intent in same transaction
  → commit; on any failure rollback and close
  → record duration/result with bounded labels, then return/map error
```

```python
# features/orders/cancel_order/handler.py — Python business work only
async def cancel_order_run(ctx: HandlerContext, input: CancelOrderInput) -> CancelOrderOutput:
    row = await order_dal.get_owned(ctx.tx, ctx.actor.account_id, input.order_id)
    require_action(ctx.actor, OrderAction.CANCEL, row)
    if not await order_dal.cancel_if_pending(ctx.tx, row.id):
        raise OrderConflict()
    await ctx.outbox.add(ctx.tx, OrderCancelled(order_id=row.id, event_id=ctx.event_ids.new()))
    return CancelOrderOutput(id=row.id, status=OrderStatus.CANCELLED)

cancel_order = define_handler(
    name=OrderAction.CANCEL, transaction=True,
    audit=AuditAction.ORDER_CANCELLED, run=cancel_order_run,
)
```

A nested participating action uses the current transaction context and propagates failure as rollback-only; it never opens a second independent commit. A `transaction=False` action cannot run inside an active write transaction. An HTTP/RPC/event adapter may call the public `cancel_order` operation, but never reaches directly into its DAL. The consuming project implements and tests the wrapper's nested/failure behavior before adopting it.

**Proof:** success commits row, audit and outbox together; conflict and authorization failure commit none of them; a caught child failure cannot commit the parent. No network provider call occurs while the transaction is open.
