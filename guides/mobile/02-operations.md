# Mobile telemetry and release

**Scope:** supported mobile platforms. **Why:** diagnose failures while respecting device privacy and long-lived installations.

**MOPS-01 MUST:** App-owned typed analytics, crash/error, performance and diagnostic ports hide vendor SDKs. Measure JS/native crashes, ANRs, startup and selected journeys; analytics is separate from diagnostic logs.

**MOPS-02 MUST:** Local diagnostics use a bounded encrypted native buffer with an OS-protected key. Allowlist fields; never write tokens, PII, bodies or raw errors. Ordinary console/OS logs are not assumed encrypted.

```ts
// app/telemetry/diagnostics.ts — app port; native adapter owns key/buffer
diagnostics.record(OrderLog.CancelFailed, { reasonCode: FailureCode.Network });
// Adapter: allowlist fields → encrypt → append to bounded ring buffer.
```

**MOPS-03 MUST:** Support upload is user-triggered by default or follows an explicitly selected automatic policy. Authenticate uploads to the backend, return a support ID, and enforce access/expiry/deletion. Clear protected logs on scope change.

**MOPS-04 MUST:** Build immutable signed binaries with app version, platform build number, commit and binary identity. Test both platforms, use TestFlight/Play internal tracks and phased/staged production rollout; protect signing credentials.

**MOPS-05 MUST:** Expo profiles map environment, identifiers and OTA channels/runtime versions explicitly. Native changes need a new binary. Test OTA on the matching native runtime and recovery against persisted state; pausing a store rollout does not uninstall shipped binaries.

**MOPS-06 MUST:** Keep BE contracts compatible with supported older app versions. Define minimum-version policy and monitor crashes, ANRs, startup and critical journeys during rollout.

```ts
// features/orders/cancel/api/use-cancel-order.ts — callbacks passed to useMutation
const { analytics, diagnostics } = useTelemetry();
const onSuccess = (order: OrderView) => {
  analytics.track(OrderAnalytics.Cancelled, { kind: order.kind });
};
const onError = (error: unknown) => {
  diagnostics.record(OrderLog.CancelFailed, { reasonCode: toSafeReasonCode(error) });
};
```

**Check:** safe payload, encrypted buffer/upload expiry, crash capture, both release profiles and rollback/fix compatibility. **Vary when:** omit OTA or disable diagnostics for the product's privacy needs. Sources: [Expo runtime versions](https://docs.expo.dev/eas-update/runtime-versions/), [Android vitals](https://developer.android.com/topic/performance/vitals/), [OWASP mobile logs](https://mas.owasp.org/MASWE/MASVS-STORAGE/MASWE-0005/).

The telemetry port owns consent and identity scope; `toSafeReasonCode` returns an allowlisted code, never the raw exception. Success and failure callbacks run on their respective outcomes.
