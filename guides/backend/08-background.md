# Jobs and workflows

**Scope:** durable background work. **Why:** jobs own business behavior; workers execute registered jobs; adapters own orchestration. These `define*` APIs are illustrative project conventions, not a shipped framework.

**JOB-01 MUST:** Put typed `contract.ts`, business `handler.ts` and binding `job.ts` in feature `background/<job>/`. Each feature exports one `defineBackground({ jobs, workflows })` manifest. `defineWorker({ features, adapter })` reuses the service feature list and rejects duplicate names.

**JOB-02 MUST:** Use a stable job envelope: logical ID, type, contract version, createdAt, small input and correlation. Restore trusted execution scope at dispatch; tenant fields apply only to multi-tenant products. Preserve logical IDs across retries and make handler effects replay-safe.

**JOB-03 MUST:** Workflows contain serializable ordered job steps, timeout/retry policy and optional compensation. No provider SDKs or arbitrary callbacks in definitions. Pin running executions to compatible definitions; retain old payload semantics until they drain.

**JOB-04 MUST:** Temporal adapters execute jobs as Activities and preserve completed steps during replay. Step Functions adapters compile supported definitions to state machines. Queue-only workflow support needs durable orchestration state; reject unsupported constructs rather than losing semantics.

**JOB-05 MUST:** Prove each selected adapter's duplicate start, step retry, crash recovery, compensation and version overlap. Advanced Temporal signals, waits, branching and parallelism require an explicit extension; provider equivalence is not assumed.

**JOB-06 MUST:** A repeated step returns cursor, processed count and done. Require row/batch/deadline bounds, finite retries, advancing cursor and cancellation after a bounded batch. No progress or exhausted limits produces a non-success state; durable checkpoints prevent duplicate batches.

```text
features/orders/background/
  reserve-stock/{contract,handler,job}.ts
  confirm-order/{contract,handler,job}.ts
  fulfil-order/{contract,workflow}.ts
  index.ts                      # feature manifest
integrations/background/       # Temporal or another selected adapter
```

```ts
export const fulfilOrder = defineWorkflow({
  name: OrderWorkflow.Fulfil,
  input: fulfilOrderInput,
  steps: [{ job: reserveStock }, { job: confirmOrder }],
});
```

Temporal is the default when this capability is needed; its persistence, upgrades, security, worker capacity and shutdown need an owner. Commit required start intent with business state. **Check:** fail step two and verify step one is not repeated; resume an old execution after deployment. **Vary when:** a supported alternative adapter satisfies the declared subset. No adapter implementation is certified by this handbook. Source: [Temporal workflow requirements](https://docs.temporal.io/workflow-definition).
