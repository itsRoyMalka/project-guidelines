# Python backend patterns and pitfalls

**Scope:** review inventory for Python services. Owning rules are [profile](01-backend.md), [code](02-code-and-typing.md), [API](03-api-and-contracts.md), [data](04-persistence-and-migrations.md), [work](05-integrations-and-work.md) and [tests](06-testing.md). Choose a pattern for a concrete invariant, not for symmetry.

| Need | Use | Avoid |
| --- | --- | --- |
| HTTP action | Thin `APIRouter` → Pydantic contract → handler → DAL | Business SQL/auth decisions in route or Pydantic validator |
| Repeated transaction/audit policy | Small app-owned `define_handler` wrapper | A factory for every class, model or contract |
| Typed internal value | Frozen dataclass or precise enum | `dict[str, Any]` passed through layers |
| External provider | Port + validated adapter | SDK import in feature handler; network call inside DB transaction |
| Concurrency | One session per task, checked update/constraint | Global `SessionContainer`; shared `AsyncSession` |
| Durable effect | Outbox + receipt/consumer identity | Publish before commit or treat Query cache as queue |
| Test setup | Bound business helpers invoking real API | Parallel test repository implementation |

```python
# features/orders/cancel_order/handler.py — Python: direct action, no class hierarchy
async def cancel_order_run(ctx: HandlerContext, input: CancelOrderInput) -> CancelOrderOutput:
    row = await order_dal.get_owned(ctx.tx, ctx.actor.account_id, input.order_id)
    require_action(ctx.actor, OrderAction.CANCEL, row)
    if not await order_dal.cancel_if_pending(ctx.tx, row.id):
        raise OrderConflict()
    await ctx.outbox.add(ctx.tx, OrderCancelled(order_id=row.id, event_id=ctx.event_ids.new()))
    return CancelOrderOutput(id=row.id, status=OrderStatus.CANCELLED)
```

**Review prompts:** Is a module's responsibility visible from its name? Does an async path hide blocking I/O? Is a provider response parsed before business use? Can a failed child write commit? Can the test fail for the intended reason? Is a lint/type suppression narrower than the code it protects?

**Verification:** trace one action, inspect query plan and failure test, then use the owning guide for a specific rule. **Exception:** existing frameworks may provide equivalent boundaries without our exact filenames or wrapper. Further reading: [SQLAlchemy session safety](https://docs.sqlalchemy.org/en/20/orm/session_basics.html).
