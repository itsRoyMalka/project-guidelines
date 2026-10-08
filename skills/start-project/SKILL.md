---
name: start-project
description: Turn an MVP PRD into a tailored runnable project, clarifying consequential choices and verifying the starter against this complete handbook.
---

# PRD to project

Read [USAGE](../../USAGE.md), [governance](../../guides/00-governance.md) and [SETUP rules](../../guides/08-project-setup.md) from the pinned checkout on each run. Create code only in the target repository. A planning-only request stops before scaffolding and says so.

1. Read PRD and target files. Extract first journey, roles, data, platforms, integrations, constraints and unknowns. Ask a small batch of boundary-changing questions with recommended defaults; continue independent work while waiting.
2. Select [architecture](../../guides/01-architecture.md), [stack](../../guides/02-stack.md), [profile](../../guides/profiles/README.md) and [repo shape](../../guides/03-repository.md). Record reasons, alternatives and revisit triggers. Verify actual tool versions; choose only needed services/MFE/mobile/infrastructure.
3. Read the affected guides from [the map](../../guides/README.md) before implementing. Set the target's handbook revision/profile/links, project coordinates and exceptions. Establish first issues under [project work](../../guides/cross-cutting/07-project-work.md); report unavailable access with exact drafts.
4. Build the selected starter: runtime composition, a thin feature path, owned contracts/data, safe config/local dependencies, tests, CI and relevant delivery source. Follow the [worked setup](../../guides/recipes/project-setup.md); do not overwrite existing work or create empty optional layers.
5. Verify clean install/start/build/checks and the first journey. Report exact proof, gaps, decisions and next ticket. A built welcome page alone is not ready; deployment follows the target's actual authorization and delivery rules.
