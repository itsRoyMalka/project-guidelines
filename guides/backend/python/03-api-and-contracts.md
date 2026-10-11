# FastAPI routes and Pydantic contracts

**Scope:** Python HTTP services. Shared [boundary rules](../shared/01-actions-and-boundaries.md) own trust and action flow. **Why:** generated OpenAPI and typed input/output make the public contract reviewable.

**PYAPI-01 MUST:** Put `APIRouter` in the action's `api.py`, collect routes in the feature's `api.py`, and register the feature router in app composition. Routes validate wire input, obtain server-derived identity, invoke a named action and return a declared response model. Keep business decisions out of route and Pydantic validators.

```python
# features/orders/cancel_order/api.py — Python FastAPI action route
router = APIRouter()

@router.post(OrderRoute.CANCEL, response_model=CancelOrderOutput)
async def cancel_order_api(
    order_id: UUID,
    actor: Annotated[Actor, Depends(get_actor)],
    actions: Annotated[OrderActions, Depends(get_order_actions)],
) -> CancelOrderOutput:
    return await actions.cancel_order(CancelOrderInput(order_id=order_id), actor)
# features/orders/api.py includes this router; app/main.py includes orders.api.router.
```

**PYAPI-02 MUST:** Use Pydantic v2 request/response models with explicit field meanings and `extra='forbid'` for owned JSON objects. Validate types/ranges and cross-field shape at the boundary; strictness is chosen by source (JSON versus path/query/env) so useful parsing is intentional. Never accept actor, grants or tenant identity from client fields. Response models filter what leaves the service.

```python
# features/orders/cancel_order/contract.py — Python wire models
class CancelOrderInput(BaseModel):
    model_config = ConfigDict(extra='forbid')
    order_id: UUID

class CancelOrderOutput(BaseModel):
    id: UUID
    status: OrderStatus
```

**PYAPI-03 MUST:** Derive authentication in a dependency; enforce action and resource authorization before changing data. Declare public/required/RBAC policy alongside the route using a small project-owned dependency or metadata only when it enforces repeated behavior. Map typed domain errors once to stable HTTP codes and redact unexpected failures. OpenAPI must reflect auth, responses and real wire models.

```python
# features/orders/cancel_order/api.py — Python auth policy excerpt
actor: Annotated[Actor, Depends(require_actor)]  # required session; no client-supplied grants
# Handler: require_action(actor, OrderAction.CANCEL, order)
# App mapper: OrderConflict -> 409 {"code": "order_conflict"}; unexpected -> safe 500.
```

**PYAPI-04 SHOULD:** Use an explicit route constant and reusable feature contract when multiple callers share it. Publish OpenAPI or generated client artifacts from the server source; do not hand-maintain a second FE schema. Compatibility changes are versioned and tested against supported consumers.

```python
# features/orders/shared/constants.py — Python declaration source
class OrderRoute:
    CANCEL: Final = '/orders/{order_id}/cancel'
# Contract generation consumes app.openapi(); FE client types are generated, not recopied.
```

**Verification:** exercise missing/extra fields, wrong type, wrong actor/resource, response filtering, OpenAPI generation and an old supported client contract. **Exception:** a framework's required route declaration is fine; avoid custom `define_endpoint` scaffolding if native FastAPI already enforces the needed policy. Sources: [FastAPI APIRouter](https://fastapi.tiangolo.com/tutorial/bigger-applications/), [response models](https://fastapi.tiangolo.com/tutorial/response-model/), [Pydantic strict mode](https://docs.pydantic.dev/latest/concepts/strict_mode/).
