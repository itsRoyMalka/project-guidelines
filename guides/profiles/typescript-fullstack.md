# TypeScript fullstack profile

**Choose when:** one web product benefits from one server deployment.

- React Router server loaders/actions call server-only feature handlers directly; internal HTTP is unnecessary.
- Keep the same action/handler/DAL responsibilities and public DTOs as the backend guide.
- Use explicit `.server` boundaries; client imports and serialized route data must exclude credentials, ORM and provider code.
- Router owns route-data freshness. React Hook Form owns form drafts and submits through the selected route action/fetcher.
- Separate process resources from request identity; server caches and client stores cannot leak between requests.

```text
app/routes/orders.tsx                 # thin loader/action + view composition
app/features/orders/cancel-order/
  handler.server.ts
  dal.server.ts
  contract.ts
  ui/cancel-order.tsx
  cancel-order.test.tsx
```

**Check:** client/server build, deliberately rejected private import, authorized handler/data path, CSRF and mutation revalidation. **Alternative:** [split](typescript-split.md) for independent clients/deployments. Verify the selected dependency versions in the adopting project.

### Example: server action boundary

```ts
// app/routes/orders.cancel.tsx — React Router route action excerpt
export async function action({ request, params, context }: Route.ActionArgs) {
  await context.security.requireCsrf(request);
  const actor = await context.sessions.requireVerifiedActor(request);
  const input = cancelOrderParams.parse(params);
  await context.access.requireAction(actor, OrderAction.Cancel);
  return context.handlers.cancelOrder({ input, actor });
}
```

`Route.ActionArgs` is generated for this route; the selected router context is app-typed. Security/session/handler helpers are project-owned. The handler still checks resource access and commits DB/audit/outbox; the router boundary maps typed failures to the safe public error shape. Test through the real router request handler with a real DB, separately from rendered UI tests.
