# API and wire contracts

**Applies to:** HTTP APIs and other externally consumed boundaries. Event contracts are in [events](04-events-and-workflows.md).

**API-01 MUST:** Select one canonical request/response schema owner and derive types/documentation from it. Distinguish request validation, response serialization and contract-test proof. Use compatible schema compilers/type providers in the selected profile; never compile schemas supplied by an untrusted user. External OpenAPI/protobuf ownership means generating adapters, not maintaining a second shape. See [contract pipeline](recipes/contracts.md).

**API-02 SHOULD:** Use resource-oriented HTTP for ordinary CRUD and named operations for domain actions that do not fit CRUD. Keep methods, status codes, and error codes consistent across the API. Do not encode business success as `200` with an error field.

**API-03 MUST:** For new HTTP errors needing a body, use RFC 9457 application/problem+json with stable type, appropriate status and safe title/detail. This profile adds stable code and requestId; optional field errors identify public input paths. Clients branch on type/code, never English text. Existing APIs keep their compatible envelope until a migration is planned. [Example and verification](recipes/contracts.md).

**API-04 MUST:** Declare supported filters/sorts, page bounds, stable ordering and a unique tie-breaker. Validate cursor version, scope and query compatibility; opaque cursors are not authorization. New APIs reject unknown/unauthorized filters; preserve an explicitly documented tolerant legacy policy where required for compatibility.

**API-05 MUST:** Check schema and behavioral compatibility across active consumers and overlapping releases. Added enum variants, stricter validation or changed defaults can break callers even when fields are only added. A breaking change needs owner, replacement, migration window, removal criteria and consumer proof.

**API-06 MUST:** Define safe repeated writes and concurrent transitions. For idempotency keys, specify trusted scope, payload fingerprint, atomic reservation, concurrent replay behavior, stored outcome and expiry. Reauthorize before returning a replayed result. Protect lost updates with a domain constraint, conditional version write or selected isolation/lock strategy. See [idempotency recipe](recipes/idempotency.md).

**API-07 MUST:** Declare accepted wire formats and bounds: timestamps with explicit offset normalized to UTC, supported precision, date-only YYYY-MM-DD, duration units, ID semantics and exact decimal/large-integer representation. Preserve timezone/recurrence intent separately when required. Use public DTOs rather than database/vendor objects. See [domain values](../recipes/domain-values.md).

**API-08 MUST:** Bound body/page size, rate and expensive actions according to threat/capacity needs. Use 429 for client quota exhaustion and Retry-After when a meaningful retry time is known; distinguish service overload. Allowlist response fields and test the configured serializer's actual behavior, including rejected output and error responses.

**Example:** `POST /orders/{id}/cancel` can be a named domain operation. A repeated cancellation with the same idempotency key returns the same effective result; a conflicting state returns a stable conflict code.

**Verification:** published contract, runtime edge validation, backward-compatibility review, abuse limits, and consumer-facing tests for changed behavior. Further reading: [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html), [OWASP API risks](https://api-security.owasp.org/editions/2023/en/0x11-t10/), [Fastify schema guidance](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/).
