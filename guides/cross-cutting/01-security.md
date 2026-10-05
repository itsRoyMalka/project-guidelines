# Security, identity, and tenant isolation

**Applies to:** every application and service. Product-specific threat models may add controls; this baseline does not replace organizational security policy.

**SEC-01 MUST:** Authenticate at a trusted boundary and derive principal, tenant/site, and grants from verified identity. Strip caller-supplied scope headers before constructing trusted context. Authorize the action and the specific resource on the backend; frontend gates are usability only.

**SEC-02 MUST:** Apply tenant/site scope to every data access path, including workers, reports, caches, and exports. Test a valid user attempting another tenant's identifiers. Privileged global/admin paths are explicit and audited.

**SEC-03 MUST:** Classify sensitive data and minimize collection, retention, and exposure. Keep secrets in a secret manager, never in source, browser bundles, logs, or test fixtures. Encrypt sensitive data at rest where required and use password hashing for credentials.

**SEC-04 MUST:** Validate external input at the boundary and encode output for its context. Treat model-generated content as untrusted; render a restricted format with no raw HTML or unapproved network-loaded content. Do not interpolate user input into SQL, shell, or templates without a safe API.

**SEC-05 MUST:** Use least-privilege service permissions and scoped tokens. Establish explicit timeouts and allowlists for outbound calls. Record security-sensitive state changes in an audit trail with actor, scope, action, and result, without leaking secret values.

**SEC-06 SHOULD:** Review dependency and container vulnerabilities in CI; pin and update dependencies deliberately. A release has an owner for security findings and a process for urgent fixes.

**Verification:** cross-tenant/role tests, secret exposure review, dependency scan, and threat review of new trust boundaries.
