# Select desktop platform profiles

The [shared desktop rules](01-app-and-security.md) own Electron boundaries, FE reuse, local data, quality and optional capabilities. Load only the OS profiles selected in the architecture brief:

| Target | Profile | Required decision |
| --- | --- | --- |
| macOS | [macOS](macos/01-platform.md) | Direct download or Mac App Store; version/CPU matrix |
| Windows | [Windows](windows/01-platform.md) | Installer/MSIX or Microsoft Store; version/CPU matrix |
| Linux | [Linux](linux/01-platform.md) | Distribution/desktop/package channel; version/CPU matrix |

```text
apps/desktop/src/main/
  platform/macos/    # only if macOS selected
  platform/windows/  # only if Windows selected
  platform/linux/    # only if Linux selected
  intents/           # shared typed intent router
  ipc/               # shared validated capabilities
```

One product can target one, two or three OSes. The shared contracts and feature code stay in `apps/desktop/src/{shared,renderer,main/features}`; only OS adapters and release recipes vary. A platform is supported only after its installed artifact, native behavior and upgrade path are verified.

**Rule-ID migration:** The first Mac-only draft used `MAC-`, `MACUX-`, `MACQ-`, `MACDATA-` and `MACOPT-` IDs. Their same-number shared desktop successors are `DESK-`, `DESKUX-`, `DESKQ-`, `DESKDATA-` and `DESKOPT-`. Mac-only requirements moved to `DESKMAC-`; Windows and Linux requirements use `DESKWIN-` and `DESKLINUX-`.
