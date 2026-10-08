# Files, downloads and bulk operations

Read when importing/exporting data or handling user files. Owners: SEC-07, API-08, INT-04, LIFE-01–09, [DOC-01–05](../11-docstore.md) and [JOB-06](../08-background.md). Apply only when this capability exists.

Upload: authenticate/authorize scope, cap size and decompression/processing cost, allow required types, and validate content as well as untrusted filename/MIME. Generate storage keys independent of caller paths; quarantine until required scanning/transformation completes. Store outside an executable/public web root. Serve with deliberate content type/disposition and isolated origin where active content is possible. A signed URL is a short-lived scoped capability, not permanent authorization.

Revocation is a design choice before issuing direct storage URLs. Ordinary signed URLs can remain usable by any holder until expiry even after account revocation. If policy requires immediate access removal, use an authenticated download gateway or a verified storage revocation/invalidation mechanism; otherwise obtain the authorized risk owner's explicit acceptance of the bounded validity window. Do not claim that revoking the app session revokes an already-issued URL. Test revocation during an active stream and define whether the gateway must terminate it. Capability theft/sharing remains a risk even when the URL is scoped to one object.

Download: authorize each request or signed capability issuance, bound expiry and scope, avoid logging signed credentials, and define cancellation/stream failure. Audit the event actually observed. Exports restrict properties/rows by policy; take care with spreadsheet formula-like cells in CSV output according to the consuming format.

Bulk import: validate an initial manifest/sample, then process bounded chunks with stable row identity. Choose atomic whole-file acceptance only where size permits; otherwise publish per-row outcomes and a resumable job ID. Retrying a chunk cannot duplicate accepted rows. Define conflict policy, progress, partial failure and cancellation. A cancellation signal does not undo already committed rows unless a compensating process is designed.

Bulk export: use stable snapshot/cursor semantics where consistency matters, cap resource use and prevent tenant mixing across pages/jobs. Apply expiry and deletion propagation to generated artifacts. Reauthorize job/status/download access, not only job creation.

**Proof:** forged MIME/path, oversized/archive expansion, rejected content, unauthorized capability issuance/use according to the selected capability policy, expired capability, interrupted streaming, partial retry and deletion of generated artifacts. **Alternative:** use the platform's maintained object-storage/scanning pipeline with the same access and lifecycle contract. [OWASP upload guidance](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) supports combined controls; exact scanners/types are project decisions.
