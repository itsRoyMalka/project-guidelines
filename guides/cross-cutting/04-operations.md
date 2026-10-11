# Observability, reliability, and performance

**Applies to:** production deployables and critical journeys.

**OPS-01 MUST:** Use structured logs/traces with safe correlation and service/environment context. Ordinary metric dimensions remain bounded; request IDs belong in logs/traces or supported exemplars, not labels. Budget tenant dimensions explicitly. Redact secrets/personal data and log errors once where useful context is added. See [operations recipe](recipes/operations.md).

**OPS-02 MUST:** Separate startup, liveness and readiness. Liveness checks process health, not every downstream dependency; readiness reflects ability to serve the declared workload. Drain with a deadline, close resources and preserve/reschedule in-flight work under its lease/acknowledgement policy.

**OPS-03 MUST:** For each production critical journey, assign an owner and an explicit SLI/SLO decision appropriate to its impact. Define observation window, alert/runbook and error-budget action. Monitor user failures and durable-work delays; lightweight targets are acceptable when justified. See [operations](recipes/operations.md).

**OPS-04 MUST:** Bound timeouts, end-to-end deadlines, concurrency and payloads. Identify retry owner and retryable failures; use a limited attempt/time budget with backoff/jitter for safe operations. Classify unknown outcomes separately and provide explicit failure/degradation when dependencies are unavailable.

**OPS-05 MUST:** Measure performance before optimization. Check representative database plans, API latency, frontend loading and interaction, and worker throughput. Set budgets where a regression would harm the product; avoid speculative caching.

**OPS-06 SHOULD:** Make administrative/data repair actions auditable and reversible where possible. Keep durable security audit distinct from diagnostics. Incident runbooks identify response owner, escalation, evidence, safe mitigation, recovery proof and follow-up. Use [diagnose-incident](../../skills/diagnose-incident/SKILL.md).

**OPS-07 MUST:** For durable data, define recovery point and recovery time objectives, backup schedule/retention, and a restore procedure. Exercise a restore in an isolated environment and verify application-level integrity; the existence of a backup file is not recovery proof.

**OPS-08 SHOULD:** Define capacity limits and degradation behavior before load forces an emergency. Measure high-cardinality telemetry cost, queue lag, database saturation, and browser performance on representative journeys. A performance budget is meaningful only when measured in a reproducible environment.

**Verification:** a production request can be traced end to end without revealing sensitive data; alerts, recovery steps, and a restore are exercised. Further reading: [OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/), [Google SRE SLO guidance](https://sre.google/workbook/implementing-slos/), [NIST contingency planning](https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final).

**OPS-09 MUST:** Each deployable has a service record with owner, dependencies, release/recovery path, dashboards, runbook and escalation. Incidents record impact, facts/hypotheses, mitigation and user-flow recovery proof.

**OPS-10 MUST:** For Node services, initialize telemetry before instrumented imports. Use OpenTelemetry/OTLP to Collector for traces/metrics and Pino stdout through one log collector. Select provider exporters outside features; avoid duplicate shipping.

**OPS-11 MUST:** Instrument request/RPC/DB/queue boundaries and named actions. Use bounded dimensions, sampled routine diagnostics, safe correlation and redaction; never export raw bodies, SQL parameters, tokens or personal data. Measure rate/error/latency/saturation and oldest pending work.

```text
bootstrap → telemetry setup → app/features
traces/metrics → OTLP Collector → selected backends
Pino stdout → platform collector → log backend
```

### Example: safe boundary logging

```ts
// src/shared/telemetry/handler-logging.ts — factory boundary excerpt
logger.info({
  action: OrderAction.Cancel,
  outcome: OperationOutcome.Committed,
  requestId: context.requestId,
  durationMs,
}, 'Action completed');
```

Emit after confirmed completion at the selected boundary, not from every layer. The logger is app-bound with redaction; metric labels use bounded action/outcome values and exclude requestId. This diagnostic is not the durable audit record.

For database-specific restore, audit, drift and upgrade evidence see [DBO rules](../backend/shared/database/03-administration-and-recovery.md).
