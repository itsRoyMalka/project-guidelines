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
