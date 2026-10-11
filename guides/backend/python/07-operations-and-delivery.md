# Python configuration, observability and delivery

**Scope:** Python service startup, runtime signals and release proof. Shared [operations](../shared/03-effects-and-operations.md) and [delivery](../../cross-cutting/05-delivery.md) own cross-language behavior.

**PYOPS-01 MUST:** Parse configuration once at startup with pydantic-settings; separate required config, non-secret defaults and secret references. Do not branch business behavior on stage/region names. Resolve credentials through the selected secret provider and never print raw settings. Lifespan creates pools/clients, registers routes/workers and closes resources with a deadline.

```python
# app/config.py — Python; settings validated before readiness
class Settings(BaseSettings):
    database_url: SecretStr
    payment_timeout_seconds: PositiveFloat = 5.0
    model_config = SettingsConfigDict(env_prefix='ORDERS_', extra='forbid')
# app/main.py lifespan loads Settings(), then creates engine/providers once.
```

**PYOPS-02 MUST:** Use structured safe logs with trace/request/action IDs and bounded reason codes. Log unexpected exceptions once where handled; re-raised errors retain cause/context without duplicate traceback. Logs, traces, metrics and product analytics have distinct purposes. Do not assume every error log should page; alert on actionable service signals.

```python
# app/errors.py — Python stdlib logging; safe fields only
logger.warning('order cancellation rejected', extra={'reason_code': 'invalid_state'})
# Unexpected failure: boundary logger.exception('action failed', extra={'action': OrderAction.CANCEL})
```

**PYOPS-03 MUST:** Instrument HTTP, DB, provider and worker boundaries with OpenTelemetry-compatible traces/metrics. Bound label cardinality; no account ID, order ID, URL path parameter or PII as metric label. Measure p95/p99 latency, error rate, pool pressure and queue age before tuning.

```text
metric: order_action_duration_seconds{action='cancel',outcome='conflict'}
trace: request → handler → DB span → outbox; provider call is a later span
```

**PYOPS-04 MUST:** Pin runtime and dependencies, commit `uv.lock`, and use locked resolution in CI. CI runs Ruff check/format, mypy, pytest on target DB, Alembic migration review/probe, package build/import and vulnerability review before promoting the immutable artifact. Recheck FastAPI/Pydantic/SQLAlchemy/driver compatibility on major upgrades.

```text
uv sync --locked
uv run ruff check . && uv run ruff format --check .
uv run mypy src && uv run pytest
uv build  # inspect wheel; action tests must not be shipped
```

**PYOPS-05 MUST:** Run an ASGI server with explicit worker/process, timeout, connection and shutdown budgets. Readiness follows successful required-resource initialization; graceful shutdown stops intake, drains work and closes pools. Do not use in-process FastAPI background tasks for durable work whose loss matters.

```text
SIGTERM → stop HTTP intake → drain in-flight request deadline
→ stop relay/consumers → close provider clients and DB pool → exit
```

**Verification:** boot with missing/invalid config, inspect redacted logs, correlate one trace, run CI from lockfile, install the built artifact and test shutdown mid-work. **Exception:** established deployment tooling may substitute equivalent lock/build/runtime controls. Sources: [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/), [FastAPI lifespan](https://fastapi.tiangolo.com/advanced/events/), [OpenTelemetry Python](https://opentelemetry.io/docs/languages/python/), [uv sync](https://docs.astral.sh/uv/concepts/projects/sync/).
