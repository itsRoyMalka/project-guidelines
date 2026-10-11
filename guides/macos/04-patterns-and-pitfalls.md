# Desktop pattern inventory and pitfalls

Use these patterns only for a demonstrated capability. The owning rules are [app/security](01-app-and-security.md), [experience](02-experience-and-integration.md), [local data/sync](05-local-data-and-sync.md), [quality/delivery](03-quality-and-delivery.md) and [optional capabilities](06-optional-capabilities.md); this inventory does not create a second policy owner.

| Need | Pattern | Avoid |
| --- | --- | --- |
| Renderer needs an OS action | **Capability bridge:** one typed method through preload, main validates and executes | Generic `ipc.invoke(channel, ...args)` exposed to features; Node in renderer |
| URL, file, Dock or notification opens content | **Intent router:** normalize to one typed app intent, queue until ready, then route | Each entry point mutating a different window or bypassing auth |
| Provider or OS API may change | **Port/adapter:** feature calls an app capability; Electron/Tauri/native adapter owns SDK | Importing Electron or a native plugin in a feature |
| Local persistence is needed | **Single local owner:** one process owns writes, migrations and account scope | Renderer and main writing the same database or unversioned persisted state |
| App has native and web controls | **Command registry:** one action ID/handler for menu, shortcut and UI | Separate business behavior for each trigger |
| User edits while offline | **Local outbox + remote change cursor:** persist intent, replay with stable ID, apply deltas atomically | Treating Query cache as durable intent; direct DB mirroring; silent last-write-wins |
| Multiple windows open the same content | **Window registry + draft owner:** route/focus by stable resource key; persist drafts separately | Two windows silently overwriting one another; treating window restore as draft recovery |
| User files are editable documents | **Document capability:** atomic save, version check and undo command owner | Ad hoc file writes that lose edits on crash or external change |
| Enterprise policy or OS helper is selected | **Managed adapter/helper port:** validate policy and control lifecycle | Hard-coded fleet settings or an invisible always-running privileged helper |

```ts
// renderer/features/orders/details/ui/export-order.tsx — capability bridge
await window.desktop.saveExport({ orderId, fileName, pdfBytes });
// main/ipc/save-export.ts validates caller, schema and access, then shows native panel.
```

```ts
// main/intents/route-intent.ts — one destination for OS entry points
dispatchIntent({ type: DesktopIntent.OpenOrder, orderId });
// Cold link, Dock item and notification click all use this route after validation.
```

**Review prompts:** Can compromised renderer code reach an unintended OS action? Do warm and cold entry points behave alike? Can a released binary read data written by the next one? Does the Mac menu do what the UI command does? Can a user recover after an interrupted update? Prove these with the [Mac quality guide](03-quality-and-delivery.md), not by adding layers merely to match the table.

Sources: [Electron context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation), [security](https://www.electronjs.org/docs/latest/tutorial/security/), [process model](https://www.electronjs.org/docs/latest/tutorial/process-model), [Apple macOS design](https://developer.apple.com/design/human-interface-guidelines/designing-for-macos/).
