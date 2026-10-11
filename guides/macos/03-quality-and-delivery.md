# macOS quality, diagnostics and delivery

**Scope:** installable macOS candidates and releases. Reuse [FE tests](../frontend/07-testing.md), [E2E journeys](../e2e/01-journeys.md), [operations](../cross-cutting/04-operations.md), [security](../cross-cutting/01-security.md) and [delivery](../cross-cutting/05-delivery.md). These rules add proof required by a local binary, OS integration and long-lived installations.

**MACQ-01 MUST:** Keep renderer feature tests focused on user behavior. Test privileged IPC handlers with invalid sender/payload/permission and success/cancel paths. Run a small installed-app macOS E2E suite for launch, deep link/file open, native menu, logout/relaunch and one critical journey. A renderer browser test does not prove packaging, native dialogs or Gatekeeper. Playwright's Electron API is experimental; verify the selected tool against the installed candidate. [Electron automated testing](https://www.electronjs.org/docs/latest/tutorial/automated-testing), [Playwright Electron](https://playwright.dev/docs/api/class-electron).

```text
apps/desktop/src/main/ipc/save-export.test.ts  # handler boundary
apps/desktop/src/renderer/features/orders/details/details.test.tsx # FE behavior
apps/e2e/desktop/orders/open-link.test.ts       # packaged Mac candidate
```

```ts
// apps/e2e/desktop/orders/open-link.test.ts — project-owned app fixture
test('a cold deep link opens the intended order', async ({ desktopApp }) => {
  const order = await createOrder(desktopApp.window, { quantity: 2 }); // UI flow
  await desktopApp.quit();
  await desktopApp.openUrl(orderDetailsDesktopLink(order.id));
  await expect(desktopApp.window.getByTestId(OrderTestId.Details)).toBeVisible();
});
```

**MACQ-02 MUST:** Set reproducible budgets for cold start to usable window, first action responsiveness, idle CPU/wakeups, per-process memory and sleep/wake recovery on reference Macs. Measure before optimizing; defer unnecessary startup work and avoid blocking the main process or synchronous IPC. Record candidate/version/device/OS with measurements. [Electron performance](https://www.electronjs.org/docs/latest/tutorial/performance), [app metrics](https://www.electronjs.org/docs/latest/api/app).

```ts
// main/telemetry/performance.ts — bounded diagnostic, not a user ID metric label
desktopMetrics.record(DesktopMetric.StartupReadyMs, readyAt - launchAt, { channel: releaseChannel });
// Sample app.getAppMetrics() for a repeatable memory/CPU investigation.
```

**MACQ-03 MUST:** Separate native crashes, JS errors, product analytics and user-support diagnostics. Crash reporting starts before windows when selected; annotations and logs contain allowlisted version/channel/build and safe reason codes, not PII, tokens, bodies or file paths. Upload follows the product's privacy/consent policy, with expiry and deletion. Mac App Store builds need a separate crash strategy because Electron's crashReporter is unavailable there. [Electron crash reporting](https://www.electronjs.org/docs/latest/tutorial/crash-reporting), [crashReporter API](https://www.electronjs.org/docs/latest/api/crash-reporter).

```ts
// main/app/bootstrap.ts — before creating BrowserWindow
crashReporter.start({ submitURL: crashEndpoint, uploadToServer: consent.crashUpload });
diagnostics.record(DesktopLog.ExportFailed, { reasonCode: FailureCode.DiskFull });
// Adapter allowlists fields; it never records raw error.message or file path.
```

**MACQ-04 MUST:** Select one distribution profile in the architecture brief. Direct download builds are immutable, signed with the intended Developer ID identity, hardened, notarized, stapled and verified as downloaded artifacts before release. Mac App Store builds use their own signing/provisioning, sandbox entitlements, store review/update path and crash approach. Do not mix the direct-download updater into the Store profile. Protect signing keys and verify nested native code. [Apple notarization](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution), [Electron signing](https://www.electronjs.org/docs/latest/tutorial/code-signing), [Electron Mac App Store](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide/).

```text
Direct: pinned source/lockfile → immutable .app → sign → notarize → staple
        → download like a user → Gatekeeper/launch/upgrade smoke → release
Store:  Store identity + entitlements → Store validation/review → Store rollout
```

**MACQ-05 MUST:** For direct download, use a signed update feed with explicit stable/beta channels, update identity and compatibility policy. Test install A→B, interrupted download, relaunch, bad feed and persisted-data upgrade. Stop a faulty feed and ship a fixed higher version; do not assume a generic updater can downgrade a user's binary. Local schema and backend contracts must remain compatible with supported old clients. [Electron updates](https://www.electronjs.org/docs/latest/tutorial/updates), [autoUpdater](https://www.electronjs.org/docs/latest/api/auto-updater).

```text
Release 2.4.1: channel=stable; source=<commit>; binary=<signed digest>
Compatible local schema: 7→8; older 2.4.0 client still reads server contract
Recovery: stop feed; publish 2.4.2; preserve user data; verify A→2.4.2
```

**MACQ-06 MUST:** CI runs shared affected checks and macOS-specific build/sign/package tests for the selected candidate. Inspect dependency, Electron/runtime and native-module changes; release only the verified final artifact. Record exactly which native E2E, accessibility, upgrade and Gatekeeper checks ran; an unavailable check is an unmet gate, not a pass. [Electron ASAR integrity](https://www.electronjs.org/docs/latest/tutorial/asar-integrity), [shared delivery rules](../cross-cutting/05-delivery.md).

```text
PR: affected TS/FE/IPC tests + unsigned package smoke where supported
Release candidate on macOS: signed/notarized artifact + installed-app/upgrade proof
Promotion: same verified artifact identity and release-channel record
```

**MACQ-07 MUST:** Record the supported macOS versions and CPU architectures with each release. Build native modules for the selected Electron ABI and architecture, sign the resulting nested code, then test install, launch and upgrade from the final `arm64`/`x64` artifacts or selected universal artifact. A universal binary is a distribution choice; source compilation on one developer Mac is not architecture proof. [Electron native modules](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules), [Apple silicon porting](https://developer.apple.com/documentation/apple-silicon/porting-your-macos-apps-to-apple-silicon).

```text
docs/architecture/overview.md — example support record, not a mandated minimum
macOS: 13+; architectures: arm64 and x64; artifact: two signed builds
Native dependencies: SQLite adapter rebuilt for pinned Electron ABI
Proof: install/launch/upgrade smoke on each architecture and oldest supported OS
```

**Verification:** reproduce one installed candidate's source/build identity, invalid IPC rejection, crash-safe payload, performance budget, notarization/Gatekeeper check, architecture matrix, upgrade and forward-recovery path. **Exception:** Tauri/native builds use their selected signing/update/test tools, with equivalent installed-artifact and recovery proof; omit crash upload when privacy policy disallows it.
