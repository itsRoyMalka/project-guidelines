# Observability, reliability, and performance

**Applies to:** production deployables and critical journeys.

**OPS-01 MUST:** Emit structured logs, traces, and metrics with service/environment, request/correlation ID, and safe tenant context. Redact secrets and personal data. Log an error once at the boundary that can add useful context; preserve its cause.

**OPS-02 MUST:** Define health/readiness separately. Readiness reflects dependencies needed to serve the declared workload; graceful shutdown stops accepting work and finishes or safely reschedules in-flight operations.

**OPS-03 SHOULD:** Define service-level objectives for critical journeys, with a small set of actionable alerts and runbooks. Alert on user impact, queue backlog/dead letters, and failed durable work, not every noisy internal exception.

**OPS-04 MUST:** Bound timeouts, concurrency, retries, and payload/page sizes at external boundaries. Retry only safe operations with backoff and jitter; provide a fallback or explicit failure when a dependency is unavailable.

**OPS-05 MUST:** Measure performance before optimization. Check representative database plans, API latency, frontend loading and interaction, and worker throughput. Set budgets where a regression would harm the product; avoid speculative caching.

**OPS-06 SHOULD:** Make important administrative and data-repair actions auditable and reversible where possible. A runbook names owner, detection signal, safe mitigation, and recovery proof.

**Verification:** a production request can be traced end to end without revealing sensitive data; alerts and recovery steps are exercised. Further reading: [OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/).
