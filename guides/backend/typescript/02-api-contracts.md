# API and wire contracts
**TypeScript implementation:** Apply the shared [backend rule](../shared/01-actions-and-boundaries.md); this guide supplies TypeScript-specific conventions and examples.

**Applies to:** TypeScript HTTP APIs and other externally consumed boundaries. Event contracts are in [events](04-events-and-workflows.md).

**API-01 MUST:** Own each public wire contract once. In a TS monorepo use browser-safe `packages/contracts/<feature>/endpoints.const.ts` with Zod input/output and method/path; the BE feature owns semantics. Generate OpenAPI/clients for separate repositories or languages; never hand-copy DTOs.

```ts
// packages/contracts/orders/endpoints.const.ts — browser-safe declaration source
export const orderEndpoints = {
  cancel: {
    method: 'POST', path: '/orders/:orderId/cancel',
    params: z.object({ orderId: z.string().uuid() }),
    response: z.object({ id: z.string(), status: z.literal(OrderStatus.Cancelled) }),
  },
} as const;
```

**API-02 SHOULD:** Use resource-oriented HTTP for ordinary CRUD and named operations for domain actions that do not fit CRUD. Keep methods, status codes, and error codes consistent across the API. Do not encode business success as `200` with an error field.

**API-03 MUST:** For new HTTP errors needing a body, use RFC 9457 application/problem+json with stable type, appropriate status and safe title/detail. This profile adds stable code and requestId; optional field errors identify public input paths. Clients branch on type/code, never English text. Existing APIs keep their compatible envelope until a migration is planned. [Example and verification](recipes/contracts.md).

`features/orders/cancel-order/api.ts` error response (serializer output):

```json
{ "type": "https://api.example.com/problems/order-conflict", "title": "Order conflict", "status": 409, "code": "ORDER_CONFLICT", "requestId": "req_123" }
```

**API-04 MUST:** Declare supported filters/sorts, page bounds, stable ordering and a unique tie-breaker. Validate cursor version, scope and query compatibility; opaque cursors are not authorization. New APIs reject unknown/unauthorized filters; preserve an explicitly documented tolerant legacy policy where required for compatibility.

```ts
// packages/contracts/orders/endpoints.const.ts — query boundary, illustrative excerpt
const listOrdersQuery = z.strictObject({
  status: z.enum([OrderStatus.Pending, OrderStatus.Cancelled]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});
// DAL order: createdAt DESC, id DESC. Cursor carries version, scope and filter fingerprint.
```

**API-05 MUST:** Check schema and behavioral compatibility across active consumers and overlapping releases. Added enum variants, stricter validation or changed defaults can break callers even when fields are only added. A breaking change needs owner, replacement, migration window, removal criteria and consumer proof.

**API-06 MUST:** Define safe repeated writes and concurrent transitions. For idempotency keys, specify trusted scope, payload fingerprint, atomic reservation, concurrent replay behavior, stored outcome and expiry. Reauthorize before returning a replayed result. Protect lost updates with a domain constraint, conditional version write or selected isolation/lock strategy. See [idempotency recipe](recipes/idempotency.md).

```ts
// features/orders/cancel-order/handler.ts — project-owned DB operation
const updated = await tx.order.updateMany({
  where: { id: input.orderId, status: OrderStatus.Pending, version: loaded.version },
  data: { status: OrderStatus.Cancelled, version: { increment: 1 } },
});
if (updated.count !== 1) throw new OrderConflictError();
// The endpoint adapter handles scoped idempotency reservation and replay.
```

**API-07 MUST:** Declare accepted wire formats and bounds: timestamps with explicit offset normalized to UTC, supported precision, date-only YYYY-MM-DD, duration units, ID semantics and exact decimal/large-integer representation. Preserve timezone/recurrence intent separately when required. Use public DTOs rather than database/vendor objects. See [domain values](../../recipes/domain-values.md) and [BE time decisions](14-time-and-dates.md).

**API-08 MUST:** Bound body/page size, rate and expensive actions according to threat/capacity needs. Use 429 for client quota exhaustion and Retry-After when a meaningful retry time is known; distinguish service overload. Allowlist response fields and test the configured serializer's actual behavior, including rejected output and error responses.

**Example:** `POST /orders/{id}/cancel` can be a named domain operation. A repeated cancellation with the same idempotency key returns the same effective result; a conflicting state returns a stable conflict code.

**Verification:** published contract, runtime edge validation, backward-compatibility review, abuse limits, and consumer-facing tests for changed behavior. Further reading: [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html), [OWASP API risks](https://api-security.owasp.org/editions/2023/en/0x11-t10/), [Fastify schema guidance](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/).

**API-09 MUST:** Bind the contract, handler and explicit `policy.access` in action `api.ts` through `defineEndpoint`. Feature `api.ts` exports the endpoint list; app composition adds the global prefix. The adapter enforces validation, serialization, access and documentation.

**API-10 MUST:** Access is explicitly public, authenticated or RBAC with a named shared action constant. Optional rate limits declare trusted actor/IP keys and bounds separately. Extra boolean checks live in optional `validations.ts`; loaded-state checks stay in the handler.

```ts
// features/orders/schedule-delivery/validations.ts — optional cross-field check
export const scheduleDeliveryValidations = [
  (input: ScheduleDeliveryInput) => input.body.endAt > input.body.startAt,
];
// api.ts binds these checks; handler.ts checks the loaded order state.
```

```ts
// features/orders/cancel-order/api.ts — project-owned endpoint factory
export const cancelEndpoint = defineEndpoint({
  contract: orderEndpoints.cancel,
  policy: { access: { type: Access.Rbac, action: OrderAction.Cancel } },
  handler: cancelOrder,
});
```

RBAC uses code-owned action IDs, curated permissions, configurable roles and scoped grants. Every HTTP/RPC/job entry establishes its own trusted authorization boundary. An omitted policy must fail registration, not become public.
