# E2E against shared dev

**Scope:** deployed full-stack E2E. **Why:** reuse dev safely while proving the exact running versions.

**ENV-01 MUST:** Shared dev runs the FE/mobile candidate, required owned services/workers, auth, queues and normal nonproduction databases. External providers use sandbox or named doubles; no production outbound effects.

**ENV-02 MUST:** Capture FE/BE/worker digests, migrations and target identity before/after the run. Hold a short deployment lease or use an immutable target; fail on drift or unhealthy dependencies. Dev proves a PR only when that candidate is actually deployed.

**ENV-03 MUST:** Isolate with automation tenants only for multitenant products; otherwise dedicated accounts/scopes and run IDs. Use separate workers where state conflicts. Never truncate shared DBs or mutate developer/global configuration.

**ENV-04 MUST:** Register created resources as they appear; cleanup through supported operations and retry abandoned records by expiry. Failure reports include run ID, version manifest and safe correlated artifacts.

**ENV-05 MUST:** Run deployment smoke, selected release/scheduled regression and on-demand debugging. A required gate wakes hibernated dev or fails; unavailable/5xx is not a passing skip. Optional scheduled absence is explicitly not run.

```text
run: e2e-123
web: commit-a
orders-api: digest-b, migration-42
identity: digest-c
result: passed; manifest unchanged
```

```ts
// apps/e2e/web/support/run.ts — project-owned run fixture excerpt
const before = await dev.readDeploymentManifest();
await dev.requireCandidate(before, expectedCandidate);
try {
  await use({ runId, registerOwnedResource }); // UI journeys use this run scope
} finally {
  try { await cleanupOwnedResources(runId); }
  finally {
    try { await dev.assertManifestUnchanged(before); }
    finally { await dev.releaseLease(runId); }
  }
}
```

The fixture acquires a run ID and a bounded deployment lease before this excerpt, and releases the lease even on failure. `registerOwnedResource` records each resource immediately; `requireCandidate` checks deployed FE, BE and worker digests, not merely a PR SHA. The journey itself still creates business prerequisites through UI flows under [E2E-01](01-journeys.md).

**Check:** parallel tests plus a developer session remain isolated; force version drift, mid-test failure and unavailable dev. **Vary when:** global mutations or unisolatable risk use an exclusive or on-demand environment; there is no mandatory always-on QA clone. Sources: [Playwright CI](https://playwright.dev/docs/ci), [account isolation](https://playwright.dev/docs/auth).
