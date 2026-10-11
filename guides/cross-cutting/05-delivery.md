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

**DEL-09 MUST:** Build immutable artifacts once after merge, deploy to shared dev, verify its stable manifest, then promote the same digest. Release FE/BE independently with human versions plus commit/digest; SemVer is strict for published package/public-contract compatibility, not proof for a deployment label.

**DEL-10 MUST:** Existing deployment configuration is the version manifest linking digests, config/migrations and rollout order; add a custom manifest only if the platform cannot expose it. Independent services retain versions and prove compatibility with production peers, including queued events and running workflows.

**DEL-11 MUST:** Provide an access-controlled rollback pipeline selecting a retained compatible release and incident/reason. Stop rollout, restore artifact/config and desired state, then verify running digests, readiness and critical smoke. Database reversal is a new migration and does not restore lost data.

**DEL-12 MUST:** Emergency hotfix starts from deployed source, applies a narrow fix and builds a new artifact. Keep focused build/type/behavior/contract/security checks and rapid review; explicitly own deferred broad checks. Canary or constrain rollout, verify, then reconcile into main.

**DEL-13 MUST:** Rollout uses named signals, thresholds, observation window and owner. Failed signals abort; missing/inconclusive evidence pauses. Keep an available recovery path compatible with schema, peers and persisted state.

See [infrastructure](09-infrastructure.md), [shared dev E2E](../e2e/02-environments.md) and [mobile release](../mobile/02-operations.md). Local, shared dev and production are the baseline; staging is added for a concrete risk.

```text
orders-api: 1.4.2 → sha256:artifact-a
web: 2.1.0 → sha256:artifact-b
release: REL-42 → both digests + config/migration revisions + rollout order
```

```yaml
# infra/stacks/aws/prod/orders-api.values.yaml — when EKS/Helm is selected
image:
  repository: registry.example/orders-api
  digest: sha256:<verified-immutable-digest>
```

The deployment source pins an existing verified artifact; promotion changes the environment's desired digest, not the build output. The platform's release record links that digest to config, migration state, source revision and the web digest. This is a platform configuration excerpt, not a second custom version manifest.

**DEL-14 MUST:** PRs check affected apps/packages and dependents; global tooling changes broaden scope. Main builds/deploys affected artifacts to dev; deployed smoke/E2E gates promotion. Required-check aggregation must reject missing/skipped jobs for the actual candidate.

**DEL-15 MUST:** Keep environment config outside promoted artifacts where supported. Browser settings are public; build-time environment values create separate artifacts that each need proof. Use environment-scoped short-lived deployment identity and keep production secrets out of untrusted PR jobs.
