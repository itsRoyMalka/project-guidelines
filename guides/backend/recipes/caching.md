# Cache lifecycle

Read when repeated expensive reads justify caching. Owner: [DATA-06](../03-data-and-migrations.md); browser ownership: [STATE-02](../../frontend/02-state-and-forms.md). First measure cost and decide acceptable staleness. Authorization and durable truth remain with their owners.

For each cache, record key (tenant, identity/grants when they affect output, resource, filters, schema version), source of truth, TTL, invalidation event, failure behavior, maximum size and owner. Use bounded TTL/eviction; an unbounded process map is not a cache policy. Avoid caching secrets or authorization decisions beyond revocation requirements.

Prefer cache-aside for ordinary reads: fetch missing data from the owner, store only permitted representation, and invalidate after committed writes. Account for the race where an old read refills after invalidation: use versions/generations, short bounded staleness, or a coordinated write-through mechanism when stronger consistency is required. Strong read-after-write flows may bypass the cache.

Coalesce concurrent misses and add TTL jitter where useful. Keep fallback bounded so a cache outage does not stampede a database. Decide whether stale data is acceptable per resource; financial/permission data may require explicit failure instead. Negative caching needs short TTL and scope so one unauthorized response cannot poison another caller's result.

**Proof:** write then read, concurrent refill/invalidation, tenant switch, revocation, eviction, cold start and cache outage under representative concurrency. Measure hit rate and origin load; cache hit rate alone is not correctness. **Alternative:** an indexed database read or request-local memoization often suffices. Scope keys follow [Query identity](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys); server cache coordination is a contextual engineering choice.
