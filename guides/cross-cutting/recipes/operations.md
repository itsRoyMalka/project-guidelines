# Operating, debugging and recovering a service

Applies to [OPS rules](../04-operations.md).

## Signals and budgets

Structured logs carry request/trace correlation, operation, result and safe diagnostic context. Redact secrets and personal data before export; set retention, access and sampling. Metrics use bounded labels such as route template, method and status class. User, request, order and unbounded tenant IDs belong in appropriately controlled logs/traces, not metric labels.

For each critical journey define: successful/eligible event, measurement source, exclusions, target, rolling window, owner and action. Example decision: 99.9% of eligible cancellation requests succeed within 1 second over 30 days; classify expected policy rejection separately and do not exclude dependency outages to hide failures. This is an illustrative product target, not a mandated number. Alert on actionable symptom/budget burn and route to an owner with a runbook; diagnostic saturation signals explain causes.

Capacity plans include per-process and aggregate DB pools, bounded worker concurrency, queue arrival/service rates, provider quotas, memory and browser payload/interaction budgets. Measure representative p95/p99, errors and resource use; a low-traffic average does not prove peak capacity. Deadlines propagate inward; retries have jitter, caps, a total budget and one owner. Retrying a non-idempotent side effect requires the [outcome protocol](../../backend/recipes/idempotency.md).

## Process lifecycle

Startup validates configuration and initializes pools. Startup probes allow bounded initialization; liveness detects a stuck process without turning every dependency outage into restart loops. Readiness says whether this instance can serve its intended traffic. On termination mark unready, stop accepting/claiming new work, drain in-flight work within a deployment-compatible deadline, release/expire leases safely and close resources. A killed worker leaves replayable durable work, not an assumed completed side effect.

## Incident workflow

1. Establish impact/time range, affected users/tenants, current release and last known good behavior. Name an incident owner and communication owner for significant incidents.
2. Preserve bounded evidence (request/trace examples, error/budget changes, rollout/config timeline); protect sensitive data. Distinguish facts from hypotheses.
3. Mitigate with the least risky reversible action: halt rollout, disable a documented feature, reduce load or roll back **only if schema/data remain compatible**. Record action, actor, time and result. Do not blindly replay payments/emails.
4. Test one hypothesis at a time against signals; use scoped, audited diagnostics. Escalate ownership gaps instead of destructive experimentation.
5. Verify user-visible recovery over an explicit observation window, reconcile queued/unknown work and data integrity, then resolve. A healthy process is insufficient.
6. Record contributing causes, timeline, detection/mitigation gaps and owned follow-ups. Avoid blame and unsupported certainty.

## Recovery drills

Set RPO (acceptable data loss) and RTO (recovery time) from product needs. Restore into isolation with required keys/config/dependencies; check integrity, tenant permissions, recent writes and representative journeys. Reapply deletion/restriction records before serving restored personal data. Measure achieved RPO/RTO and record gaps. Test backup access loss and key availability; backup completion alone is not restore proof.
