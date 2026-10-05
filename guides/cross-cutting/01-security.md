# Security, identity, and tenant isolation

**Applies to:** every application and service. Product-specific threat models may add controls; this baseline does not replace organizational security policy.

**SEC-01 MUST:** Authenticate at a trusted boundary and derive principal, tenant/site, and grants from verified identity. Strip caller-supplied scope headers before constructing trusted context. Authorize the action and the specific resource on the backend; frontend gates are usability only.

**SEC-02 MUST:** Apply tenant/site scope to every data access path, including workers, reports, caches, and exports. Test a valid user attempting another tenant's identifiers. Privileged global/admin paths are explicit and audited.

**SEC-03 MUST:** Classify sensitive data and minimize collection, retention, and exposure. Keep real secrets in a secret manager, never in source, browser bundles, logs, or committed fixtures; synthetic test credentials are allowed. Encrypt sensitive data at rest according to its classification and use an approved password-hashing scheme for credentials.

**SEC-04 MUST:** Validate external input at the boundary and encode output for its context. Treat model-generated content as untrusted; render a restricted format with no raw HTML or unapproved network-loaded content. Do not interpolate user input into SQL, shell, or templates without a safe API.

**SEC-05 MUST:** Use least-privilege service permissions and scoped tokens. Bound outbound timeouts; when a user or external source influences a destination URL, restrict destinations and protect against SSRF. Record security-sensitive state changes in an audit trail with actor, scope, action, and result, without leaking secret values.

**SEC-06 MUST:** For browser sessions, choose an identity pattern using the current [OAuth browser guidance](https://www.rfc-editor.org/rfc/rfc10017.html) and document token exposure. Prefer secure, HttpOnly session cookies or a backend-for-frontend when compatible with the product. Set Secure and an explicit SameSite policy, protect cookie-authenticated writes against CSRF, and do not persist session, access, or refresh tokens in browser storage. If a browser-only OAuth client is necessary, follow the current browser BCP for authorization code with PKCE and token handling. Restrict credentialed CORS to explicit trusted origins.

**SEC-07 MUST:** Apply a Content Security Policy appropriate to the app and avoid unsafe inline execution where feasible. Review file upload/download paths, untrusted URLs, and model-rendered text as separate trust boundaries. Authorize object properties as well as object IDs to prevent mass assignment and excess data exposure.

**SEC-08 SHOULD:** Review dependency and container vulnerabilities in CI; pin and update dependencies deliberately. A release has an owner for security findings and a process for urgent fixes. Align security requirements and verification with a chosen [OWASP ASVS](https://github.com/OWASP/ASVS) level based on product risk; do not claim ASVS conformance from this guide alone.

**Verification:** cross-tenant/object/property and role tests, session/CSRF/CORS checks, secret exposure review, dependency scan, and threat review of new trust boundaries. Further reading: [OWASP API risks](https://api-security.owasp.org/editions/2023/en/0x11-t10/), [OWASP session guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP CSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
