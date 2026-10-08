# E2E user journeys

**Scope:** complete critical flows across running applications. **Why:** verify integration through the user's actions with a small maintainable suite.

**E2E-01 MUST:** Business prerequisites and target actions run through UI flows. `createOrder` clicks/fills the app; it is not an API seed. Provisioning/auth infrastructure and cleanup may use supported APIs when outside the claimed journey.

**E2E-02 MUST:** Put web/mobile domain specs under `apps/e2e`; support owns reusable UI flows, fixture defaults/typed overrides, isolation and cleanup. Keep the important assertions visible in the spec.

**E2E-03 MUST:** Target app elements only by shared per-domain test IDs. Assert stable user-visible states, including reload where persistence matters. No text/CSS/tag/position targeting or hard-coded English outcome assertions; localized-copy checks have their own expected messages.

**E2E-04 MUST:** Use Playwright for web and Detox/TypeScript for native device journeys. Native DS forwards testID to real views. Prefer built-in synchronization or bounded state waits; never arbitrary sleeps.

**E2E-05 MUST:** Isolate account/run/device state and cleanup. Cover selected cold/warm links, denied permission, logout Back, resume and promised offline behavior on iOS/Android. Deliberate persistence/upgrade tests state their retained state.

**E2E-06 MUST:** Run installable mobile candidates against the full selected backend. Record binary/OS/device identity and sanitized failure artifacts. Simulated push proves app handling, not remote delivery.

```text
apps/e2e/
  web/orders/create-and-cancel.test.ts
  web/support/orders/{defaults,flows}.ts
  mobile/orders/create-and-cancel.test.ts
  mobile/support/{auth,device,cleanup}.ts
packages/test-ids/orders.ts
```

```ts
test('customer cancels an order', async ({ page, user }) => {
  await signIn(page, user);
  const order = await createOrder(page, { quantity: 2 });
  await cancelOrder(page, order.id);
  await page.reload();
  await expect(page.getByTestId(OrderTestId.cancelled(order.id))).toBeVisible();
});
```

**Check:** repeat alone/parallel, both locales and supported platforms, failure cleanup. **Vary when:** OS/browser-owned surfaces use narrow native selector exceptions. Expo requires a representative two-platform Detox build; Maestro is an alternative with a verified shared-ID mapping. Our strict ID policy is a team choice, not Playwright's default recommendation. Sources: [Playwright](https://playwright.dev/docs/best-practices), [Detox IDs](https://wix.github.io/Detox/docs/guide/test-id/).
