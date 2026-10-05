# TypeScript wire contract pipeline

Applies to [API rules](../02-api-contracts.md) and the [split profile](../../profiles/typescript-split.md). Use a compatible version set from [verification](../../profiles/verification.md); this is the selected integration, not a claim every schema library combines automatically.

## One source to deployed boundary

1. Define public Zod request/response wire schemas beside the owning API feature. Keep persistence objects separate. Reject unexpected write fields when silently ignoring them would hide client bugs or mass-assignment attempts.
2. Install the compatible Fastify Zod type provider's validator and serializer compilers. Type inference alone does not install runtime checks. Register Swagger with its Zod JSON-schema transform before routes.
3. Map application outputs to public DTOs. Response serialization enforces that DTO contract; an invalid server output is a server defect, not a client validation error. Never expose the raw validation/serialization exception.
4. Export OpenAPI from registered routes without production services/secrets. Generate consumer types/client and typecheck a real call site. Commit generated output or regenerate deterministically in CI, according to the target repo policy; fail on drift.
5. Verify invalid input, private-field exclusion, invalid output and supported old/new consumer combinations at runtime. Generated TypeScript types do not validate a malicious or incompatible remote server response; validate runtime data where the trust boundary requires it.

```ts
// Wiring excerpt; authentication, public error mapping and lifecycle omitted here.
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import { z } from 'zod';
import { validatorCompiler, serializerCompiler, jsonSchemaTransform,
  type ZodTypeProvider } from 'fastify-type-provider-zod';

const app = Fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
await app.register(swagger, {
  openapi: { info: { title: 'Orders', version: '1.0.0' } },
  transform: jsonSchemaTransform,
});
const Order = z.object({ id: z.string(), status: z.enum(['open', 'cancelled']) });
app.withTypeProvider<ZodTypeProvider>().get('/orders/:id', {
  schema: { params: z.object({ id: z.string().regex(/^[0-9]+$/) }), response: { 200: Order } },
}, async request => ({ id: request.params.id, status: 'open' as const }));
```

A consuming fixture generated with `openapi-typescript openapi.json -o generated-api.d.ts` can assert its public DTO using `paths['/orders/{id}']['get']['responses'][200]['content']['application/json']`. Record generator version; do not hand-maintain a second response interface. Pure JSON wire types are easiest to publish; transforms, dates, unions and codecs require explicit input/output compatibility checks.

## Errors, evolution and list contracts

Map expected domain errors deliberately: validation to 400, authenticated permission denial to 403 or concealed 404 under policy, missing resource to 404, state/version conflict to 409 (or documented conditional-request 412), rate limit to 429. Authentication failure is 401. Unexpected errors return a safe 500 and correlated internal diagnostics. These are selected conventions, not an exhaustive HTTP mapping.

```json
{"type":"https://example.test/problems/order-conflict","title":"Order changed","status":409,"code":"ORDER_CONFLICT","requestId":"correlation-id"}
```

Use `application/problem+json`; field errors contain safe paths/codes, no secret values or stack traces. Authentication/tenant checks govern error disclosure as well as successful data.

List endpoints bound page size, allowlist filters/sorts and use a stable tie-breaker such as `(created_at, id)`. Bind cursor semantics to tenant/filter/sort and validate cursor structure; sign opaque cursors if tampering matters. A cursor is not authorization. Document consistency when records change between pages.

An added enum member can break exhaustive clients; a new default can change existing behavior. Diff generated contracts, identify consumers and exercise compatibility rather than classifying every additive change as safe. Introduce a compatibility window and deprecation owner where deployments are independent.

**Alternative:** JSON Schema/TypeBox with Fastify's supported provider, or a contract owned by an external OpenAPI/protobuf source. Select one canonical pipeline and prove it. Source: [Zod provider integration](https://github.com/turkerdev/fastify-type-provider-zod); protocol error shape follows [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457).
