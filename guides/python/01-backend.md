# Python backend profile

**Applies to:** Python services. The [architecture](../01-architecture.md), [API](../backend/02-api-contracts.md), [data](../backend/03-data-and-migrations.md), [security](../cross-cutting/01-security.md), and [testing](../cross-cutting/03-testing.md) principles still apply; this profile supplies Python expression and tooling.

## Default profile

Use a supported Python release, FastAPI for HTTP, Pydantic for boundary/config models, SQLAlchemy for persistence where relational data is required, Alembic for migrations, pytest for tests, and Ruff plus mypy for lint/type checking. Pin dependencies with the project's approved package manager. Choose Celery/queue workers only for an actual asynchronous workload.

```text
services/<service>/
  src/<package>/
    app/                # composition, settings, routers
    features/<domain>/  # operations, domain, persistence, schemas
  tests/
  migrations/           # only when this service owns a database
```

**PY-01 MUST:** Keep HTTP routers thin. Validate inputs with Pydantic, authorize the action/resource, call a named domain operation, and map stable errors at the edge. Do not place business rules in schemas or database models.

**PY-02 MUST:** Type public functions and domain interfaces; use mypy on changed code. Prefer explicit values over mutable globals, hidden module state, or broad optional parameters that create ambiguous behavior.

**PY-03 MUST:** The owning operation controls transactions. Shared libraries do not call `session.commit()`. Migrations are reviewed for backfill, lock, and compatibility behavior.

**PY-04 SHOULD:** Test domain rules with unit tests and the service's own API/database boundary with integration tests. Mock external providers, not the application's core behavior. Mark live-environment tests separately and report disabled CI coverage honestly.

**PY-05 MUST:** Give every worker an idempotency, retry, dead-letter, tenant-scope, and observability story. Keep shared code behind published package contracts rather than importing another service's implementation tree.

**Verification:** Ruff/mypy/pytest, real boundary tests, migration review, and a service-local agent entrypoint.
