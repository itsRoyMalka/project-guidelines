# Testing and QA

**Applies to:** all code changes. Test behavior and contracts at the cheapest layer that can prove them. A repo-local no-test policy is not the baseline for a new enterprise application.

| Layer | Proves | Typical dependencies |
| --- | --- | --- |
| Unit/domain | Decisions and edge cases | Pure code or small fakes |
| Component | User-visible UI behavior | Rendered UI, mocked network boundary |
| Integration | Database, queue, auth, or service boundary | Real local/test dependency where feasible |
| Contract | Consumer/provider schema compatibility | Published API/event schema |
| E2E | Critical user journey across deployables | Deployed or representative environment |

**TEST-01 MUST:** A bug fix includes a regression test that fails for the defect when practical. New behavior has tests of success, meaningful failure, authorization/tenant scope, and boundary behavior. Tests assert observable outcomes, not private method calls.

**TEST-02 MUST:** Keep tests isolated, deterministic, and parallel-safe. Each test owns and cleans up its data; use fixed clocks and stable IDs when time/order matter. Mock third parties where necessary, but test the application's own critical persistence and authorization boundaries with real integrations.

**TEST-03 SHOULD:** Keep E2E coverage focused on critical journeys and cross-system risks. Use accessible/user-facing locators, controlled fixtures, and clear step narratives. Do not create a browser test for every component state.

**TEST-04 MUST:** Distinguish mocked UI E2E from deployed integration smoke. Report known blockers and skipped checks honestly. A test path or coverage percentage does not prove behavior quality.

**TEST-05 MUST:** CI runs the checks applicable to the changed units and their dependents: typecheck/lint, relevant unit and integration tests, contract checks, and build. Run E2E for affected critical journeys before merge or as a required promotion gate when the test needs a deployed environment. A library or backend-only change does not acquire a browser test merely to satisfy a list. Broader suites may run separately, but failures have an owner and cannot silently become permanent skips.

**TEST-06 SHOULD:** Use changed-code coverage as a diagnostic, not a substitute for review of assertions and risk. Performance and accessibility checks belong to affected critical flows.

**Verification:** tests fail for the targeted defect, pass for the fix, and remain reproducible in CI. Further reading: [Playwright best practices](https://playwright.dev/docs/best-practices).
