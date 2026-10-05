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

**PY-01 MUST:** Keep HTTP routers thin: parse boundary models, derive trusted identity, authorize, call a named operation and map errors. Pydantic field validation is appropriate; business workflows and persistence-dependent decisions belong in operations/domain code. Preserve existing coherent layouts.

**PY-02 MUST:** Type public/domain interfaces and check affected packages and dependents with the selected checker. Mypy is the default profile; pyright is valid when established. Track inherited errors; avoid hidden mutable globals and ambiguous parameter modes. Pin a supported interpreter/dependency set.

**PY-03 MUST:** The owning operation controls transaction and session lifetime, including rollback and close. Use Session per thread or AsyncSession per concurrent task; never share one mutable session across concurrent tasks. Avoid blocking I/O in async handlers. Follow the [Python lifecycle](recipes/lifecycle.md) and review migration/backfill/lock behavior.

**PY-04 SHOULD:** Test domain rules with unit tests and the service's own API/database boundary with integration tests. Mock external providers, not the application's core behavior. Mark live-environment tests separately and report disabled CI coverage honestly.

**PY-05 MUST:** Workers follow the canonical [event rules](../backend/04-events-and-workflows.md) for retries, deduplication and recovery; tenant controls apply to scoped workloads. Define sync/async resource lifecycle. Shared capabilities use explicit package contracts, without importing another deployable's implementation.

**Verification:** Ruff/mypy/pytest, real boundary tests, migration review, and a service-local agent entrypoint.
