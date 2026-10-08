# Project, tickets and two-week sprints

**Applies to:** product work by people and AI agents in a consuming project that adopts this workflow. The target repository identifies its authoritative GitHub Project (or equivalent tracker), issue repository, ticket-key prefix and accountable product owner. User instructions and applicable local policy retain their authority. This guide owns project-work rules; [Git collaboration](08-git-collaboration.md) owns branches, commits and PRs.

## Set up the work register

**PROJ-01 MUST:** Use one authoritative product board with issues as work items and linked PRs as implementation. Record tracker, issue location, key mapping and owner in agent instructions; fields are type, status, priority, area, owner and iteration.

**PROJ-02 MUST:** Ticket types are feature, bug, chore, spike and incident; epics group independently deliverable children. A spike has a question/time box; incidents have impact/recovery. `fix` is a commit type, not another ticket type.

## Write a useful ticket

**PROJ-03 MUST:** Use `<KEY>: <outcome/problem>` titles. The ticket holds outcome, acceptance including meaningful failures, dependencies, owner and target Done proof. Bugs include reproduction and actual/expected behavior.

**PROJ-04 MUST:** Use Backlog → Ready → In Progress → In Review → Ready to Release → Done; blockers have a separate reason/owner. Ready needs clear outcome/acceptance/dependencies. Done needs target proof, not merge. Disable GitHub linked-PR auto-close and premature closed→Done automation; verify with a partial PR.

## Plan and run the sprint

**PROJ-05 MUST:** Work in two-week sprints with one goal and capacity-based Ready scope. Track explicit scope trades, review outcomes, replan carryover and choose an improvement. Release whenever ready; sprints are not deployment gates.

## Work from and update the issue

**PROJ-06 MUST:** Search/read the current issue, comments and linked PR before coding; create/link a missing issue when access allows. Update meaningful transitions and never silently redefine acceptance. Without tracker access, leave exact drafts and report the unmet tracker gate.

**PROJ-07 MUST:** Handoff in the issue: next actor, branch/PR/revision, completed behavior, actual checks, remaining work, blockers and next action. The next agent verifies checkout/status before taking over; preserve one accountable owner.

**PROJ-08 MUST:** Record acceptance proof, target release/document revision, results and remaining limitations before Done. The reviewer/owner confirms the agreed outcome; inaccessible or skipped checks are not passes.

## Small working example

```text
Project: Orders · Sprint: 8–21 Oct · Goal: eligible customers can cancel safely
#123 → ODR-123: Customer can cancel an eligible order [feature]
Acceptance: eligible order cancels and UI confirms; ineligible order shows a reason.
Fields: owner Orders team · priority High · area Orders · status In Progress
Branch/PR: ODR-123/feat-cancel-order · PR #482 (linked to #123)
Handoff: API merged; UI at abc123; integration test passed; UI test remains; next agent finishes UI and requests review.
Done: scenarios verified on production release 1.4.2; issue closed after evidence is recorded.
```

## Enforcement and exceptions

The consuming repository's agent entrypoint points to this guide and supplies real project coordinates. Use issue forms/templates for the ticket shape, project workflows for mechanical field updates and a [required Git check](08-git-collaboration.md) for issue/PR linkage. The [ticket, sprint and handoff examples](recipes/project-work.md) show an adoption shape. Automation assists but cannot prove that acceptance or a handoff comment is truthful; a reviewer checks those. The project owner periodically reviews unassigned, blocked, stale and carried-over work.

**Rationale:** A single current issue gives the team and a new agent the same scope and next action. Two-week goals make capacity and scope changes visible while release stays independent of the calendar. Target-based Done prevents merged code from being mistaken for delivered behavior.

**Verification:** A new agent with no prior chat can find the current ticket, branch/PR, verified work and next action. A sample sprint has a goal, selected issues, scope trades and explicit carryover. A sample Done ticket links observable proof in its agreed target. A PR without a valid project issue fails the gate; a linked partial PR merging does not close or mark its issue Done.

**Exception criteria:** During an active incident, restoration may start while logging is established; create the incident issue during response and reconcile it before the change is complete. If tracker write access is unavailable, provide the exact draft/update in the handoff and state that it was not applied. Equivalent tracker fields/forms are valid when the same issue-first, handoff and Done behavior is preserved. A different cadence requires an explicit project decision under [GOV-05](../00-governance.md), not an ad hoc skipped sprint.
