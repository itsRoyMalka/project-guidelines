# React Native mobile profile

**Scope:** iOS/Android. **Why:** reuse feature/API principles with explicit native behavior. Start with React Native + TypeScript; evaluate Expo first as the framework-recommended starting point, then verify required native integrations. Existing supported native stacks remain valid.

**MOB-01 MUST:** Record OS/device support, runtime/toolchain versions and native build mode. Share browser-safe contracts and pure logic with web; UI implementations remain platform-specific unless cross-platform reuse is proven.

**MOB-02 MUST:** App owns typed navigation, stacks/tabs and deep-link/auth mapping. Screens are thin feature compositions; pass resource IDs rather than objects. Reset protected navigation on identity changes and test cold/warm links and Back.

**MOB-03 MUST:** Features render only mobile DS components. Native View/Text/Pressable/Input live inside the DS, which owns safe area, keyboard, touch targets, native semantics, text scaling, RTL, reduced motion and testID forwarding.

**MOB-04 MUST:** TanStack Query owns remote data; app data setup connects network/foreground state. Default online-first; persist only explicitly approved data with scope/expiry. Offline writes require durable idempotent queue, conflict/reconciliation and visible pending/failure states.

**MOB-05 MUST:** Device ports own media, location, notifications and background work. Request least permission in context; handle limited, denied, revoked and unavailable states. Push carries safe resource references; token association follows the active account and is removed on logout.

**MOB-06 MUST:** OAuth uses system browser, code + PKCE and validated callbacks. Keep persistent credentials in OS secure storage; define backup/reinstall behavior. Biometrics unlock local access, never replace server authentication.

**MOB-07 MUST:** Logout/scope change cancels old work and clears protected credentials, caches, drafts, pending writes and diagnostics. OS background work is bounded and interruptible; the BE owns work that must finish durably.

```text
apps/mobile/src/
  app/{navigation,data,auth,device,storage,telemetry}/
  screens/order-details/
  features/orders/{details,cancel,shared,messages}/
packages/mobile-ui/             # native DS implementation
packages/contracts/             # same public wire contract as web
packages/test-ids/              # shared semantic targets
```

Use [FE forms/state](../frontend/02-state-and-forms.md), [time/date input and display](../frontend/10-time-and-dates.md), [feature tests](../frontend/07-testing.md) with React Native Testing Library, [mobile telemetry/release](02-operations.md) and [device E2E](../e2e/01-journeys.md). **Check:** both platform builds, native integration, auth/deep links, permission denial, foreground/offline and accessible large-text/RTL states. **Vary when:** React Navigation without Expo or a supported native stack meets the same controls. Sources: [RN framework guidance](https://reactnative.dev/docs/environment-setup), [Expo monorepos](https://docs.expo.dev/guides/monorepos/), [native OAuth](https://datatracker.ietf.org/doc/html/rfc8252).

### Example: native form bridge

```tsx
// features/orders/create/ui/create-order-form.tsx — RN DS exports
// form uses RHF defaults + zodResolver(createOrderDraftSchema).
<Controller
  control={form.control}
  name="name"
  render={({ field, fieldState }) => (
    <TextField value={field.value} onChangeText={field.onChange}
      onBlur={field.onBlur} ref={field.ref} label={t('create.name')}
      error={fieldState.error?.message} testId={OrderTestId.NameInput} />
  )}
/>
```

`Controller` is from React Hook Form; `TextField` is the native DS wrapper. It forwards focus/ref and testID to the editable native input. The DS submit button calls `form.handleSubmit` and exposes pending/disabled state; native code does not rely on HTML form events.
