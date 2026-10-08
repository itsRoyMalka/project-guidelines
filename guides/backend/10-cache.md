# Explicit cache policy

**Scope:** application data caches. **Why:** make performance gains and stale-data behavior visible.

**CACHE-01 MUST:** Justify caching with measured latency/load and an improvement target. Feature read `cache.ts` states name, scoped key, TTL, staleness, invalidation owner, outage behavior and evidence.

**CACHE-02 MUST:** Call `cache.getOrLoad` visibly in the handler. Do not hide business caching in the DAL or generic factory. Authorize each request; include visibility scope in keys and invalidate after commit, durably when required.

**CACHE-03 MUST:** Test refill/invalidation races, stampedes and bounded fallback. Strictly fresh paths bypass caching or use a proven version strategy.

**CACHE-04 MUST:** `integrations/cache/` owns the port and Valkey/Redis adapters. Emit bounded hit/miss/bypass/error/invalidation metrics and load latency by cache name; sample routine diagnostics and never log raw keys or values.

```ts
// get-summary/handler.ts — transaction:false; ports are app-bound.
await deps.orderAccess.requireRead(actor, input.orderId);
const result = await deps.cache.getOrLoad(orderSummaryCache.key(actor.visibilityKey, input.orderId), {
  policy: orderSummaryCache,
  load: () => orderDal.getSummary(deps.db, actor, input.orderId),
});
```

**Check:** compare representative before/after origin load and latency, plus stale-data behavior. **Vary when:** static asset/CDN caching follows explicit HTTP caching rules. Verify selected Valkey/Redis compatibility rather than assuming every extension is interchangeable.
