# Python backend profile

**Scope:** new Python HTTP services and workers. Start with [shared backend rules](../shared/01-actions-and-boundaries.md); [architecture](../../01-architecture.md), [security](../../cross-cutting/01-security.md) and [delivery](../../cross-cutting/05-delivery.md) still apply. This profile selects an implementation, not a claim that every Python project must use the same stack.

## Selected starting stack

| Concern | Default | Change when |
| --- | --- | --- |
| Runtime/package | Supported Python, `pyproject.toml`, uv, committed `uv.lock` | Existing supported lock policy or platform constraint |
| HTTP/contracts/config | FastAPI, Pydantic v2, pydantic-settings | No HTTP service or an existing proven framework |
| Relational data | PostgreSQL, SQLAlchemy 2 typed mapping, psycopg, Alembic | Workload/data owner requires another DB; document dialect changes |
| Quality/tests | Ruff check/format, strict mypy, pytest, HTTPX + `asgi-lifespan` for async API tests | Pyright or existing equivalent checker is already established |
| Outbound HTTP | httpx through provider adapters | Selected provider SDK with equivalent deadline/validation policy |
| Signals | standard logging + OpenTelemetry-compatible traces/metrics | Platform instrumentation proves the same signals |

**PY-01 MUST:** Organize by feature then action. The API owns HTTP, Pydantic owns wire shape, the handler owns business policy, and the DAL owns SQL. Feature `shared/` contains only code reused by that feature; app-level `shared/` is for actual cross-feature capabilities. Cross-feature calls use public operations, not private DALs.

```text
apps/api/
  pyproject.toml                    # runtime/dependencies/tool config
  uv.lock                           # resolved application dependencies
  src/orders/
    app/{main,config,db,handlers}.py # composition and lifecycle
    features/orders/
      api.py                        # feature route list
      shared/{constants,dal,errors,models}.py
      cancel_order/{api,contract,handler,test_cancel_order}.py
    integrations/payments/{port,stripe_adapter}.py
  db/migrations/                    # one Alembic history per owned DB
  tests/lib/{api,users,orders}.py    # shared fixture/business helpers
```

`{...}.py` abbreviates separate files. Keep only files the action needs; exclude co-located `test_*.py` from the released wheel and verify the built artifact contains no test-only code. For a Hatchling build, for example:

```toml
# apps/api/pyproject.toml — Python package build excerpt
[tool.hatch.build.targets.wheel]
packages = ["src/orders"]
exclude = ["**/test_*.py", "**/conftest.py"]
```


**PY-02 MUST:** Type every owned function boundary and use one strict checker in CI. New code has no blanket `Any`, `type: ignore`, missing-import suppression or whole-file Ruff disable; an unavoidable narrow suppression names the reason. Use immutable values where helpful and pass dependencies explicitly; no mutable session/config singleton.

```python
# features/orders/shared/constants.py — Python; wire literals declared once
from enum import StrEnum

class OrderStatus(StrEnum):
    PENDING = 'pending'
    CANCELLED = 'cancelled'

class OrderAction(StrEnum):
    CANCEL = 'orders:cancel'

class OrderEvent(StrEnum):
    CANCELLED = 'orders.cancelled'

class AuditAction(StrEnum):
    ORDER_CANCELLED = 'orders.cancelled'
```

**PY-03 MUST:** Select synchronous or asynchronous I/O deliberately. A synchronous driver/client stays in a synchronous operation; an `async def` route uses async drivers through the call path. One mutable `Session` belongs to one thread, or one `AsyncSession` to one concurrent task. The app lifespan owns pools/clients and shutdown; see [lifecycle](recipes/lifecycle.md) and [session/pool configuration](12-database-sessions.md).

```python
# app/db.py — Python async profile; one factory at app startup
def create_db(settings: Settings) -> tuple[AsyncEngine, async_sessionmaker[AsyncSession]]:
    engine = create_async_engine(settings.database_url.get_secret_value())
    return engine, async_sessionmaker(engine, expire_on_commit=False)
# app/main.py calls create_db during lifespan; each action gets its own session.
```

**PY-04 MUST:** Run action integration tests through the real ASGI app and selected DB engine; mock only external provider boundaries. Add pure algorithm or targeted query tests where the action test cannot clearly cover a risk. Use the [Python test guide](06-testing.md).

```text
cancel_order/test_cancel_order.py: setup → HTTP request → response/state/outbox proof
payment adapter contract test: provider request/response translation and timeout
```

**PY-05 MUST:** Events, consumers, jobs and RPC keep the [shared side-effect guarantees](../shared/03-effects-and-operations.md). Workers call public feature actions and own retry/lease/deadline semantics; no global session or DB work hidden in import time.

```text
OrderCancelled consumer → verify/dedupe event → cancel_followup action
Temporal/SQS adapter → worker envelope → registered job handler
```

**PY-06 MUST:** Preserve [shared time meanings](../shared/02-data-and-time.md): aware UTC `datetime` for instants, `date` for calendar-only values, IANA `ZoneInfo` for local decisions and an injected clock. See [Python time](09-time-and-dates.md).

```python
# features/orders/checkout/handler.py — injected clock, Python
now = clock.now()                 # aware UTC instant
local_date = now.astimezone(ZoneInfo(store.time_zone)).date()
```

**Verification:** locked install, Ruff, mypy, pytest on real DB, migration review and built-package inspection. **Exception:** an existing supported service may keep a proven tool/runtime choice while meeting the same boundaries; record it in its architecture brief. Further reading: [FastAPI structure](https://fastapi.tiangolo.com/tutorial/bigger-applications/), [SQLAlchemy sessions](https://docs.sqlalchemy.org/en/20/orm/session_basics.html), [uv projects](https://docs.astral.sh/uv/guides/projects/).
