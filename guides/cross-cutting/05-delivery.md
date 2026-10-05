# Delivery and infrastructure

**Applies to:** each deployed application or service. The platform's existing approved deployment mechanism remains authoritative.

**DEL-01 MUST:** Every deployable has an owner, build artifact, environment configuration, deployment path, rollback/forward recovery procedure, and observable release version. Promote the same built artifact through environments when possible.

**DEL-02 MUST:** CI checks the affected workspace units and their dependents. Typecheck, lint, tests, contract checks, dependency/security scans, and build must be repeatable. A path-based optimization must not skip shared-package consumers.

**DEL-03 MUST:** Keep infrastructure as code and application assumptions synchronized: permissions, queues, databases, resource limits, network rules, alarms, and local/test equivalents. Use least privilege and review destructive changes.

**DEL-04 MUST:** Sequence data and contract changes so old and new application versions can overlap safely. Use expand/contract migrations; prove rollback or forward recovery before production promotion.

**DEL-05 SHOULD:** Use progressive rollout or feature flags for high-impact behavior, observe health and business signals, then increase exposure. Keep human approval for irreversible production changes and a clear audit trail.

**DEL-06 MUST:** Never let a green pipeline imply an unrun or blocked gate passed. Document disabled jobs, flaky checks, and production-only limitations with owner and remediation.

**DEL-07 SHOULD:** Produce build provenance tying a released artifact to source revision, build identity, inputs, and environment; verify the artifact before promotion. Choose an appropriate [SLSA build level](https://slsa.dev/spec/v1.2/build-track-basics) for product risk and available platform controls rather than claiming a level from a version string or CI badge.

**DEL-08 MUST:** Protect the release path: restrict who can modify CI and deployment configuration, separate production credentials from pull-request jobs, and review dependency/lockfile changes. Record how a security finding is triaged, fixed, and traced to a release.

**Verification:** CI matrix covers changed dependents, a release is traceable to source/artifact, build credentials are isolated, and rollback is rehearsed for a representative change. Further reading: [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final), [SLSA provenance](https://slsa.dev/spec/v1.2/provenance).
