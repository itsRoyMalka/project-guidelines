# Documents and bulk operations
**TypeScript implementation:** Apply the shared [backend rule](../shared/06-optional-capabilities.md); this guide supplies TypeScript-specific conventions and examples.

**Scope:** TypeScript uploaded/generated files. **Why:** every download must refer to authorized, verified bytes.

**DOC-01 MUST:** DocStore owns document IDs, storage references, metadata, checks and retention. Business features own document links and resource authorization; store document IDs rather than bucket keys or provider URLs.

**DOC-02 MUST:** Use `documents` for identity, scope, purpose, lifecycle, temporary/final references, size/type, limits, expiry and retention. Use `document_checks` for each check attempt, result, scanner and exact immutable object version. Add upload-attempt tables only when multiple/resumable uploads need them.

**DOC-03 MUST:** Follow pending → verifying → ready, with rejected/expired/deleting/deleted states. Pin uploaded bytes before checks; only promote those bytes after all required type/malware checks pass. Failed, skipped or unavailable required scans do not grant availability.

**DOC-04 MUST:** Authorize the business resource and recheck scope/readiness before issuing a short-lived download. Bound uploads; isolate unverified storage; reconcile abandoned uploads and DB/storage partial failures. An ETag is not necessarily a content hash.

**DOC-05 MUST:** Imports/exports are feature-owned background operations with durable progress, immutable DocStore references and result/error-report IDs. State partial-success policy, bounded idempotent batches, cancellation and terminal outcomes under [JOB-06](08-background.md).

```text
features/docstore/
  create-upload/ complete-upload/ get-download/ delete-document/
  background/verify-document/ background/purge-document/
  db/{documents,document-checks}.prisma
features/orders/import-orders/     # owns import progress and business writes
```

**Check:** changed upload bytes cannot inherit an earlier scan; rejected files cannot download; failed cleanup retries safely. **Vary when:** a managed document service provides the same custody contract. Source: [OWASP uploads](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

### Example: download action

```ts
// features/docstore/get-download/handler.ts — transaction:false body excerpt
// ports are app-bound; scoped helpers enforce resource authorization.
const document = await documentDal.getAuthorized(deps.db, actor, input.documentId);
if (document.state !== DocumentState.Ready) throw new DocumentNotReadyError();
return deps.documentStorage.createDownload({
  objectVersion: document.verifiedObjectVersion,
  expiresInSeconds: DocumentPolicy.DownloadTtlSeconds,
});
```

The storage port hides bucket/vendor details. Only immutable, scan-approved bytes are referenced. A short-lived signed URL can survive later access revocation until expiry; use an authorization gateway when immediate revocation is required, as described in the [file recipe](recipes/files-and-bulk.md).
