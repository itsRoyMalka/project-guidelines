# Local development and verification

Applies to [configuration](../02-configuration.md) and [testing](../03-testing.md).

## Make the target project reproducible

Document its supported runtime, package manager and lockfile, required service versions, safe example environment, bootstrap/reset steps and actual commands. Validate config at startup; never copy production credentials or personal data into fixtures. List which dependencies are real, emulated, mocked or unavailable and what that leaves unproved. Bind local services privately by default.

A consuming project's command map names install, dev, format/lint, typecheck, unit, integration, contract generation/check, build and selected E2E commands. Discover these from its files; do not invent `npm test` when it does not exist. A command exit is meaningful only with its scope, environment and observed assertions.

## Choose proof from risk

| Change risk | Focused proof |
| --- | --- |
| Domain transition | Pure operation cases including forbidden transition |
| Tenant write | Real persistence integration, other-tenant identifier, stale version, no unauthorized effect |
| New HTTP field | Parse/serialize round trip plus generated consumer; invalid input and forbidden output |
| Migration | Production-like engine/version, old/new binaries during writes, backfill restart and reconciliation |
| Async effect | Crash/retry/duplicate/unknown-provider-outcome injection |
| UI journey | Critical browser interaction, keyboard and failure recovery |
| Capacity change | Repeatable representative load with latency/error/resource budgets |

Keep mocks at genuinely external boundaries; mock-only database tests cannot prove isolation or SQL constraints. Isolate integration runs by database/schema or unique namespace, including parallel workers. Clean in `finally`/fixture teardown, even on assertion failure. Use deterministic clocks/IDs when behavior depends on them; retain a real-time integration check where deadlines matter. Avoid sleeps when readiness/events can be awaited with a deadline.

## Flakes and evidence

A retry pass does not erase the first failure. Preserve the failing attempt, classify environment versus product cause, assign owner and repair deadline. A quarantined check needs a tracked reason, expiry and compensating coverage; it must not silently make a required release condition green.

Report: command, revision, environment, assertions/coverage, result, skipped/unavailable checks and residual risk. Coverage percentages are diagnostic signals, not a universal acceptance threshold. Record performance sample size/workload, accessibility manual scope and threat-based security cases separately.
