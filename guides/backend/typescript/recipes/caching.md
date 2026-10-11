# Cache-aside example

The canonical rules are [CACHE-01–04](../10-cache.md).

```text
features/orders/get-summary/{handler,cache}.ts
integrations/cache/{cache,valkey.adapter,redis.adapter}.ts
```

`cache.ts` declares a stable name, visibility-scoped key, TTL, stale tolerance, invalidation owner and outage behavior. The handler authorizes, then calls `getOrLoad`. A successful write invalidates after commit; a durable invalidation intent closes crash gaps when needed.

Check a slow origin, failed cache, concurrent miss/refill and invalidation race. Compare origin load and latency before/after. Keep raw keys and values out of diagnostics; report bounded outcomes by cache name.

### Example: visible cache use

```ts
// features/orders/get-summary/handler.ts — transaction:false body excerpt
await deps.orderAccess.requireRead(actor, input.orderId);
return deps.cache.getOrLoad(orderSummaryCache.key(actor.visibilityKey, input.orderId), {
  policy: orderSummaryCache,
  load: () => orderDal.getSummary(deps.db, actor, input.orderId),
});
```

`orderSummaryCache` is the read action's named policy; `getSummary` still enforces trusted resource scope. The cache port is app-bound. Never put this network cache call inside a DB transaction or allow a hit to bypass authorization.
