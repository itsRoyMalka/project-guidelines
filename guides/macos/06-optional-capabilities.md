# Optional macOS capabilities

**Scope:** select only capabilities named by a product journey or enterprise deployment requirement. The [macOS profile](01-app-and-security.md) still owns process security; [OS integration](02-experience-and-integration.md), [local data](05-local-data-and-sync.md) and [delivery](03-quality-and-delivery.md) remain their rule owners. Each example below is a project-owned interface, not an Electron or Apple SDK export.

| Need | Add |
| --- | --- |
| People create/edit files as the product | Document lifecycle |
| Organization manages installation or policy | Managed deployment |
| Work must start at login or continue outside a window | Login item/background helper |
| People need app content in system search/Finder | Search/Finder integration |

**MACOPT-01 MUST:** For a document-based app, give each editable document an owner, versioned format, explicit dirty/saved state, atomic save/autosave, undo/redo and external-change conflict handling. Use the native File menu/print locations when offered; test interrupted saves and reopen/restore. A native Swift app can adopt `NSDocument`; an Electron app implements the equivalent behavior behind a typed document capability. [Apple NSDocument](https://developer.apple.com/documentation/appkit/nsdocument), [printing guidance](https://developer.apple.com/design/human-interface-guidelines/printing).

```text
apps/desktop/src/main/documents/{contract,store,watch,commands}.ts
apps/desktop/src/renderer/features/editor/{api,ui,model}/
```

```ts
// main/documents/store.ts — app-owned save boundary
await documentStore.saveAtomic({ documentId, expectedVersion, content });
// A changed on-disk version returns a conflict; UI keeps the unsaved draft.
// Undo/redo share the same command owner as Edit menu actions.
```

**MACOPT-02 MUST:** For a managed deployment, declare which settings an administrator controls, their precedence over user preferences, supported OS/MDM mechanism and update/removal behavior. Parse managed configuration as untrusted input; obtain managed identities/certificates through the selected OS facility instead of embedding secrets in ordinary config. Test installation, sign-in, proxy/certificate access, policy changes and removal on a managed Mac. Keep product/server authorization authoritative. [Apple ManagedApp](https://developer.apple.com/documentation/ManagedApp), [managed configuration](https://developer.apple.com/documentation/devicemanagement/configuring-managed-apps-and-extensions).

```ts
// main/config/managed.ts — project-owned adapter and schema
const managed = managedConfigSchema.parse(await managedConfig.read());
const effective = resolveConfig({ defaults, userPreferences, managed });
// Managed fields are locked in Settings; unsupported/invalid policy fails visibly.
```

**MACOPT-03 MUST:** When a background helper is selected, use a login item/agent only for a named local task that must run without an app window. Record start/stop trigger, user or administrator control, entitlements, signing identity, resource limits, update compatibility and removal. Keep feature work behind a narrow capability; a helper is not a substitute for backend-owned durable work. [Apple Service Management](https://developer.apple.com/documentation/servicemanagement/smappservice), [Electron login item settings](https://www.electronjs.org/docs/latest/api/app).

```ts
// main/capabilities/login-item.ts — app port; adapter checks OS status
await loginItem.setEnabled(preferences.launchAtLogin);
// Logout/disable/uninstall stops or unregisters work according to selected policy.
```

**MACOPT-04 MUST:** When system search/Finder integration is selected, index only content the active account may reveal, with minimal safe metadata and a typed intent back into the app. Update/remove entries after edits, deletes and logout. Finder extensions or file associations have their own selected entitlement, installation and recovery proof; they never gain the renderer's unrestricted data access. [Apple Core Spotlight](https://developer.apple.com/documentation/corespotlight/adding-your-app-s-content-to-spotlight-indexes), [Apple Spotlight integration](https://developer.apple.com/documentation/appintents/spotlight).

```ts
// main/capabilities/search-index.ts — project-owned OS adapter
await searchIndex.upsert({ id: orderId, title: safeTitle, intent: { type: DesktopIntent.OpenOrder, orderId } });
await searchIndex.removeAccount(accountId); // logout or scope loss
```

**Verification:** select each capability in the architecture brief and prove its OS behavior on a packaged app, including denial, account change, upgrade and removal. **Exception:** omit the entire capability when no journey needs it. Tauri/native implementations use their own supported APIs with the same ownership and proof.
