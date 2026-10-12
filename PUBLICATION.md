# Publishing a standalone handbook

The distributable is the complete handbook: entrypoints, guides, profiles, recipes and skills. It has no dependency on a research archive or private project. Public framework/specification links are optional; handbook behavior is defined locally.

## Release checks

- Review current files and proposed Git history for private content, credentials and personal metadata. Deleting a file in a later commit does not remove older versions.
- If prior history cannot be published, prepare a new directory containing only the reviewed file allowlist, initialize fresh Git history and inspect that repository independently. Do not copy `.git`, remotes, hooks, caches, backups or local settings.
- Confirm a license is present and approved before describing the release as open source. Review rights to any included third-party material and preserve required notices.
- Verify links, rule IDs, examples and a fresh-reader walkthrough of setup, backend, frontend and E2E flows. Public API documentation may still be needed to implement a chosen library version.
- Review the destination's issues, PRs, releases, attachments, branches, tags, wiki, discussions, Pages and workflow artifacts before making an existing repository public. A clean default branch is insufficient.
- Publish only the reviewed history. Keep private archives outside the publication directory. Do not push private refs or tags to a public remote.

A release report records revision, checks performed and known gaps without including the sensitive findings themselves. A pattern scan is an aid, not proof that all sensitive or restricted material has been found.
