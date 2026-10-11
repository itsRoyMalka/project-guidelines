# Python optional backend capabilities

**Scope:** selected cache, document and RPC capabilities. The [shared optional rules](../shared/06-optional-capabilities.md) decide when to add them; these are Python expression examples, not mandatory packages.

**PYOPT-01 SHOULD:** A cache adapter may use Valkey/Redis through an app-owned `CachePort`; feature handlers call an explicit cache operation where benefit is measured. Cache keys include account/tenant scope when relevant, and logs/metrics identify hit/miss/invalidation without sensitive values. Do not hide cache inside a generic DAL read.

```python
# features/orders/list_orders/handler.py — Python explicit cache use
cached = await ctx.order_cache.get_summary(actor.account_id, query.key)
if cached is not None:
    return cached
result = await order_dal.list_summary(ctx.tx, actor.account_id, query)
await ctx.order_cache.put_summary(actor.account_id, query.key, result, ttl_seconds=60)
return result
```

**PYOPT-02 MUST:** A DocStore feature owns metadata, state and authorization; an object-store adapter owns bytes. The scan worker updates the record to available only after verifying its immutable object identity and scan result. Download rechecks access and state.

```python
# features/documents/download/handler.py — Python authorized access
record = await ctx.documents.get_authorized_metadata(actor, document_id)
if record.state is not DocumentState.AVAILABLE:
    raise DocumentUnavailable()
return await ctx.document_bytes.open_verified(record.object_key, record.sha256)
# Metadata operation closes its read transaction before object-store I/O.
```

**PYOPT-03 SHOULD:** For service RPC, publish one feature-owned schema (OpenAPI or selected Protobuf/Connect schema) and generate clients where supported. A Python adapter translates transport errors to app failures; handlers consume a typed port and never another service's ORM model.

```python
# integrations/catalog/port.py — Python app-owned port
class CatalogPort(Protocol):
    async def get_item(self, item_id: UUID, *, deadline: datetime) -> CatalogItem: ...
```

**Verification:** cache invalidation/fallback, infected/unavailable file rejection, RPC deadline and old-client compatibility. **Exception:** no cache, DocStore or RPC directories are created until their capability is selected.
