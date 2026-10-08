# Frontend feature tests

**Scope:** React flow behavior. **Why:** cover interactions while keeping maintenance small.

**FET-01 MUST:** Colocate `<flow>.test.tsx` beside its `api/` and `ui/`. Render real feature components with fresh router/i18n and selected Query/store state; MSW replaces HTTP responses.

**FET-02 SHOULD:** Test meaningful success, form, pending/error, permission and navigation/cache outcomes. Page tests cover composition; DS tests cover primitives; pure unit tests cover substantial algorithms only.

**FET-03 MUST:** Shared `src/test/` owns render fixtures, MSW handlers and typed defaults/overrides. Keep important scenario inputs visible and reset all state per test.

**FET-04 MUST:** Use shared test IDs for targeting, consistently with [E2E](../e2e/01-journeys.md). Verify accessible name/role/state as assertions; test localized copy against the selected locale's messages.

```tsx
test('failed cancellation keeps the dialog open', async () => {
  server.use(cancelOrderFails());
  const { user } = renderFeature(<CancelOrder orderId={order.id} />);
  await user.click(screen.getByTestId(OrderTestId.CancelButton));
  expect(await screen.findByTestId(OrderTestId.CancelError)).toBeVisible();
  expect(screen.getByTestId(OrderTestId.CancelDialog)).toBeVisible();
});
```

**Check:** test fails when the interaction is broken; no per-file coverage mandate. **Vary when:** a browser-owned surface needs a documented selector exception. Sources: [MSW](https://mswjs.io/docs/), [Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
