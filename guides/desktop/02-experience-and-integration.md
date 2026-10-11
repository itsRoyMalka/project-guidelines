# Desktop experience and system integration

**Scope:** shared desktop UI and OS entry points across Windows, macOS and Linux. Reuse [FE feature structure](../frontend/01-architecture.md), [DS/accessibility/RTL/localization](../frontend/03-ui-and-accessibility.md), [routing](../frontend/05-routing-and-access.md) and [time](../frontend/10-time-and-dates.md). The renderer remains an ordinary FE feature consumer; `main` owns native commands and events.

**DESKUX-01 MUST:** App composition owns windows and their lifecycle. Restore valid bounds, support resize/fullscreen, and keep a usable app after the last window closes according to the selected OS behavior. OS activation reopens or focuses the appropriate window; logout removes protected window state. Do not hide a live privileged window in the background without a product reason. [Electron app lifecycle](https://www.electronjs.org/docs/latest/api/app).

```ts
// main/app/lifecycle.ts — platform policy owns close/activation behavior
app.on('window-all-closed', () => { if (platformPolicy.quitOnLastWindow) app.quit(); });
app.on('activate', () => focusOrCreateMainWindow());
// Restore clamped bounds so a disconnected display cannot strand the window.
```

**DESKUX-02 MUST:** Native app menus are the command source for standard actions; use OS roles/shortcuts and place Settings according to each OS convention. Feature commands have typed IDs and a single handler used by menu, shortcut and UI entry points. Global shortcuts and a tray/menu-bar-only app need an explicit product decision. [Electron menus](https://www.electronjs.org/docs/latest/tutorial/menus).

```ts
// main/app/menu.ts — main owns native command registration
Menu.setApplicationMenu(Menu.buildFromTemplate([
  ...(process.platform === 'darwin' ? [{ role: 'appMenu' as const }] : []),
  { role: 'fileMenu' }, { role: 'editMenu' },
  { role: 'viewMenu' }, { role: 'windowMenu' },
]));
// Feature menu item: dispatchCommand(DesktopCommand.OpenOrder); no second business path.
```

**DESKUX-03 MUST:** Register each OS protocol/file-open entry path during startup, before dispatching intents. Parse and allowlist scheme, host, action and ID; queue one typed intent until a window is ready. Cold and warm launches use the same route handler; auth guards preserve only a validated internal destination. Never pass raw URLs or file paths directly into feature logic. [Electron deep links](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app).

```ts
// main/intents/open-url.ts — shared parser; OS startup adapter supplies raw URL
function receiveOpenUrl(rawUrl: string) {
  const orderId = parseAllowedOrderLink(rawUrl); // returns an ID or null
  if (orderId) queueIntent({ type: DesktopIntent.OpenOrder, orderId });
}
// renderer/app/desktop-intents.ts: OpenOrder → navigate(orderDetailsLink(orderId)).
```

**DESKUX-04 MUST:** User file access goes through a purpose-named capability and native dialog; drag/drop is an enhancement with an accessible picker alternative. Validate file type, size and content before use. Clipboard and external links get narrow capabilities and safe allowlists; a web page never receives unrestricted OS handles. [Electron dialog](https://www.electronjs.org/docs/latest/api/dialog).

```ts
// renderer/features/orders/export/ui/export-order.tsx — DS component calls bridge
const outcome = await window.desktop.saveExport({ orderId, fileName, pdfBytes });
if (outcome.status === ExportStatus.Cancelled) return;
// Main validates input/access, opens the save panel and writes the selected file.
```

**DESKUX-05 MUST:** Reuse the web DS's semantics/tokens where meaningful and supply platform components only for real OS behavior. Verify keyboard navigation, the platform screen reader and keyboard access, long text, RTL, dark mode, reduced motion and system text scaling on every supported OS. Native menu labels and commands use the same localization owner as the app; feature copy remains feature-owned. [Electron dark mode](https://www.electronjs.org/docs/latest/tutorial/dark-mode).

```tsx
// renderer/features/orders/details/ui/order-details.tsx — existing FE/DS rules apply
return <Page title={t('details.title')} testId={OrderTestId.Details}>
  <Button testId={OrderTestId.ExportButton} onClick={exportOrder}>{t('details.export')}</Button>
</Page>;
// Native menu exposes the same command with a localized label and shortcut.
```

**DESKUX-06 MUST:** Notifications reveal only safe text, respect permission/focus preferences and route clicks through validated intents. An OS secondary entry is optional and must not become the only route to an important action. [Electron notifications](https://www.electronjs.org/docs/latest/tutorial/notifications).

```ts
// main/notifications/order-ready.ts — no order contents or customer PII
notify({ title: t('notification.orderReady'), intent: { type: DesktopIntent.OpenOrder, orderId } });
// Click handling goes through the same validated intent router as deep links.
```

**DESKUX-07 MUST:** On sleep, wake, network change and app resume, reconcile clocks, sockets, auth and pending work instead of assuming timers ran. Bound local background work; work that must finish durably belongs on the backend or a proven OS-supported mechanism. Show offline/unknown outcomes explicitly. [Electron powerMonitor](https://www.electronjs.org/docs/latest/api/power-monitor/).

```ts
// main/app/power.ts — lifecycle event; app adapter owns reconnection
powerMonitor.on('resume', () => desktopLifecycle.reconcileAfterWake());
// Renderer Query refreshes scoped data after the app reports resumed connectivity.
```

**DESKUX-08 MUST:** One app-level registry owns windows; the intent router handles second-launch events. Key content windows by kind/resource so opening the same target focuses or deliberately creates a new view. Windows own navigation and presentation state; the selected API or local service owns shared data. For editable work, persist recoverable drafts through the feature's declared draft owner rather than relying on window-state restoration. Restore only valid, account-scoped routes and visible-screen bounds; clear protected state on logout. [Electron app events](https://www.electronjs.org/docs/latest/api/app), [FE draft ownership](../frontend/02-state-and-forms.md).

```ts
// main/windows/registry.ts — project-owned window identity
windows.openOrFocus({ kind: WindowKind.OrderDetails, resourceId: orderId });
// renderer/features/orders/draft/model/draft.ts — only when draft recovery is selected
await draftStore.save({ accountId, draftId, value: validatedDraft });
```

**Verification:** exercise direct links cold/warm/second launch, two windows on the same resource, draft recovery after crash, account switch, window close/reopen, menu/shortcut parity, denied file/notification access, platform screen readers and RTL, sleep/wake and network loss. Use the [selected OS profile](07-platform-profiles.md) for OS lifecycle and integration differences. **Exception:** Tauri/native apps use equivalent native commands/intents and keep the same FE/OS ownership when a web renderer exists.
