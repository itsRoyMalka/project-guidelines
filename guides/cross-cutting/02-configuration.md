# Configuration, environments, and flags

**Applies to:** frontend, backend, and workers.

**CFG-01 MUST:** Separate configuration that varies by deployment from code. Read it through one typed, validated boundary and fail before readiness when required values are missing or invalid. Keep secrets in managed secret storage; committed examples contain no real credentials.

**CFG-02 MUST:** Keep browser configuration explicitly public. Do not rely on a build-time variable for a setting that operators must change at runtime unless redeployment is the intended control. Validate deployed runtime config before mounting the app.

**CFG-03 MUST:** Define each environment by explicit values, not hidden assumptions about `dev`/`prod` names. Document region, tenant, identity provider, external endpoint, and data source differences. Local development should have a safe way to exercise critical integrations.

**CFG-04 SHOULD:** Use feature flags for staged rollout and kill switches, not permanent branching of business logic. Each flag has owner, on/off behavior, observation criteria, and removal date. Test both states for consequential behavior.

**CFG-05 MUST:** Keep operationally significant config changes reviewed and traceable. New external dependencies need local/test configuration and a failure-mode note. Do not log secret values while reporting config errors.

**Verification:** cold-start validation, missing/invalid config cases, local and deployed config comparison, and flag-off regression. Further reading: [Twelve-Factor config](https://www.12factor.net/config).
