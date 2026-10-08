# E2E pattern inventory

**Scope:** Web and native journeys. Reuse test support without hiding the user's action or the decisive assertion. [E2E journey rules](01-journeys.md) remain authoritative.

| Pattern | Use when | Shape here / limit |
| --- | --- | --- |
| Focused journey spec | A business outcome crosses running FE and BE | `apps/e2e/{web,mobile}/orders/create-and-cancel.test.ts`; assert outcome in spec |
| Task/flow helper | Several journeys perform the same UI action | `support/orders/flows.ts` implements `createOrder` by UI; no private API seed |
| Typed defaults + overrides | Flow setup needs realistic variation without duplicate forms | `support/orders/defaults.ts`; typed object, per-call override, unique run data |
| Test-scoped fixture | Account/device/cleanup lifecycle repeats | Playwright fixture or Detox suite setup owns run namespace and cleanup; no mutable global test data |
| Shared semantic target | Web/native selectors need stability across UI/locales | `packages/test-ids/orders.ts`; DS forwards ID to the actionable native/DOM control |
| State-based synchronization | Network, animation or eventual work has variable timing | Playwright `expect(locator)` / Detox built-in sync or bounded wait on named state |
| Deployment manifest gate | Shared dev may change while PR tests run | Verify selected FE/BE/binary digests and run ID before claiming a result |
| Explicit external seam | A journey reaches payment, email, push or maps | Named sandbox/double with separate provider contract or delivery check |
| Failure artifact + cleanup ledger | Parallel runs and diagnosis matter | Capture sanitized trace/screenshot/log and clean only resources owned by run ID |

### Reusable UI task

```ts
// apps/e2e/web/support/orders/flows.ts — app-specific controls omitted
export async function cancelOrder(page: Page, orderId: string) {
  await openOrder(page, orderId); // UI navigation helper
  await page.getByTestId(OrderTestId.CancelButton).click();
  await page.getByTestId(OrderTestId.ConfirmCancelButton).click();
}

// apps/e2e/web/orders/create-and-cancel.test.ts
await cancelOrder(page, order.id);
await expect(page.getByTestId(OrderTestId.cancelled(order.id))).toBeVisible();
```

`openOrder` is a project-owned UI navigation helper; `Page`, `test`, `expect` and the shared ID map are imported by the owning files. The helper performs a repeatable user task; the spec states the outcome it proves. **Check:** read a failing spec without opening helpers to identify its intended result; run it alone and parallel against the recorded deployment.

**Choose simply:** a local helper is enough for one repeated task. Add a broader Page Object only when it clarifies a stable, complex UI surface; keep assertions that define business success in the spec. Sources: [Playwright fixtures](https://playwright.dev/docs/test-fixtures), [Page Object Models](https://playwright.dev/docs/pom), [best practices](https://playwright.dev/docs/best-practices), [Detox IDs](https://wix.github.io/Detox/docs/guide/test-id/).
