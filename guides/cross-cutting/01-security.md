# Security, identity, and tenant isolation

**Applies to:** every application and service. Product-specific threat models may add controls; this baseline does not replace organizational security policy.

**SEC-01 MUST:** Authenticate using the selected identity profile and derive verified principal/grants. For signed tokens validate integrity, issuer, audience, expiry and other required claims; use trusted introspection/session lookup for opaque credentials. Decoding alone is insufficient. Strip untrusted scope headers, authenticate gateway/service propagation and prevent bypass. Authorize actions/resources on the backend. See [identity profile](recipes/identity.md).

**SEC-02 MUST:** Enforce trusted scope on every protected access path, including relations, caches, exports and delegated workers. For multi-tenant products, define tenant selection, invitation/offboarding and administrative/global-data paths; test cross-tenant identifiers and relations. Single-tenant products test their actual account/resource boundaries; frontend visibility is not protection.

**SEC-03 MUST:** Classify data and minimize collection/retention. Put deploy secrets in managed storage; encrypt replayable customer/provider credentials with managed key lifecycle. Passwords use an approved adaptive password hash, never a fast digest alone. Keep real credentials out of source, bundles and logs; synthetic fixtures are allowed. See [security controls](recipes/security-controls.md) and [data lifecycle](../backend/shared/05-data-lifecycle.md).

**SEC-04 MUST:** Validate untrusted input and use parameterized SQL/safe APIs, with context-appropriate output encoding. Model/user rich text uses a restricted format or reviewed sanitizer and controlled URLs; plain text is the default. An intentional sanitized HTML renderer is a documented trust boundary, not permission for raw arbitrary markup.

**SEC-05 MUST:** Use least-privilege identities and authenticated integrations. When a caller influences outbound destinations, apply egress/destination/redirect controls against SSRF. Audit consequential security/data changes with actor, trusted scope, action and result under retention/access/tamper-resistance policy. See [integration boundaries](../backend/shared/03-effects-and-operations.md).

**SEC-06 MUST:** Choose the [browser identity profile](recipes/identity.md). Prefer a Secure, HttpOnly server-session cookie with explicit SameSite and CSRF controls. Keep bearer credentials out of JavaScript-readable persistent storage by default; the protected session cookie is intentional browser-held state. Browser-only OAuth uses code with PKCE and documented exposure of credentials, expiration, revocation and logout. Restrict credentialed CORS to explicit trusted origins.

**SEC-07 MUST:** Use appropriate CSP and controlled untrusted rendering. Explicitly allowlist writable/readable properties; do not spread request bodies into persistence updates. Apply [file handling](../backend/typescript/recipes/files-and-bulk.md) when uploads/downloads exist, including safe storage/serving and authorization.

**SEC-08 MUST:** Select applicable security checks from product risk and the chosen ASVS scope. CI performs applicable secret/dependency/container checks under DEL-02; findings have severity, owner, response target and documented expiring exceptions. Escalate urgent exposures and preserve release evidence. A guide or passing scan is not an ASVS assessment.

**Verification:** cross-tenant/object/property and role tests, session/CSRF/CORS checks, secret exposure review, dependency scan, and threat review of new trust boundaries. Further reading: [OWASP API risks](https://api-security.owasp.org/editions/2023/en/0x11-t10/), [OWASP session guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP CSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

**SEC-09 MUST:** Maintain a short threat model for consequential trust/data changes: asset/boundary → threat → control → proof → owner. Store durable context in `docs/security/threat-model.md`; small changes may link the relevant ticket entry.

**SEC-10 MUST:** Inventory sensitive data by purpose, owner, access and lifecycle; minimize collection and include derived copies. Track vulnerability severity, owner, response deadline and expiring exceptions. Privacy/security incidents use the normal owned incident process.

```text
Threat: customer guesses another order ID
Control: trusted actor + scoped DAL read
Proof: forbidden cross-account API test
Owner: Orders
```

### Example: resource policy inside the handler

```ts
// features/orders/get-order/handler.ts — authorized read body
const order = await orderDal.getOwned(deps.db, actor, input.orderId);
return toOrderView(order);
```

`getOwned` filters by the trusted actor's access, not a caller-supplied owner ID; it hides inaccessible records according to the selected disclosure policy. `toOrderView` allowlists public fields. The API already authenticated and checked the named read action; the resource check remains necessary.

Server database identities, effective grants and time-bounded human/agent access are defined in [DBA rules](../backend/shared/database/01-identities-and-access.md).
