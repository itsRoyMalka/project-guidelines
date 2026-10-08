# Cache-aside example

The canonical rules are [CACHE-01–04](../10-cache.md).

```text
features/orders/get-summary/{handler,cache}.ts
integrations/cache/{cache,valkey.adapter,redis.adapter}.ts
```

`cache.ts` declares a stable name, visibility-scoped key, TTL, stale tolerance, invalidation owner and outage behavior. The handler authorizes, then calls `getOrLoad`. A successful write invalidates after commit; a durable invalidation intent closes crash gaps when needed.

Check a slow origin, failed cache, concurrent miss/refill and invalidation race. Compare origin load and latency before/after. Keep raw keys and values out of diagnostics; report bounded outcomes by cache name.
