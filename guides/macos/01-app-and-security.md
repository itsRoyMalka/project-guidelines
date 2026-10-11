# macOS desktop app profile

**Scope:** installable macOS apps. This is a platform overlay: [FE architecture](../frontend/01-architecture.md), [state](../frontend/02-state-and-forms.md), [UI/DS](../frontend/03-ui-and-accessibility.md), [contracts](../backend/02-api-contracts.md), [security](../cross-cutting/01-security.md), [TypeScript](../04-typescript.md) and [repo boundaries](../03-repository.md) remain the owners of their shared rules. Local business logic and sync use the [local data guide](05-local-data-and-sync.md); document/managed/helper/search needs use [optional capabilities](06-optional-capabilities.md). Do not copy those rules into this profile.

**Selected starting point:** Electron + TypeScript + React when an installable desktop product benefits from the existing web stack. This is a project choice, not an industry requirement. Choose Tauri when its Rust core, smaller distribution and OS webview tradeoffs fit the team; choose SwiftUI/AppKit for deep Mac-first native UI or platform integration. Record runtime, supported macOS versions, direct download versus Mac App Store, native dependencies and a revisit trigger in the architecture brief. [Electron processes](https://www.electronjs.org/docs/latest/tutorial/process-model), [Tauri architecture](https://v2.tauri.app/concept/architecture/), [Apple SwiftUI](https://developer.apple.com/documentation/technologyoverviews/swiftui).

**MAC-01 MUST:** The app owns three explicit boundaries: privileged `main` for lifecycle and OS access, a narrow `preload` bridge, and an unprivileged `renderer` following the existing FE feature flow. Feature UI calls typed app capabilities; it never imports Electron, Node or native plugins. Heavy/crash-prone work uses a worker/utility process when measurement justifies it.

```text
apps/desktop/src/
  main/{app,windows,intents,ipc,storage}/
  preload/bridge.ts
  shared/{desktop.const,desktop.contract}.ts # browser-safe types and channel IDs
  renderer/{app,pages,features,shared}/  # same FE ownership as web
apps/e2e/desktop/
```

**MAC-02 MUST:** Define one typed bridge method per user capability and one shared channel/intent declaration. `preload` transports only allowed data; `main` validates caller frame and input, plus identity/scope and OS permission when the action requires them. Never expose `ipcRenderer`, a generic `send/invoke`, a filesystem path API or an unrestricted shell. Renderer input is untrusted even when the window loads packaged code. [Electron IPC](https://www.electronjs.org/docs/latest/tutorial/ipc), [context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation), [security checklist](https://www.electronjs.org/docs/latest/tutorial/security/).

```ts
// shared/desktop.const.ts — declaration source, no Electron import
export const DesktopChannel = { SaveExport: 'desktop:save-export' } as const;
// preload/bridge.ts — project-owned narrow API
contextBridge.exposeInMainWorld('desktop', {
  saveExport: (input: SaveExportInput) => ipcRenderer.invoke(DesktopChannel.SaveExport, input),
});
// main/ipc/save-export.ts — excerpt; selected schema bounds filename, type and bytes
ipcMain.handle(DesktopChannel.SaveExport, async (event, raw: unknown) => {
  requireAppMainFrame(event.senderFrame);
  const input = saveExportSchema.parse(raw);
  await requireExportAccess(input.orderId); // trusted session, not renderer assertion
  return saveThroughNativeDialog(input); // main owns dialog and file write
});
```

`SaveExportInput`, `saveExportSchema` and the authorization check belong to the app; the selected project must implement and test them. The renderer receives success/cancel/error, not a privileged path or raw OS API. Put reusable contract/types in a package only when another deployable really consumes them.

**MAC-03 MUST:** Load packaged trusted UI with a restrictive CSP and a reviewed app protocol. Keep `sandbox: true`, `contextIsolation: true` and `nodeIntegration: false`; restrict navigation, new windows, permissions and external URLs. Isolate any necessary remote or untrusted document content and give it no privileged bridge. Electron renderer sandboxing and Apple's App Sandbox are different controls; select Apple entitlements for the distribution channel separately. [Electron security](https://www.electronjs.org/docs/latest/tutorial/security/), [Apple App Sandbox](https://developer.apple.com/documentation/security/protecting-user-data-with-app-sandbox).

```ts
// main/windows/create-main-window.ts — Electron window excerpt
const window = new BrowserWindow({ webPreferences: {
  preload: preloadPath,
  sandbox: true,
  contextIsolation: true,
  nodeIntegration: false,
} });
// App CSP and allowlisted navigation/new-window/permission handlers are registered here.
```

**MAC-04 MUST:** Declare each OS capability and permission at its owning main-process adapter. Request access in context; handle denied/revoked/unavailable states. Use native open/save panels for user-selected files and security-scoped access when the selected sandbox requires persistence. Keep small credentials in an OS Keychain-backed port; `safeStorage` alone is not a complete vault or database encryption policy. Store ordinary local state under the app-owned support directory, with account scoping, migration and recovery when durable. [Apple file access](https://developer.apple.com/documentation/security/accessing-files-from-the-macos-app-sandbox), [Keychain](https://developer.apple.com/documentation/security/keychain-services), [Electron safeStorage](https://www.electronjs.org/docs/latest/api/safe-storage).

```ts
// main/storage/session.ts — project-owned Keychain port
await credentialStore.set({ accountId, key: CredentialKey.RefreshToken, value: token });
// Logout: revoke remote session, remove account-scoped credential and protected cache.
```

**MAC-05 MUST:** Select the app's data mode—remote-only, local-only, remote-owned cached data, or offline-capable sync—in the architecture brief. Apply the [local service, database and sync guide](05-local-data-and-sync.md) only for the selected capabilities; a desktop binary does not automatically need a local backend or database.

```text
Remote-only: renderer Query cache → API contract → backend owner
Local-only: renderer → typed IPC → local operations → local database
Sync: renderer → typed IPC → local operations/database ↔ remote API owner
```

**MAC-06 MUST:** Select an explicit desktop identity topology. When the native app performs OAuth, use the system browser with authorization code + PKCE, validate state and callback origin, and store persistent credentials through the main-owned Keychain port. Do not embed a login webview or give tokens to feature UI by default. Logout/account switch revokes the session and clears protected local data, pending writes and diagnostics. A server/BFF session is valid when its actual cookie/origin/CSRF behavior is proven. [Native-app OAuth](https://www.rfc-editor.org/rfc/rfc8252), [shared identity](../cross-cutting/recipes/identity.md).

```ts
// main/identity/login.ts — project-owned identity adapter
const attempt = await identity.beginPkce();
await systemBrowser.openAllowed(attempt.authorizationUrl);
// Validated callback: identity.completeCallback(rawUrl, attempt.state, attempt.verifier)
// Persist the resulting credential through credentialStore, never a renderer localStorage.
```

**Verification:** trace one feature from renderer through bridge/main to the OS or API; test invalid IPC sender/payload, denied permission, identity callback/revocation, account switch, untrusted navigation and cold-start storage upgrade. **Exception:** Tauri/native implementations keep the same capability and trust boundaries but use their platform APIs; record differences in the selected profile. No Electron factory or native adapter in this handbook is a shipped library.
