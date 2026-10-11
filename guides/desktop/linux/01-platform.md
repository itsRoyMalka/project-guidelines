# Linux desktop profile

**Scope:** optional overlay after the shared [desktop profile](../01-app-and-security.md) only when Linux is a selected target. Record supported distributions, desktop environments, CPU architectures and package channels; Linux support is not implied by choosing Electron.

**DESKLINUX-01 MUST:** Register launch/protocol/file behavior through the selected package and `.desktop` entry. Validate command-line/second-instance input into the shared typed intent router. Choose last-window and tray behavior explicitly because desktop environment support varies. [Desktop Entry Specification](https://specifications.freedesktop.org/desktop-entry/latest/), [Electron app events](https://www.electronjs.org/docs/latest/api/app).

```ts
// main/platform/linux/intents.ts — OS adapter only
app.on('second-instance', (_event, argv) => {
  for (const rawUrl of findAllowedProtocolArgs(argv)) receiveExternalUrl(rawUrl);
});
```

**DESKLINUX-02 MUST:** Place data/config/cache under the selected runtime's XDG-aware app locations. Keep persistent credentials in a vetted Secret Service/keyring adapter when available; if missing or locked, fail closed or use an explicit session-only mode. Never silently save tokens as plaintext. Sandboxed packages use portals for selected file/system access. [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir/0.8/), [XDG portals](https://flatpak.github.io/xdg-desktop-portal/docs/).

```ts
// main/platform/linux/credentials.ts — capability result is explicit
const store = await createCredentialStore();
if (store.status === CredentialStoreStatus.Unavailable) return requireSessionOnlySignIn();
```

**DESKLINUX-03 MUST:** Verify installation and upgrade through the selected distro repository, Flatpak/Snap or equivalent package channel. Electron core has no Linux `autoUpdater`; do not invent a parallel updater that bypasses the selected package manager. Test the final package on the declared distro/desktop matrix. [Electron autoUpdater](https://www.electronjs.org/docs/latest/api/auto-updater).

```text
Linux x64/.deb: package + desktop entry → clean install → launch/protocol → package-manager upgrade
```

**Verification:** installed app/protocol/portal behavior, screen reader/keyboard/RTL, keyring missing/locked states, upgrade and account cleanup on each supported distribution/channel.
