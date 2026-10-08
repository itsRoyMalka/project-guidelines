# Select security controls and prove them

Read for a new trust boundary or sensitive capability. Own rules: SEC-03–08, DEL-08 and LIFE. Start with assets, actors, data flow and abuse cases; select the relevant ASVS version/level and record applicable controls, evidence and authorized exceptions. This recipe is not a compliance assessment.

| Boundary | Decisions to record | Representative proof |
| --- | --- | --- |
| Identity/API | Verified identity, object/property policy, abuse limits | Wrong issuer/scope/object and mass-assignment attempts |
| Browser | Session/CSRF, CSP, encoded or sanitized rendering | Unauthorized origin and malicious content cases |
| Outbound network | Destinations, redirects, credential forwarding, bounds | Blocked/private destination and response exhaustion |
| Files | Types, quarantine, storage, safe serving | Spoofed metadata, cross-scope capability, oversized file |
| Data/credentials | Sensitivity, retention, key access and rotation | Revocation, decrypt failure and deletion/rebuild |
| Build/release | Trust boundaries, minimal permissions, immutable inputs | Untrusted build cannot access production identity |

Record TLS termination and trusted proxy hops; accept forwarded identity, host, scheme and client-IP headers only from the configured trusted path. Otherwise redirects, secure-cookie decisions and abuse limits can use forged input. Cover direct-origin bypass and internal service authentication in the threat model. CORS allows explicit trusted credentialed origins; it does not authorize resources. Introduce an appropriate CSP with reviewed script sources/nonces or hashes and reporting, then verify it against actual app behavior; do not weaken it with broad exceptions merely to suppress reports. HTML encoding/sanitization and CSRF controls remain separate.

Keep deploy secrets in managed secret storage. Replayable provider credentials require encryption and managed key access/rotation; never use a fast general-purpose digest for password storage. If passwords are genuinely owned here, use a maintained adaptive password KDF with salt and current parameters; identity-provider delegation is often simpler. High-entropy API credential verification has a different threat model. Key rotation needs old/new overlap, rollback and eventual retirement; do not log plaintext during failures.

A security finding record names affected versions/data, severity, owner, mitigation/fix target, release and verification. Triage actively exploited or exposed credentials immediately under the organization's incident policy. An exception states compensating controls and expiry/review; a scan cannot approve itself. Fix the actual affected path and preserve a regression check where meaningful.

**Verification:** an applicability map links each selected control to a concrete test/config review, with unavailable evidence visible. **Alternative:** use a maintained organization control catalog with these app-specific mappings. Sources: [ASVS](https://github.com/OWASP/ASVS), [password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final).

### Example: control evidence

```text
docs/security/threat-model.md
Boundary: order cancellation API
Threat: caller submits another customer's order ID
Control: verified actor + scoped lookup + conditional transition
Proof: forbidden API request leaves order and outbox unchanged
Owner: Orders; revisit: identity model or resource sharing changes
```
