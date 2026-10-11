# macOS desktop profile

**Scope:** apply after the shared [desktop profile](../01-app-and-security.md) when macOS is a selected target. Record the minimum macOS version, `arm64`/`x64` support and direct-download versus Mac App Store channel in the architecture brief.

**DESKMAC-01 MUST:** Follow Mac window/menu behavior: closing the final window commonly leaves the app active; Dock activation focuses or recreates a window; the app menu owns Settings and standard commands use native roles. File/URL open events are parsed into the shared typed intent router before reaching a feature. Test cold launch, warm launch and second activation. [Electron app events](https://www.electronjs.org/docs/latest/api/app), [Electron Dock](https://www.electronjs.org/docs/latest/tutorial/macos-dock), [Apple macOS design](https://developer.apple.com/design/human-interface-guidelines/designing-for-macos/).

```ts
// main/platform/macos/lifecycle.ts — OS adapter only
app.on('window-all-closed', () => { /* remain active on macOS */ });
app.on('activate', () => focusOrCreateMainWindow());
app.on('open-url', (event, rawUrl) => { event.preventDefault(); receiveExternalUrl(rawUrl); });
```

**DESKMAC-02 MUST:** Keep small persistent credentials in a Keychain-backed adapter. Use native file panels and, for sandboxed packages that retain file access, security-scoped access. Select entitlements per capability; Electron's renderer sandbox does not grant or replace App Sandbox permissions. Verify denied/revoked permission and account-switch cleanup. [Apple Keychain](https://developer.apple.com/documentation/security/keychain-services), [Apple App Sandbox](https://developer.apple.com/documentation/security/protecting-user-data-with-app-sandbox), [sandboxed file access](https://developer.apple.com/documentation/security/accessing-files-from-the-macos-app-sandbox).

```ts
// main/platform/macos/credentials.ts — implements shared CredentialStore
await credentialStore.set({ accountId, key: CredentialKey.RefreshToken, value: token });
// Adapter stores the value in Keychain; feature UI never receives the token.
```

**DESKMAC-03 MUST:** Direct-download releases use the intended Developer ID identity, hardened runtime, notarization/stapling and Gatekeeper install proof on the final artifact. Mac App Store releases use their own signing, sandbox entitlements, review and update path; do not use the direct-download updater there. Verify nested native modules for each selected CPU architecture and an A→B upgrade. Mac App Store builds also need a separate crash strategy because Electron's `crashReporter` is unavailable there. [Electron crashReporter](https://www.electronjs.org/docs/latest/api/crash-reporter). [Apple notarization](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution), [Electron signing](https://www.electronjs.org/docs/latest/tutorial/code-signing), [Electron Mac App Store](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide/).

```text
Direct .dmg: build → sign → notarize/staple → download → Gatekeeper/install/upgrade smoke
Store: sign/provision + entitlements → submit/review → Store-managed rollout
```

**DESKMAC-04 SHOULD:** When a product explicitly needs document ownership, login helpers, managed configuration or system search, implement those behind the shared [optional capability](../06-optional-capabilities.md). Native Mac choices include `NSDocument`, `SMAppService`, managed configuration and Core Spotlight; test their lifecycle and removal instead of adding them by default. [NSDocument](https://developer.apple.com/documentation/appkit/nsdocument), [Service Management](https://developer.apple.com/documentation/servicemanagement/smappservice), [Core Spotlight](https://developer.apple.com/documentation/corespotlight/adding-your-app-s-content-to-spotlight-indexes).

```ts
// main/platform/macos/search.ts — only if system search is selected
await searchIndex.upsert({ id: orderId, title: safeTitle, intent: { type: DesktopIntent.OpenOrder, orderId } });
```

**Verification:** packaged app window/menu/URL/file behavior, VoiceOver/keyboard/RTL, Keychain and file access, signing/notarization or Store validation, install/upgrade and account removal.
