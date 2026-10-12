# Project Guidelines

Short rules and small examples for agents building a product from a PRD and maintaining it afterward. This repository contains guides and skills; generated application code belongs in the target project.

**Edition: 2026-10-11.** [The guide map](guides/README.md) identifies the current owner for each topic. Examples describe project-owned patterns; adopting projects must implement and verify them against their chosen stack.

| Task | Start here |
| --- | --- |
| PRD → runnable new project | [start-project](skills/start-project/SKILL.md) |
| Understand existing code | [read-project](skills/read-project/SKILL.md) |
| Ticket/sprint/handoff | [manage-project-work](skills/manage-project-work/SKILL.md) |
| Feature or fix | [plan](skills/plan-change/SKILL.md) → [implement](skills/implement-feature/SKILL.md) → [verify](skills/verify-change/SKILL.md) |
| Review | [review-change](skills/review-change/SKILL.md) |
| Incident | [diagnose-incident](skills/diagnose-incident/SKILL.md) |

Read [usage](USAGE.md) and [governance](guides/00-governance.md), then select only relevant subjects from [the guide map](guides/README.md). [One feature](guides/06-reference-flow.md) connects contracts, API, UI and tests.

Core profiles cover TypeScript web/backend, Python backend, React Native mobile, desktop (Windows, macOS and Linux), and analytics. Backend guidance separates shared rules from TypeScript and Python implementation guides. Load optional tenancy, RPC, events, background jobs, cache, vault and DocStore only when needed. AI evaluation, complex offline synchronization, embedded/ML systems and jurisdiction-specific compliance need a project extension.

**Authority:** user/host/target instructions → canonical guides → selected profiles. Recipes illustrate; skills route work. Factory snippets describe project-owned patterns and do not claim an installed framework or tested implementation.

**Standalone:** all handbook conventions are defined here. Public links are optional further reading. [Project-owned APIs](guides/recipes/project-owned-apis.md) maps custom helpers to their local contracts and failure cases. Read [contributing](CONTRIBUTING.md) and [publication](PUBLICATION.md) before distributing changes.
