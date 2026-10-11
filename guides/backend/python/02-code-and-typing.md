# Python code, typing and package conventions

**Scope:** Python application and test code. The [profile](01-backend.md) selects tools; this guide controls their use. **Why:** explicit data shapes and simple functions make behavior discoverable without building a class framework.

**PYC-01 MUST:** Use `snake_case` files/functions, `PascalCase` classes and uppercase enum members/constants. Name a module for its responsibility; avoid catch-all `utils`, `helpers`, `manager` and one-line forwarding methods unless they enforce a real boundary. `get`/`fetch` must not mutate state; time quantities include units.

```python
# features/orders/shared/expiration.py — Python, pure business calculation
from datetime import timedelta

def expires_at(created_at: datetime, hold_duration: timedelta) -> datetime:
    return created_at + hold_duration
# Do not name a raw integer `timeout`; use `timeout_seconds` or timedelta.
```

**PYC-02 MUST:** Model known data, not roaming `dict[str, Any]`: Pydantic for untrusted wire/config, frozen dataclass for an internal value, SQLAlchemy mapping for a persisted row, and `TypedDict` only for a real dict-shaped interface. Keep `None`, absence and empty collections semantically distinct; use `.get()` only when missing is an expected case.

```python
# features/orders/shared/values.py — Python internal value, no wire parsing
@dataclass(frozen=True, slots=True)
class OrderIdentity:
    public_id: UUID
    account_id: UUID

# Boundary: CancelOrderInput.model_validate(raw); handler receives the model.
```

**PYC-03 SHOULD:** Prefer free functions when no object lifetime/state is needed. Use classes for a genuine stateful adapter, invariant or framework integration; prefer composition over inheritance. Keep mutable state private and request-scoped, and return results instead of mutating caller-owned output parameters.

```python
# features/orders/shared/policy.py — Python; no static-only class

def require_cancel_access(actor: Actor, order: OrderRow) -> None:
    if actor.account_id != order.account_id:
        raise OrderNotFound()  # public boundary does not reveal another account's order
```

**PYC-04 MUST:** Configure Ruff lint/format and strict mypy in `pyproject.toml`; pin the interpreter/dependencies with uv and check the lock in CI. Start with a focused lint ruleset and add rules deliberately. Do not use `select = ['ALL']` followed by a large ignore list or global `ignore_missing_imports`; narrow unsupported dependency typing per module.

```toml
# apps/api/pyproject.toml — selected baseline; exact versions checked at adoption
[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM"]
[tool.mypy]
strict = true
mypy_path = "src"
```

**PYC-05 MUST:** Handle expected business outcomes as typed results or declared failures and map them at the transport boundary. Catch exceptions only when the current layer can recover or add useful context; a re-raised exception is logged at the final owner once. Use `assert` for development assertions only, not input validation, authorization or required production invariants, because optimized Python can remove assertions.

```python
# features/orders/cancel_order/handler.py — Python business boundary
if order.status is not OrderStatus.PENDING:
    raise OrderConflict()  # API mapper returns stable 409 code
# Do not `assert order.status == PENDING` for a required runtime check.
```

**Verification:** `uv sync --locked`, `ruff check`, `ruff format --check`, `mypy`, package import and targeted tests. **Exception:** legacy typing debt gets a scoped baseline and cleanup trigger; a code change must not expand the debt. Further reading: [Ruff](https://docs.astral.sh/ruff/linter/), [mypy strict](https://mypy.readthedocs.io/en/stable/existing_code.html), [Python assert semantics](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement).
