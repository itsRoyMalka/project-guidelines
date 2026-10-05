# Delivery and infrastructure

**Applies to:** each deployed application or service. The platform's existing approved deployment mechanism remains authoritative.

**DEL-01 MUST:** Every deployable has an owner, build artifact, environment configuration, deployment path, rollback/forward recovery procedure, and observable release version. Promote the same built artifact through environments when possible.

**DEL-02 MUST:** CI checks the affected workspace units and their dependents. Typecheck, lint, tests, contract checks, dependency/security scans, and build must be repeatable. A path-based optimization must not skip shared-package consumers.

**DEL-03 MUST:** Keep infrastructure as code and application assumptions synchronized: permissions, queues, databases, resource limits, network rules, alarms, and local/test equivalents. Use least privilege and review destructive changes.

**DEL-04 MUST:** Sequence data and contract changes so old and new application versions can overlap safely. Use expand/contract migrations; prove rollback or forward recovery before production promotion.

**DEL-05 SHOULD:** Use progressive rollout or feature flags for high-impact behavior, observe health and business signals, then increase exposure. Keep human approval for irreversible production changes and a clear audit trail.

**DEL-06 MUST:** Never let a green pipeline imply an unrun or blocked gate passed. Document disabled jobs, flaky checks, and production-only limitations with owner and remediation.

**Verification:** CI matrix covers changed dependents, a release is traceable to source/artifact, and rollback is rehearsed for a representative change.
