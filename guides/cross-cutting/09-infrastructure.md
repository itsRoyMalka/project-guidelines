# Infrastructure and rollout

**Scope:** app-owned cloud resources. **Why:** review desired state and preserve provider semantics.

**INFRA-01 MUST:** Use declarative infrastructure; OpenTofu is the default, established Terraform/equivalent is valid. Root stacks own providers, environment composition, protected remote locking state and lockfiles. Review plans and apply through CI; reconcile emergency changes and detect drift.

**INFRA-02 MUST:** Group provider implementations by useful capability. Keep modules shallow, no one-resource wrappers or universal cloud-switch module. Document provider-neutral app requirements; implement additional providers only when needed and test equivalence.

**INFRA-03 MUST:** Declare rollout strategy per deployable: rolling for compatible routine changes, canary for measurable risk, blue/green for validated cutover with parallel capacity. State readiness, capacity, stages, observation, failure/inconclusive handling and recovery.

**INFRA-04 MUST:** Kubernetes rolling uses probes, surge/unavailable capacity and progress deadline. Progressive rollout needs a supported controller/router; replica ratios do not prove exact traffic weights. ECS strategy must be supported by the chosen controller with listeners/target groups, health, alarms and rollback in IaC.

**INFRA-05 MUST:** Worker releases use queue/lease and workflow-version controls, not HTTP traffic percentages. Drain bounded work, preserve checkpoints and retain compatible handlers for in-flight payloads.

```text
infra/
  requirements.md
  modules/aws/{service,postgres}/
  stacks/aws/{dev,prod}/
  observability/
```

**Check:** isolated state/locking, drift, readiness failure, failed/missing metric, actual traffic allocation and rollback desired state. **Vary when:** low traffic may need synthetic blue/green checks or controlled rolling; an equivalent managed declarative platform is valid. Sources: [OpenTofu modules](https://opentofu.org/docs/language/modules/develop/), [Kubernetes deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [ECS strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_service-options.html).

### Example: provider-specific root

```hcl
# infra/stacks/aws/dev/main.tf — existing service module contract
module "orders_api" {
  source       = "../../../modules/aws/service"
  image_digest = var.orders_api_image_digest
}
```

`image_digest` names a verified immutable artifact, not a mutable tag. Provider/auth, protected remote state and required module inputs belong to this root's other files. This is a call-site excerpt; the module must implement and prove the selected rollout/health/rollback behavior before use.
