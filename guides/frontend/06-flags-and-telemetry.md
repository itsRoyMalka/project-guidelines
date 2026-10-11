# Flags, analytics and telemetry

**Scope:** web app shared services. **Why:** features use typed capabilities; adapters own providers.

**WEB-01 MUST:** `app/flags/` owns source, adapter, provider and `useFlag`; plain evaluators serve loaders. Prefer BE evaluation for shared FE/BE behavior, scoped to trusted identity; never confuse a flag with permission.

**WEB-02 MUST:** Flags have owner, safe default, tested on/off/unavailable states and removal/review trigger. Reload effective values on identity changes; stale values may be reused only within the same scope.

**WEB-03 MUST:** Separate typed analytics, error and performance ports. App providers own initialization, consent, sampling and identity reset; feature-owned event constants contain allowlisted properties. Provider failure must not block the action.

**WEB-04 MUST:** Track meaningful outcomes after success; durable business facts belong to the BE. Report unexpected errors once with safe release/trace context. Never export secrets, raw search text or personal data by default.

**WEB-05 MUST:** Measure LCP, INP, CLS and a few named journeys by device class. Optimize measured bottlenecks; do not log every render. Session replay requires explicit privacy configuration.

```ts
// packages/contracts/orders/experience.const.ts — shared web/mobile declarations
export const OrderFlag = { NewCancelFlow: 'orders.cancel.new-flow' } as const;
export const OrderAnalytics = { Cancelled: 'orders.cancel.succeeded' } as const;
```

```ts
// features/orders/cancel/api/use-cancel-order.ts — hook excerpt
const { analytics } = useTelemetry();
const onSuccess = (order: OrderView) => {
  analytics.track(OrderAnalytics.Cancelled, { kind: order.kind });
};
const enabled = useFlag(OrderFlag.NewCancelFlow);
const permitted = useCan(OrderAction.Cancel);
const canShowCancel = enabled && permitted; // UI gate; BE still authorizes
```

**Check:** recording-adapter payloads, logout/consent, flag failure and one measured journey. **Vary when:** disable analytics for product/privacy constraints; browser OpenTelemetry is not a mandatory runtime. Sources: [OpenFeature](https://openfeature.dev/docs/reference/sdks/client/web/react/), [Web Vitals](https://web.dev/articles/vitals).

Pass `onSuccess` to the mutation callback; never emit analytics during render. Compose it with the affected-query refresh from the reference flow. The shared declarations above are justified when web and mobile emit the same named event; a single-app feature keeps them local. Event property types are owned by Orders; the telemetry adapter enforces consent and scope.
