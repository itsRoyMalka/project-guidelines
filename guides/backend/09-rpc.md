# Service RPC

**Scope:** separate backend services needing an immediate answer. **Why:** retain feature ownership across a network boundary.

**RPC-01 MUST:** Split services by owned business capability, not table or endpoint. Keep rules requiring one atomic commit together. In-process features call public handlers directly.

**RPC-02 MUST:** The provider feature owns its Protobuf contract in `api/`. Generate types with Buf; run lint and breaking checks. `defineRpc` binds the generated method, explicit service policy and handler without redeclaring the wire shape.

**RPC-03 MUST:** Feature `api/rpc.ts` collects methods; service `rpc/routes.ts` registers features. Caller `clients/<capability>/client.ts` wraps the generated Connect client behind an app capability.

**RPC-04 MUST:** Authenticate service identity and delegated actor scope; set deadlines, trace propagation and method-specific retry/idempotency rules. Test compatibility with currently deployed peers.

```text
features/orders/api/orders.proto
features/orders/api/rpc.ts
features/orders/get-order/{api,handler}.ts
rpc/routes.ts
# consuming service:
clients/orders/client.ts
```

**Check:** authenticated call, expired deadline, duplicate mutation and old/new contract pair. **Vary when:** an existing supported HTTP/RPC protocol has equivalent contracts and controls. Source: [Buf breaking checks](https://buf.build/docs/breaking/).

### Example: owned wire contract

```proto
// features/orders/api/orders.proto
syntax = "proto3";
package orders;
service OrdersService {
  rpc GetOrder(GetOrderRequest) returns (GetOrderResponse);
}
message GetOrderRequest { string order_id = 1; }
message GetOrderResponse { string order_id = 1; }
```

Generate the descriptor/client with the selected Buf toolchain. The feature's `api/rpc.ts` binds `GetOrder` to the authorized get-order handler; the caller wrapper supplies service identity, delegated scope and deadline. The deliberately small response omits private data; protobuf field numbers are wire declarations and must not be repurposed.

```ts
// features/orders/api/rpc.ts — project-owned binding API; descriptor is generated
export const getOrderRpc = defineRpc({
  method: ordersService.methods.getOrder,
  policy: { access: { type: Access.Rbac, action: OrderAction.Read } },
  handler: getOrder,
});
```

The adapter authenticates the caller and maps the generated request to the handler's input; the handler still checks resource access. The consuming `clients/orders/client.ts` wraps its generated client with service identity, delegated actor scope, a deadline and method-specific retry policy. `ordersService` naming depends on the selected generated output; do not hand-copy protobuf types or call another service's private DAL.
