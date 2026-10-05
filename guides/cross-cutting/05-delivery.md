# Delivery and infrastructure

**Applies to:** each deployed application or service. The platform's existing approved deployment mechanism remains authoritative.

**DEL-01 MUST:** Every deployable has an owner, build artifact, environment configuration, deployment path, rollback/forward recovery procedure, and observable release version. Promote the same built artifact through environments when possible.

**DEL-02 MUST:** Declare the project's actual check commands and gates for changed units plus dependents: type/lint/build, relevant behavioral/contract tests and applicable secret/dependency/container security checks. Align with SEC-08. Mark unavailable or excepted gates explicitly; use [delivery and QA](recipes/delivery.md).

**DEL-03 MUST:** Keep infrastructure state, drift ownership and application assumptions synchronized: permissions, networks, queues, storage, limits, alarms and test equivalents. Prefer reviewed declarative/IaC controls; managed-platform controls with equivalent ownership/evidence are valid. Plan destructive-change recovery and protect state/credentials.

**DEL-04 MUST:** Sequence data and contract changes so old and new application versions can overlap safely. Use expand/contract migrations; prove rollback or forward recovery before production promotion.

**DEL-05 SHOULD:** Stage high-impact releases with flags/progressive rollout and observable stop criteria. Follow the target release policy and existing authorization for actions; irreversible production changes require the applicable authorized decision. A generic guide does not grant deployment permission.

**DEL-06 MUST:** Never let a green pipeline imply an unrun or blocked gate passed. Document disabled jobs, flaky checks, and production-only limitations with owner and remediation.

**DEL-07 SHOULD:** Produce build provenance tying a released artifact to source revision, build identity, inputs, and environment; verify the artifact before promotion. Choose an appropriate [SLSA build level](https://slsa.dev/spec/v1.2/build-track-basics) for product risk and available platform controls rather than claiming a level from a version string or CI badge.

**DEL-08 MUST:** Protect CI/deployment edits and production credentials. Use minimal CI permissions, immutable third-party action references or equivalent provider controls, isolated untrusted PR execution and approved short-lived deploy identities where available. Review dependencies/lockfiles and trace security fixes to releases.

**Verification:** CI matrix covers changed dependents, a release is traceable to source/artifact, build credentials are isolated, and rollback is rehearsed for a representative change. Further reading: [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final), [SLSA provenance](https://slsa.dev/spec/v1.2/provenance).
