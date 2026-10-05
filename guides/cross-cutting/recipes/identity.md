# Identity, browser sessions and trusted scope

Read for authenticated requests, jobs and session changes. Owners: SEC-01/02/06, DATA-02. Use a maintained identity provider/library; record trust topology before writing middleware.

## Server session / BFF default

Store provider tokens on the server behind an opaque session ID. Send that ID in a Secure, HttpOnly cookie with deliberate SameSite, host/path scope and lifetime. Rotate session identity at authentication/privilege transitions; expire/revoke on logout, disablement and policy timeout. Protect state changes against CSRF using the framework's verified mechanism or a reviewed token/origin/header policy. CORS restrictions alone do not stop every form-based CSRF request. SameSite decisions must account for the actual site/origin topology.

## Browser-only OAuth alternative

Use authorization code with PKCE through the provider's supported library; no client secret in the browser. Document token scope/lifetime and storage exposure. Prefer in-memory bearer state; do not default to JavaScript-readable persistent tokens. Follow the provider/current browser guidance for refresh rotation and revocation. HttpOnly session cookies are intentionally browser-held state and are not prohibited by the bearer-storage rule. XSS can still act through the user's session: sanitization/CSP and minimized privileges remain necessary.

## Verified principal and tenant

Validate signature/allowed algorithm, issuer, audience, lifetime and profile-required claims. Derive membership/grants from the authoritative identity/access system. A tenant selector is untrusted input until membership is checked. A gateway strips client scope headers and propagates authenticated context; downstream services either verify it or rely on a documented authenticated private channel that cannot be bypassed. Authentication claims apply to the selected credential format: token validation is not performed on an opaque session ID; resolve that ID through the trusted session store instead. Workers validate producer identity and delegated scope/lifecycle, including revoked memberships where policy requires.

```text
external request → verified principal → allowed tenant selection
→ scoped minimal resource read → action/property policy → operation
```

For hidden resources, the profile can map wrong-tenant and absent resources to the same public not-found response before revealing role/state distinctions. Authentication and valid IDs alone never authorize the resource. Global reference/admin data has an explicit separate policy. On browser logout or scope change, apply [cache cleanup](../../frontend/recipes/state-and-forms.md); SSR user data is request-isolated.

**Proof:** expired/wrong-audience token, forged gateway header, direct-service bypass, cross-tenant read/write/relation, revoked account, CSRF attempt, logout and stale client data. Rate-limit sensitive identity actions; use organization-selected SSO/MFA/provisioning requirements rather than inventing password flows. Sources: [browser OAuth](https://www.rfc-editor.org/rfc/rfc10017.html), [OWASP REST security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html). Exact provider configuration is a project overlay.
