# TypeScript fullstack profile

**Choose when:** one web product benefits from one server deployment.

- React Router server loaders/actions call server-only feature handlers directly; internal HTTP is unnecessary.
- Keep the same action/handler/DAL responsibilities and public DTOs as the backend guide.
- Use explicit `.server` boundaries; client imports and serialized route data must exclude credentials, ORM and provider code.
- Router owns route-data freshness. React Hook Form owns form drafts and submits through the selected route action/fetcher.
- Separate process resources from request identity; server caches and client stores cannot leak between requests.

```text
app/routes/orders.tsx                 # thin loader/action + view composition
app/features/orders/cancel/
  handler.server.ts
  dal.server.ts
  contract.ts
  ui/cancel-order.tsx
  cancel.test.tsx
```

**Check:** client/server build, deliberately rejected private import, authorized handler/data path, CSRF and mutation revalidation. **Alternative:** [split](typescript-split.md) for independent clients/deployments. [Historical fixture](verification.md) proved only its recorded version and narrow runtime seam.
