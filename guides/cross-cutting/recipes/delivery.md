# Delivery and infrastructure decisions

Applies to [DEL rules](../05-delivery.md).

## CI graph and completion

Resolve the consuming project's actual commands using [local/test guidance](local-and-test.md). Run cheap independent formatting/lint/type checks in parallel where safe. Integration/contract checks precede packaging as appropriate; deployment consumes the verified immutable artifact. Impact selection follows transitive dependencies, generated contracts and shared config; uncertain impact broadens checks. Cache keys include lockfile, runtime/tool version, platform and relevant inputs; a cache hit never substitutes for required verification.

Required applicable gates include tests, build, secret detection, dependency/security policy and contract compatibility. Publish meaningful results even on failure. Protected release gates cannot be bypassed by making a job optional or relying on an unrelated green check. An exception has an owner, risk, compensating control and expiry under GOV-05.

## Trust and artifacts

Treat contributions, PR titles and build output as untrusted input. Run untrusted PR builds without production secrets or privileged deployment tokens; do not later execute their artifacts in a privileged job without an established trust process. Use least-privilege short-lived credentials and review dependency/lockfile changes. Pin third-party CI actions to immutable identities where supported and maintain an update process. Record artifact digest, source revision and provenance; promote that artifact rather than rebuilding per environment. Do not claim a SLSA level without assessing its requirements.

## Rollout and recovery

Release records identify owner, artifact, compatible schema/API window, changes, verification, observation signals and abort/recovery thresholds. Expand storage/API support before producers depend on it; old/new instances overlap. Canary or staged exposure suits high-risk changes; simpler atomic rollout is acceptable with proven compatibility and recovery. Flag changes also require audit, rollout proof and ownership. Define deprecation owner, consumer inventory, support deadline and evidence of migration before removal.

## Infrastructure

Keep reviewed declarative changes, owned remote state with locking/access/backup, drift detection and a documented break-glass path. Review destructive plans, quotas, network/identity boundaries, encryption and cost effects. Separate environments and restrict production writes. Reconcile emergency changes into the source of truth. Recovery includes state restoration and service dependencies, not merely recreating compute. Provider-specific implementation belongs in a selected overlay, with actual commands and permissions verified in that project.

## Supply-chain response

Assign vulnerability ownership and triage by exploitability, exposure and business impact. Record urgency, remediation or expiring acceptance, affected lockfiles/images and validation. Dependency updates include transitive change review and behavioral compatibility checks. Security scans are signals with triage; absence of findings is not proof of absence of vulnerabilities.

### Example: serialize an environment's deployments

```yaml
# .github/workflows/deploy-dev.yml — GitHub Actions workflow excerpt
concurrency:
  group: deploy-dev
  cancel-in-progress: false
```

Use the same protected environment concurrency group for every deployment path that can mutate it. The rest of the pipeline verifies the candidate digest, applies controlled migrations, deploys and captures the running manifest. This setting alone does not lock manual deployments or E2E's deployment lease; those entrypoints must share the platform's actual coordination mechanism.


### Example: service release sequence

```text
docs/delivery.md — example selected pipeline
PR: shared checks + affected service/dependent tests
Merge: build candidate once; retain digest and provenance
Dev: deploy candidate; verify manifest; run pinned integration/E2E suite
Prod: verify gates; compatible migration; controlled rollout; health/smoke
Failure: halt promotion; restore compatible artifact/config; verify recovery
```

Follow DEL-16/17 for parent/child completion and manual entrypoints. Shared platform templates are versioned inputs. An enabled Argo Rollouts flag alone is not rollout proof: inspect the rendered strategy, traffic mechanism, analysis thresholds and stop/recovery behavior under [INFRA rules](../09-infrastructure.md).
