# Local service, database and remote sync

**Scope:** desktop apps that own durable local state or work offline. Keep the [main/preload/renderer boundary](01-app-and-security.md); reuse [BE feature actions](../backend/shared/01-actions-and-boundaries.md), [API contracts](../backend/typescript/02-api-contracts.md), [data integrity](../backend/shared/02-data-and-time.md), [FE state](../frontend/02-state-and-forms.md) and [security](../cross-cutting/01-security.md). The local database and remote database are separate owners with an explicit protocol between them.

| Mode | When | Source of truth |
| --- | --- | --- |
| Remote-only | Connected app; no durable local need | Remote API/BE; Query is a cache |
| Local-only | Single-device work without a server | Local service/database; backup/export is essential |
| Remote-owned cache | Fast/offline reads, writes require network | Remote BE; local data is rebuildable except unsent user work |
| Offline-capable sync | User must edit without network | Declare authority per entity/field and a conflict protocol |

**DESKDATA-01 MUST:** Record the selected mode and authority per entity before adding a database. A local service is an in-process main/utility-process application boundary, not an HTTP server by default. The renderer uses typed IPC; local feature actions keep contract, handler and DAL together like the BE guide. Use a utility process only for measured CPU/blocking/crash isolation, with the same typed boundary.

```text
apps/desktop/src/main/
  features/orders/save-draft/{contract,handler,desktop}.ts
  features/orders/shared/dal.shared.ts
  app/register-features.ts
  storage/sqlite.ts
  sync/{outbox,push,pull,policies}/ # only for selected sync mode
apps/desktop/db/migrations/       # one local schema history per app database
apps/desktop/src/renderer/features/orders/draft/{api,ui}/
```

```ts
// main/features/orders/save-draft/desktop.ts — project-owned IPC binder
export const saveDraftAction = defineDesktopAction({
  channel: DesktopChannel.SaveDraft,
  input: saveDraftInput,
  handler: saveDraft,
});
// Binder validates sender/input; handler owns business state and transaction.
```

**DESKDATA-02 MUST:** If a local relational store is needed, prefer SQLite as the starting candidate and keep writes behind the local service. Use one owning connection/queue for writes, constraints/indexes for invariants and measured queries, and versioned migrations before opening feature windows. WAL is a local-disk concurrency option, not a network-filesystem format or a sync protocol. Test checkpoints, corruption detection, interrupted migration and restore. For a local-only app, use SQLite's backup API or an equivalent consistent snapshot; copying a live DB file alone can lose WAL data. [SQLite WAL](https://www.sqlite.org/wal.html), [backup API](https://www.sqlite.org/backup.html), [PRAGMAs](https://www.sqlite.org/pragma.html).

```sql
-- apps/desktop/db/migrations/0001_order_drafts.sql — local schema source
CREATE TABLE order_drafts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  title TEXT NOT NULL,
  server_version INTEGER,
  updated_at TEXT NOT NULL
);
CREATE INDEX order_drafts_account_updated ON order_drafts(account_id, updated_at DESC);
```

`updated_at` is a validated UTC instant; it is not the conflict authority. The migration runner records applied versions and fails safely before feature access. Use an app-owned support directory; keep database files and WAL together. Ordinary SQLite is not encrypted: select a vetted encrypted-store adapter or field encryption when data classification requires it, with an OS-protected key, rotation and recovery plan.

**DESKDATA-03 MUST:** For offline writes, commit the local state and a durable outbound command in the same local transaction. Give the command a stable ID and idempotency key that survive crashes/retries. The remote API reauthorizes and validates the operation; local acceptance is pending, not remote success. A Query cache or persisted React mutation alone is not the durable business queue.

```ts
// main/features/orders/save-draft/handler.ts — local transaction excerpt
await localDb.transaction(async db => {
  await orderDraftDal.save(db, { ...input, accountId: actor.accountId });
  await syncOutbox.add(db, {
    id: commandId, type: SyncCommand.SaveOrderDraft,
    accountId: actor.accountId, payload: input, baseVersion: input.baseVersion,
  });
});
return { status: SyncStatus.Pending, localId: input.id };
```

The local handler validates the authenticated local account; the remote handler checks current authorization and business invariants again. The outbox stores only the data needed to replay the command, with the same privacy/retention controls as the draft.

**DESKDATA-04 MUST:** Sync through a declared remote contract, not direct client access to the server database. Push bounded outbox batches with stable IDs; retry unknown outcomes using the same key. Pull scoped incremental changes with a server-issued cursor, stable ordering and defined retention window; apply changes and advance the local cursor in one transaction. A cursor is a checkpoint, not authorization. Rebuild from a snapshot when a cursor expires. Preserve deletes as tombstones/changes until supported clients can observe them. [CouchDB replication concepts](https://docs.couchdb.org/en/stable/replication/protocol.html) illustrate checkpoints and conflicts; they are evidence, not a required provider.

```ts
// main/sync/run-once.ts — project-owned sync port; bounded work
for (const command of await syncOutbox.nextBatch({ limit: 50 })) {
  const result = await remote.apply(command, { idempotencyKey: command.id });
  await localDb.transaction(db => syncOutbox.ackAndApply(db, command.id, result));
}
const batch = await remote.changes({ cursor: checkpoint.value, limit: 100 });
await localDb.transaction(async db => {
  await localChanges.apply(db, batch.changes); // deletes; preserves pending edits/conflicts
  await checkpoint.save(db, batch.nextCursor);
});
```

The adapter handles partial batch failure, expiry, authentication and backoff; it never acknowledges an uncommitted local apply. `remote.apply` uses a versioned API action, not a database connection. A platform-managed replication engine may replace this protocol when its authority, schema, conflict and recovery behavior fit the product..

**DESKDATA-05 MUST:** Define a conflict policy per entity or action. Use server version/conditional writes for server-owned business state; on conflict retain the local intent and show the user a recoverable choice. Automatic field merges or last-write-wins are allowed only for fields whose semantics make that safe. Never infer order from device wall clocks. [SQLite changeset conflicts](https://www.sqlite.org/sessionintro.html), [shared time rules](../backend/shared/02-data-and-time.md).

```ts
// main/sync/policies/order-draft.ts — project-owned conflict decision
if (response.code === SyncError.VersionConflict) {
  await localDrafts.markConflict(command.localId, response.serverVersion);
  return { status: SyncStatus.NeedsReview };
}
// UI shows local and server drafts; it does not silently overwrite either.
```

**DESKDATA-06 MUST:** Scope local rows, outbox, cursors, keys and diagnostics to the active verified account. On logout or account switch, stop sync first, revoke credentials and clear or securely quarantine protected local data according to the product's retention policy; warn or provide recovery for unsent user work before a destructive wipe unless policy requires it. Resume on launch/network/wake with one owned worker, bounded batches/backoff and visible pending/synced/conflict/error state; do not rely on a timer running through sleep. [desktop lifecycle](02-experience-and-integration.md).

```ts
// main/app/account-switch.ts — ordering matters
await sync.stop();
await localStore.closeAccount(previousAccountId);
await credentialStore.remove(previousAccountId);
await localStore.openAccount(nextAccountId); // migration + scope check before UI access
```

**DESKDATA-07 MUST:** Prove both data integrity and user-visible recovery: offline write, crash after local commit before push, duplicate/unknown-result push, pull replay, concurrent remote edit, delete, expired cursor, account switch, migration/old binary and a large backlog. Monitor queue age/count, last successful sync, conflict count and local storage size with bounded labels; never log row content or credentials.

```text
save draft offline → show Pending → restart → same command ID pushes once
remote rejects stale version → preserve local draft → show NeedsReview
pull delete → remove local view and advance cursor atomically
```

**Verification:** an adopter can name the owner of every local/remote dataset and demonstrate recovery after each interruption point. **Exception:** local-only apps omit sync; remote-only apps omit SQLite and local service; a provider-managed sync engine replaces the custom protocol only after its conflict, security, migration and recovery semantics are verified. No sync implementation in this handbook is certified or shipped.
