# One wire contract, two consumers

Owners: [API-01/09/10](../02-api-contracts.md), [FE-03](../../frontend/01-architecture.md).

```text
packages/contracts/orders/endpoints.const.ts  # Zod params/query/body/response + method/path
apps/api/src/features/orders/cancel-order/api.ts # policy + handler binding
apps/web/src/features/orders/cancel/api/cancel-order.ts # client.call(descriptor)
```

The endpoint adapter registers the descriptor with Fastify's compatible schema compiler, serializer and OpenAPI transform. Response validation and serialization must match the public schema; no hidden private fields. Shared TS consumers infer types and validate responses at runtime. Separate-repo or other-language clients generate from published OpenAPI.

```ts
export const cancelEndpoint = defineEndpoint({
  contract: orderEndpoints.cancel,
  policy: { access: { type: Access.Rbac, action: OrderAction.Cancel } },
  handler: cancelOrder,
});
```

Extra `validations.ts` checks return boolean and map a named failure code. They receive parsed input; business state and object authorization remain in the handler. A compatible additive response field should not break tolerant readers; changed enums/defaults/semantics still need review. Return RFC 9457 problem details with stable code/requestId, never raw ORM/provider errors.

**Proof:** invalid request, disallowed access, malformed/private response, published schema and client build. Pin/test the actual Zod/Fastify adapter combination. These factories are project APIs, not Fastify exports. Source: [Fastify validation](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/).
