# Configuration, environments, and flags

**Applies to:** frontend, backend, and workers.

**CFG-01 MUST:** Separate configuration that varies by deployment from code. Read it through one typed, validated boundary and fail before readiness when required values are missing or invalid. Keep secrets in managed secret storage; committed examples contain no real credentials.

**CFG-02 MUST:** Keep browser configuration explicitly public. Do not rely on a build-time variable for a setting that operators must change at runtime unless redeployment is the intended control. Validate deployed runtime config before mounting the app.

**CFG-03 MUST:** Document environment differences explicitly: endpoints, identity, data sources, region and runtime assumptions. Provide synthetic fixtures, safe dependency substitutes and least-privilege local credentials; identify integrations unavailable locally. See [local development and QA](recipes/local-and-test.md).

**CFG-04 SHOULD:** Temporary rollout/experiment flags have owner, observations, removal criteria and tested states. Long-lived operational kill switches may remain with a review cadence, tested fallback and access control. Treat authorization/entitlements separately from release flags.

**CFG-05 MUST:** Keep operationally significant config changes reviewed and traceable. New external dependencies need local/test configuration and a failure-mode note. Do not log secret values while reporting config errors.

**Verification:** cold-start validation, missing/invalid config cases, local and deployed config comparison, and flag-off regression. Further reading: [Twelve-Factor config](https://www.12factor.net/config).

### Example: one Node config boundary

```ts
// src/app/config.ts — z is Zod; only this boundary reads process.env.
const serverConfigSchema = z.object({
  port: z.coerce.number().int().min(1).max(65535),
  databaseUrl: z.string().min(1),
});
export const serverConfig = serverConfigSchema.parse({
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
});
```

This is server-only configuration. Bootstrap reports safe field names on failure, not values or raw exception payloads; it validates before readiness. A separate allowlisted public config feeds the browser—never serialize this object to FE.
