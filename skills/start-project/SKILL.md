---
name: start-project
description: Turn an MVP PRD into a tailored runnable project, clarifying consequential choices and verifying the starter against this complete handbook.
---

# PRD to project

Read [USAGE](../../USAGE.md), [governance](../../guides/00-governance.md) and [SETUP rules](../../guides/08-project-setup.md) from the pinned checkout on each run. Create code only in the target repository. A planning-only request stops before scaffolding and says so.

1. Read PRD and target files. Extract first journey, roles, data, platforms, integrations, constraints and unknowns. Ask a small batch of boundary-changing questions with recommended defaults; continue independent work while waiting.
2. Select [architecture](../../guides/01-architecture.md), [stack](../../guides/02-stack.md), [profile](../../guides/profiles/README.md) and [repo shape](../../guides/03-repository.md). Record reasons, alternatives and revisit triggers. Verify actual tool versions; choose only needed services/MFE/mobile/desktop/infrastructure. A desktop product loads the [desktop overlay](../../guides/desktop/01-app-and-security.md) and loads each selected [OS profile](../../guides/desktop/07-platform-profiles.md), recording supported versions, architectures and distribution channels.
3. Read the affected guides from [the map](../../guides/README.md) before implementing. Create or connect the target Git repository and product Project using the [Git/Project setup recipe](../../guides/cross-cutting/recipes/git-project-setup.md). Record handbook revision/profile, real project coordinates, key mapping and exceptions; establish the first issues. Missing host/admin access leaves an exact proposed configuration and an unmet gate.
4. Build the selected starter: runtime composition, a thin feature path, owned contracts/data, safe config/local dependencies, tests, CI and relevant delivery source. Follow the [worked setup](../../guides/recipes/project-setup.md); do not overwrite existing work or create empty optional layers. Once checks report stable names, configure branch protection and the ticket/PR gate before ordinary feature work.
5. Verify clean install/start/build/checks and the first journey **plus** the Git/Project trial matrix. Report actual proof, gaps, decisions and next ticket. A built welcome page or a newly created Project alone is not ready; deployment follows the target's actual authorization and delivery rules.
