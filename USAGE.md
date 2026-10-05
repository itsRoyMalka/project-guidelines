# Use the handbook from another project

**Supported delivery:** a complete checkout or directory snapshot at a recorded revision. Skills are workflows within this book; copying one skill folder alone is not supported. No global installation is required.

1. Make the whole handbook available to the agent as a readable local directory. Record its path and commit in the consuming project's instructions/architecture note.
2. Have the agent open the handbook README and governance, select a profile, then read the matching skill by its actual path. Relative links resolve from the containing document, never from the target app's working directory.
3. Keep target-app edits in the target app. Handbook guidance neither creates deployment permission nor overrides applicable host/user/target-repo instructions.
4. If the directory or linked resource is unavailable, report the exact missing reference. Continue only work that does not depend on it; never pretend missing guidance was read.

Example instruction for a consuming project (substitute a verified path/revision):

```text
Shared handbook: <absolute path to complete project-guidelines checkout>
Adopted revision: <actual commit>
Profiles: TypeScript split web/API
Read that checkout's README.md and guides/00-governance.md, then the relevant skill.
Local exceptions: docs/decisions/handbook-exceptions.md
```

The complete folder can be copied to another location without changing its internal links. Optional agent-host discovery configuration belongs in the consuming environment and must preserve access to the complete checkout. Standalone distributable skill bundles are outside this edition's supported interface.

## Update and ownership

The consuming project's technical owner records revision, profiles and exceptions. The handbook maintainer reviews source/security changes and at least quarterly; the project owner schedules adoption by impact. A commit change never silently changes an already pinned consumer. Retired IDs keep a pointer to their successor. Current normative content is in `guides/`; `reviews/` describes old snapshots.

A task may use general engineering knowledge, but mark consequential assumptions and verify platform-specific behavior. For a meaningful change, report adopted rules, actual checks and remaining gaps. See [templates](guides/templates/decisions.md).
