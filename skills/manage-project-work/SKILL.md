---
name: manage-project-work
description: Create and maintain product tickets, two-week sprints, status, evidence and handoffs in the authoritative project tracker.
---

Read [usage](../../USAGE.md), [governance](../../guides/00-governance.md), and the owning [project-work guide](../../guides/cross-cutting/07-project-work.md). This skill requires the complete pinned handbook checkout; target instructions supply the real project, issue repository, key convention and access.

# Manage project work

For a new ticket, search first. Create a concise outcome, acceptance criteria and type-specific evidence; set owner, priority, area and status. Add an iteration only when committed during sprint planning. For sprint planning, state one goal, select Ready issues against actual capacity and record dependencies. During the sprint, keep blockers and scope trades visible; at close, review outcomes and explicitly replan unfinished issues.

For an active task, read current issue/PR discussion before acting. Update status at meaningful transitions. Keep the issue description as the current agreed scope; use short comments for decisions, blockers and handoffs. A handoff includes branch/PR/revision, verified work, remaining work and next action. Record target verification before Done. Follow [Git rules](../../guides/cross-cutting/08-git-collaboration.md) for keys and links.

If tracker access is unavailable, supply the exact proposed ticket/update and say it was not applied. Do not infer current board state from an earlier chat or claim a check passed without evidence. External writes follow the actual user/task and target permissions; this skill does not grant access.


Apply PROJ-09–13 for task sizing, claims, collision handling and recovery. Before editing, record and read back the active actor/branch claim; resolve competing claims. Keep routine plans in the issue and post only meaningful transition updates. Use the [documentation-ticket and handoff examples](../../guides/cross-cutting/recipes/project-work.md) when the deliverable is documentation; Done follows its stated target, not an invented deployment.

For explicitly requested historical tracking, read the [backfill protocol](../../guides/cross-cutting/recipes/project-backfill.md). Plan the commit/outcome mapping before creating records; preserve real chronology and public/private separation. A request to improve these guidelines alone does not authorize a backfill or board creation.
