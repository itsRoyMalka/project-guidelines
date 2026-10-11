# Desktop quality, diagnostics and delivery

**Scope:** installable desktop candidates and releases for each selected OS. Reuse [FE tests](../frontend/07-testing.md), [E2E journeys](../e2e/01-journeys.md), [operations](../cross-cutting/04-operations.md), [security](../cross-cutting/01-security.md) and [delivery](../cross-cutting/05-delivery.md). These rules add proof required by a local binary, OS integration and long-lived installations.

**DESKQ-01 MUST:** Keep renderer feature tests focused on user behavior. Test privileged IPC handlers with invalid sender/payload/permission and success/cancel paths. Run a small installed-app E2E suite per supported OS for launch, deep link/file open, native menu, logout/relaunch and one critical journey. A renderer browser test does not prove packaging, native dialogs or OS install trust. Playwright's Electron API is experimental; verify the selected tool against the installed candidate. [Electron automated testing](https://www.electronjs.org/docs/latest/tutorial/automated-testing), [Playwright Electron](https://playwright.dev/docs/api/class-electron).

```text
apps/desktop/src/main/ipc/save-export.test.ts  # handler boundary
apps/desktop/src/renderer/features/orders/details/details.test.tsx # FE behavior
apps/e2e/desktop/orders/open-link.test.ts       # packaged desktop candidate
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

**DESKQ-02 MUST:** Set reproducible budgets for cold start to usable window, first action responsiveness, idle CPU/wakeups, per-process memory and sleep/wake recovery on reference devices per OS. Measure before optimizing; defer unnecessary startup work and avoid blocking the main process or synchronous IPC. Record candidate/version/device/OS with measurements. [Electron performance](https://www.electronjs.org/docs/latest/tutorial/performance), [app metrics](https://www.electronjs.org/docs/latest/api/app).

```ts
// main/telemetry/performance.ts — bounded diagnostic, not a user ID metric label
desktopMetrics.record(DesktopMetric.StartupReadyMs, readyAt - launchAt, { channel: releaseChannel });
// Sample app.getAppMetrics() for a repeatable memory/CPU investigation.
```

**DESKQ-03 MUST:** Separate native crashes, JS errors, product analytics and user-support diagnostics. Crash reporting starts before windows when selected; annotations and logs contain allowlisted version/channel/build and safe reason codes, not PII, tokens, bodies or file paths. Upload follows the product's privacy/consent policy, with expiry and deletion. Verify crash reporter support for each selected package channel. [Electron crash reporting](https://www.electronjs.org/docs/latest/tutorial/crash-reporting), [crashReporter API](https://www.electronjs.org/docs/latest/api/crash-reporter).

```ts
// main/app/bootstrap.ts — before creating BrowserWindow
crashReporter.start({ submitURL: crashEndpoint, uploadToServer: consent.crashUpload });
diagnostics.record(DesktopLog.ExportFailed, { reasonCode: FailureCode.DiskFull });
// Adapter allowlists fields; it never records raw error.message or file path.
```

**DESKQ-04 MUST:** Select a distribution profile for every supported OS/channel. Protect signing identities, package the exact candidate being tested and verify the installed artifact. Each channel has its own signing, trust, permissions and update rules; follow the selected [OS profile](07-platform-profiles.md). [Electron signing](https://www.electronjs.org/docs/latest/tutorial/code-signing).

```text
source/lockfile → immutable build → channel-specific trust proof
→ clean install/launch/upgrade → release the same artifact digest
```

**DESKQ-05 MUST:** For an app-managed update channel, use a trusted update feed with explicit stable/beta channels, update identity and compatibility policy. Test install A→B, interrupted download, relaunch, bad feed and persisted-data upgrade. Stop a faulty feed and ship a fixed higher version; do not assume a generic updater can downgrade a user's binary. Local schema and backend contracts must remain compatible with supported old clients. The selected OS profile owns the actual update mechanism; store-managed channels follow their store policy. [Electron updates](https://www.electronjs.org/docs/latest/tutorial/updates).

```text
Release 2.4.1: channel=stable; source=<commit>; binary=<signed digest>
Compatible local schema: 7→8; older 2.4.0 client still reads server contract
Recovery: stop feed; publish 2.4.2; preserve user data; verify A→2.4.2
```

**DESKQ-06 MUST:** CI runs shared affected checks and OS-specific build/sign/package tests for the selected candidate. Inspect dependency, Electron/runtime and native-module changes; release only the verified final artifact. Record exactly which native E2E, accessibility, upgrade and OS install/trust checks ran; an unavailable check is an unmet gate, not a pass. [Electron ASAR integrity](https://www.electronjs.org/docs/latest/tutorial/asar-integrity), [shared delivery rules](../cross-cutting/05-delivery.md).

```text
PR: affected TS/FE/IPC tests + unsigned package smoke where supported
Release candidate per OS/channel: trusted artifact + installed-app/upgrade proof
Promotion: same verified artifact identity and release-channel record
```

**DESKQ-07 MUST:** Record supported OS versions, package channels and CPU architectures with each release. Rebuild native modules for the selected Electron ABI and target architecture, then test install, launch and upgrade from each final artifact on the target OS. Building source on one developer machine is not cross-platform or architecture proof. [Electron native modules](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules).

```text
docs/architecture/overview.md — example support record, not a mandated minimum
Selected OS/channel: record each version and CPU with its artifact
Native dependency: SQLite adapter rebuilt for pinned Electron ABI per target
Proof: install/launch/upgrade smoke on each supported OS/channel/architecture
```

**Verification:** reproduce one installed candidate's source/build identity, invalid IPC rejection, crash-safe payload, performance budget, OS signing/install-trust check, architecture matrix, upgrade and forward-recovery path. Apply the [platform profiles](07-platform-profiles.md) for exact OS/channel gates. **Exception:** Tauri/native builds use their selected signing/update/test tools, with equivalent installed-artifact and recovery proof; omit crash upload when privacy policy disallows it.
