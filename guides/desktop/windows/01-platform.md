# Windows desktop profile

**Scope:** apply after the shared [desktop profile](../01-app-and-security.md) when Windows is a selected target. Record supported Windows versions, CPU architectures and installer/MSIX/Microsoft Store channel in the architecture brief.

**DESKWIN-01 MUST:** Choose the app's window, taskbar and tray policy explicitly. On last-window close, quit unless a named background task requires a visible tray/status path. Register protocol/file associations through the selected package, then validate second-instance command-line input into the shared typed intent router. Keep standard Edit/View/Help menu roles and keyboard behavior consistent with Windows conventions. [Electron app events](https://www.electronjs.org/docs/latest/api/app), [Electron deep links](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app).

```ts
// main/platform/windows/intents.ts — OS adapter only
app.on('second-instance', (_event, argv) => {
  for (const rawUrl of findAllowedProtocolArgs(argv)) receiveExternalUrl(rawUrl);
  focusOrCreateMainWindow();
});
```

**DESKWIN-02 MUST:** Keep small persistent credentials behind a Windows Credential Manager or protected OS credential adapter. Store app data under the selected per-user app data location; never put tokens in plain settings or renderer storage. Handle missing credentials, account switch and uninstall/retention policy. [Windows CredWrite](https://learn.microsoft.com/en-us/windows/win32/api/wincred/nf-wincred-credwritea), [Electron app paths](https://www.electronjs.org/docs/latest/api/app).

```ts
// main/platform/windows/credentials.ts — implements shared CredentialStore
await credentialStore.remove(accountId, CredentialKey.RefreshToken);
// Adapter removes the protected Windows credential and reports a typed result.
```

**DESKWIN-03 MUST:** Sign the selected installer or MSIX package with a trusted distribution identity and verify install, launch, protocol handling and A→B upgrade from the final artifact. An MSIX package has publisher identity and trust requirements; Store builds use the Store's signing/update path. App-managed feeds must match the selected installer technology and release channel. [Microsoft MSIX signing](https://learn.microsoft.com/en-us/windows/msix/package/sign-app-package-using-signtool), [Microsoft Store publishing](https://learn.microsoft.com/en-us/windows/apps/publish/get-started), [Electron autoUpdater](https://www.electronjs.org/docs/latest/api/auto-updater).

```text
Windows x64/MSIX: build → sign → verify publisher trust → install/launch → upgrade
Store: submit selected package → Store-managed rollout and update proof
```

**DESKWIN-04 SHOULD:** Use Windows-managed deployment, startup registration, notifications or file associations only for a named product journey. Keep each behind the shared [optional capability](../06-optional-capabilities.md), validate enterprise policy and test removal/disabled states on managed Windows machines. [Microsoft MSIX management](https://learn.microsoft.com/en-us/windows/msix/overview).

```ts
// main/platform/windows/managed-config.ts — project-owned adapter
const effective = resolveConfig({ defaults, userPreferences, managed: await managedConfig.read() });
```

**Verification:** packaged app window/taskbar/protocol/file behavior, Narrator/keyboard/RTL, credential storage, signature/package trust, install/upgrade, managed removal and account cleanup.
