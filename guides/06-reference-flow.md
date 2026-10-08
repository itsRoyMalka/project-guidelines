# One feature across the system

**Read when:** connecting the guides. Factory/helper APIs below are illustrative project-owned interfaces; adapt and prove them in the target project.

```text
packages/contracts/orders/endpoints.const.ts
packages/test-ids/orders.ts
apps/api/src/features/orders/
  db/orders.prisma
  shared/dal.shared.ts
  cancel-order/{api,handler}.ts
  cancel-order/cancel-order.test.ts
  api.ts
apps/web/src/features/orders/cancel/
  api/{cancel-order,use-cancel-order}.ts
  ui/cancel-dialog.tsx
  cancel.test.tsx
apps/e2e/web/orders/create-and-cancel.test.ts
```

```ts
// Shared source declarations; literals belong here.
export const OrderAction = { Cancel: 'orders:cancel' } as const;
export const OrderStatus = { Pending: 'pending', Cancelled: 'cancelled' } as const;
export const orderEndpoints = {
  cancel: {
    method: 'POST', path: '/orders/:orderId/cancel',
    params: z.object({ orderId: z.string().uuid() }),
    response: z.object({ id: z.string(), status: z.literal(OrderStatus.Cancelled) }),
  },
} as const;
```

```ts
// API binds shared contract to backend policy and handler.
export const cancelEndpoint = defineEndpoint({
  contract: orderEndpoints.cancel,
  policy: { access: { type: Access.Rbac, action: OrderAction.Cancel } },
  handler: cancelOrder,
});
```

```ts
// Plain FE operation stays callable outside React.
export const cancel = (api: ApiClient, orderId: string) =>
  api.call(orderEndpoints.cancel, { params: { orderId } });

export function useCancelOrder() {
  const api = useApi();
  const queryClient = useQueryClient();
  const scope = useScopeKey();
  return useMutation({
    mutationFn: (orderId: string) => cancel(api, orderId),
    onSuccess: order => queryClient.invalidateQueries({
      queryKey: orderKeys.detail(scope, order.id),
    }),
  });
}
```

The UI uses DS components, translations, shared test IDs and backend capabilities. The handler owns resource access, conditional state change and durable event intent. BE tests assert response/state/event; FE tests assert interaction; E2E creates and cancels through UI. See [BE slice](backend/01-service-design.md), [BE test](backend/07-testing.md), [FE architecture](frontend/01-architecture.md) and [E2E](e2e/01-journeys.md).
