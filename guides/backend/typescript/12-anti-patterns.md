# Backend anti-patterns
**TypeScript implementation:** Apply the shared [backend rule](../shared/01-actions-and-boundaries.md); this guide supplies TypeScript-specific conventions and examples.

**Scope:** TypeScript services using this handbook. Read the owning rule for full behavior. These are review signals, not a ban on a sound existing design.

| Avoid | Why it fails | Use instead |
| --- | --- | --- |
| Global `controllers/`, `services/`, `repositories/` folders for all features | An action is scattered and ownership blurs | Feature → action; feature `shared/` for actual reuse ([BE-01/03](01-service-design.md)) |
| A factory for every file or a base class with no behavior | Hides a simple call behind ceremony | Plain modules; factory only for policy, transaction or lifecycle ([BE-08](01-service-design.md)) |
| Handler opens an ad hoc transaction; nested calls commit independently | A parent failure leaves partial state | Handler-selected mode and one propagated context ([BE-05](recipes/transactions.md)) |
| Read state, then update without a condition or constraint | Concurrent requests can both pass the check | Scoped conditional write; check changed-row count ([DATA-06](recipes/persistence.md)) |
| Call broker/payment/email inside a DB transaction | Slow call holds locks; rollback cannot undo the external effect | Commit state plus outbox/attempt intent; deliver later ([EVT-03](recipes/outbox-and-consumers.md)) |
| Publish after commit from an in-memory callback only | A crash loses the required event | Same-transaction outbox; callback may merely wake its relay ([EVT-03](recipes/outbox-and-consumers.md)) |
| Deduplicate by event ID alone or acknowledge before commit | A second consumer is skipped or failed work is lost | Stable consumer/source/event receipt with its local effect; then acknowledge ([EVT-08](recipes/outbox-and-consumers.md)) |
| Let a feature import a vendor SDK or another feature's private DAL | Provider changes and cross-feature writes bypass owners | App-owned port/adapter or feature public operation ([INT-06](05-integrations.md), [BE-01](01-service-design.md)) |
| Trust a route role, message tenant, or opaque ID as resource authorization | Object access can leak through jobs, RPC or other callers | Verified execution scope and resource-aware handler/DAL check ([SEC-01/02](../../cross-cutting/01-security.md)) |
| Hide a cache in generic DAL calls | Staleness, keys and invalidation become invisible | Named feature read policy and explicit handler cache call ([CACHE-01/02](10-cache.md)) |
| Audit only to diagnostic logs or infer audit from every business event | Rollback, access denial and sensitive reads lose their correct meaning | Declared audit metadata and purpose-specific records ([LIFE-04/10/11](recipes/audit.md)) |
| Treat a migration rollback as undoing business data | Dropped/rewritten values cannot be recovered by restoring code | Expand, backfill, reconcile, contract; rehearse recovery ([DATA-05](recipes/migrations.md)) |
| Mock the handler and DAL in the only API test | Policy, SQL and transaction behavior are never exercised | Per-action integration through the real app/DB ([BET-01/02](07-testing.md)) |

### Small correction

```ts
// features/orders/cancel-order/handler.ts — inside defineHandler(transaction:true)
const changed = await orderDal.cancelIfPending(tx, order.id);
if (changed !== 1) throw new OrderConflictError();
await deps.outbox.add(tx, OrderCancelled.create({ orderId: order.id }));
```

The conditional DAL write and outbox intent share the handler's transaction. `OrderConflictError` is the feature's typed failure; the API maps it to a safe public code. The factory rolls back on error. **Check:** a concurrent cancellation produces one state transition and one committed event intent.

**Exception:** A single atomic statement or proven existing module layout can be simpler. Document which invariant it preserves under [GOV-05](../../00-governance.md). Sources: [Fastify testing](https://fastify.dev/docs/latest/Guides/Testing/), [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html), [transactional outbox](https://microservices.io/patterns/data/transactional-outbox), [idempotent consumer](https://microservices.io/patterns/communication-style/idempotent-consumer.html).
