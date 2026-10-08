# E2E anti-patterns

**Scope:** Playwright web and Detox mobile journeys against the selected running stack. The [journey](01-journeys.md) and [environment](02-environments.md) rules own enforcement.

| Avoid | Why it fails | Use instead |
| --- | --- | --- |
| Create the business prerequisite through an API in a journey that claims a full user flow | A broken create UI goes undetected | Reusable `createOrder(page, overrides)` UI flow; APIs only for provisioning/cleanup outside the claimed journey |
| One giant spec for many unrelated outcomes | Failure location and reuse become unclear | One focused journey per meaningful outcome; small reusable UI flows |
| A Page Object that hides every assertion or reimplements the application | Tests become opaque and costly | Thin domain flow helpers; keep the decisive assertion in the spec |
| Target spans, CSS, English labels or list positions | Layout and locale changes break selectors | Shared semantic test IDs on actual controls; separate locale-copy checks |
| `waitForTimeout` or a global Detox synchronization disable | Slow and flaky timing | Locator auto-wait/web-first assertion or bounded native state wait |
| Reuse one mutable account or truncate a shared dev DB | Parallel runs and developers interfere | Per-run account/data namespace plus owned cleanup ledger |
| Test a PR against a changing dev deployment without checking version | The result may belong to another build | Record/verify FE, BE and mobile artifact identities before the run |
| Stub the selected backend inside the deployed E2E app | Cross-service behavior is not exercised | Run the selected full stack; name any external sandbox/double seam |
| Call a live production provider or claim a simulated push proves delivery | Risk and false coverage | Provider sandbox/contract check; say exactly which boundary was exercised |
| Retry until green and discard the first failure | A flake becomes invisible | Preserve first failure/artifacts; classify and fix isolation/timing cause |
| Assert a private DB row as the only success proof | User-observable result may still fail | Assert visible result and persistence after reload; use DB evidence only for a specific invariant |

### Small correction

```ts
// apps/e2e/web/orders/create-and-cancel.test.ts
test('customer cancels an order', async ({ page, user }) => {
  await signIn(page, user);
  const order = await createOrder(page, { quantity: 2 }); // fills and clicks UI
  await cancelOrder(page, order.id);                         // clicks UI
  await page.reload();
  await expect(page.getByTestId(OrderTestId.cancelled(order.id))).toBeVisible();
});
```

The app fixture and helpers follow the [journey guide](01-journeys.md); imports are omitted. `createOrder` and `cancelOrder` are UI flows, not HTTP seeds. The stable state ID avoids an English outcome assertion. **Check:** run alone and parallel in both supported locales, with captured artifact versions and cleanup after failure.

**Exception:** Browser/OS-owned surfaces may require a narrow native selector; test setup and teardown may call supported APIs. Document those seams under [GOV-05](../00-governance.md). Shared test IDs are this handbook's approved team convention; Playwright normally favors user-facing role/text locators. Sources: [Playwright best practices](https://playwright.dev/docs/best-practices), [locators](https://playwright.dev/docs/locators), [Detox test IDs](https://wix.github.io/Detox/docs/guide/test-id/).
