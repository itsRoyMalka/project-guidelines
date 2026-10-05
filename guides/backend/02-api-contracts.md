# API and wire contracts

**Applies to:** HTTP APIs and other externally consumed boundaries. Event contracts are in [events](04-events-and-workflows.md).

**API-01 MUST:** Give every operation one canonical schema source for request and response, with runtime validation at the boundary and generated/published documentation. For the default HTTP stack, define compatible schemas and publish OpenAPI; if an external protobuf/OpenAPI contract already owns the shape, generate types/adapters from it instead of duplicating it.

**API-02 SHOULD:** Use resource-oriented HTTP for ordinary CRUD and named operations for domain actions that do not fit CRUD. Keep methods, status codes, and error codes consistent across the API. Do not encode business success as `200` with an error field.

**API-03 MUST:** Return stable machine-readable error codes and safe human messages. Include correlation/request ID. Clients branch on code or typed kind, never on English text.

**API-04 MUST:** Specify pagination, filtering, sorting, and maximum page size for collections. Define stable order and cursor semantics where data changes while paging. Reject unknown or unauthorised filters rather than silently ignoring them.

**API-05 MUST:** Preserve compatibility for consumers during rollout. Additive changes are preferred; breaking changes need a version/migration window and contract tests. Deprecation states owner, replacement, and removal criteria.

**API-06 MUST:** Make retried writes safe through idempotency keys or an equivalent domain invariant when a client or queue can repeat a request. Document concurrency/conflict behavior, including preconditions where relevant.

**API-07 MUST:** Use explicit wire formats: UTC ISO 8601 for instants, `YYYY-MM-DD` for calendar dates, named units for durations, and documented ID semantics. Do not leak database or vendor objects as public responses.

**Example:** `POST /orders/{id}/cancel` can be a named domain operation. A repeated cancellation with the same idempotency key returns the same effective result; a conflicting state returns a stable conflict code.

**Verification:** published contract, runtime edge validation, backward-compatibility review, and consumer-facing tests for changed behavior. Further reading: [Fastify schema guidance](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/).
