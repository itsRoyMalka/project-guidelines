# Testing and QA

**Applies to:** all code changes. Test behavior and contracts at the cheapest layer that can prove them. A repo-local no-test policy is not the baseline for a new enterprise application.

| Boundary | Proves | Default use |
| --- | --- | --- |
| BE API integration | Policy, handler, persistence and side effects together | Per action, real app/database |
| FE feature interaction | User-visible flow and API reaction | Per flow, rendered UI and mocked HTTP |
| E2E | Critical user journey across deployables | Small deployed web/device suite |
| Focused unit/integration | Otherwise uncovered algorithm, query or provider risk | Add only for distinct proof |
| Contract | Consumer/provider compatibility | Published API/event boundaries |

**TEST-01 MUST:** Test flows: BE action API integration and FE feature interaction are the defaults; E2E covers a small critical cross-app set. Add focused lower-level tests only for otherwise uncovered risk. Bug fixes reproduce the defect; documentation/cosmetic work gets proportional review.

**TEST-02 MUST:** Keep tests isolated and parallel-safe, with unique namespaces and cleanup registered immediately after allocation. Deterministic clocks/IDs stay within each test namespace. Mock external providers as needed and use real integration proof for critical owned persistence/authorization boundaries. See [local and test lifecycle](recipes/local-and-test.md).

**TEST-03 MUST:** E2E uses shared test-ID constants for every app target and locale-independent state assertions. Business prerequisites run through reusable UI flows. Infrastructure-only provisioning/cleanup may use supported APIs; see [E2E rules](../e2e/01-journeys.md).

**TEST-04 MUST:** Distinguish mocked UI E2E from deployed integration smoke. Report known blockers and skipped checks honestly. A test path or coverage percentage does not prove behavior quality.

**TEST-05 MUST:** CI runs the checks applicable to the changed units and their dependents: typecheck/lint, relevant unit and integration tests, contract checks, and build. Run E2E for affected critical journeys before merge or as a required promotion gate when the test needs a deployed environment. A library or backend-only change does not acquire a browser test merely to satisfy a list. Broader suites may run separately, but failures have an owner and cannot silently become permanent skips.

**TEST-06 SHOULD:** Use changed-code coverage as a diagnostic, not a substitute for review of assertions and risk. Performance and accessibility checks belong to affected critical flows.

**Verification:** tests fail for the targeted defect, pass for the fix, and remain reproducible in CI. Further reading: [Playwright best practices](https://playwright.dev/docs/best-practices).

Read [shared BE test shape](../backend/shared/04-testing-and-proof.md), [FE test shape](../frontend/07-testing.md) and [shared dev targeting](../e2e/02-environments.md) for the selected boundary. No separate per-action test-plan document or universal coverage threshold is required.

### Example: rejected flow proof

```ts
// features/orders/cancel-order/cancel-order.test.ts
// test is the app-scoped API fixture; helpers exercise the real API/DB.
test('another customer cannot cancel the order', async ({ api }) => {
  const { createUser, createOrder, cancelOrder, getOrder, sideEffects } = api;
  const owner = await createUser();
  const other = await createUser();
  const order = await createOrder(owner);
  const response = await cancelOrder(other, order.id);
  expect(response.statusCode).toBe(HttpStatus.NotFound);
  expect((await getOrder(owner, order.id)).status).toBe(OrderStatus.Pending);
  expect(await sideEffects.outbox.forResource(order.id, OrderEvent.Cancelled)).toHaveLength(0);
});
```

This example selects the hidden-resource 404 policy; test the product's actual policy. The outbox inspection reads committed intent, not broker-send counts. Helpers and status constants are declared by the consuming test library.
