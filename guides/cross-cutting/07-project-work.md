# Project, tickets and two-week sprints

**Applies to:** product work by people and AI agents in a consuming project that adopts this workflow. The target repository identifies its authoritative GitHub Project (or equivalent tracker), issue repository, ticket-key prefix and accountable product owner. User instructions and applicable local policy retain their authority. This guide owns project-work rules; [Git collaboration](08-git-collaboration.md) owns branches, commits and PRs.

## Set up the work register

**PROJ-01 MUST:** Use one authoritative product board with issues as work items and linked PRs as implementation. Record tracker, issue location, key mapping and owner in agent instructions; fields are type, status, priority, area, owner and iteration.

**PROJ-02 MUST:** Ticket types are feature, bug, chore, spike and incident; epics group independently deliverable children. A spike has a question/time box; incidents have impact/recovery. `fix` is a commit type, not another ticket type.

## Write a useful ticket

**PROJ-03 MUST:** Use `<KEY>: <outcome/problem>` titles. The ticket holds outcome, acceptance including meaningful failures, dependencies, owner and target Done proof. Bugs include reproduction and actual/expected behavior.

**PROJ-04 MUST:** Use Backlog → Ready → In Progress → In Review → Ready to Release → Done; blockers have a separate reason/owner. Ready needs clear outcome/acceptance/dependencies. Done needs the stated target proof. Documentation-only work may be complete at the reviewed merged revision after its acceptance checks; deployed behavior needs its selected deployment target. Use Ready to Release only when a separate release/target step remains. Disable GitHub linked-PR auto-close and premature closed→Done automation; verify with a partial PR.

## Plan and run the sprint

**PROJ-05 MUST:** Work in two-week sprints with one goal and capacity-based Ready scope. Track explicit scope trades, review outcomes, replan carryover and choose an improvement. Release whenever ready; sprints are not deployment gates.

## Work from and update the issue

**PROJ-06 MUST:** Search/read the current issue, comments and linked PR before coding; create/link a missing issue when access allows. Update meaningful transitions and never silently redefine acceptance. Without tracker access, leave exact drafts and report the unmet tracker gate.

**PROJ-07 MUST:** Handoff in the issue: next actor, branch/PR/revision, completed behavior, actual checks, remaining work, blockers and next action. The next agent verifies checkout/status before taking over; preserve one accountable owner.

**PROJ-08 MUST:** Record acceptance proof, target release/document revision, results and remaining limitations before Done. The reviewer/owner confirms the agreed outcome; inaccessible or skipped checks are not passes.

## Efficient agent execution

**PROJ-09 MUST:** Size a ticket around one independently verifiable outcome. Use child issues when outcomes can ship or be assigned separately; use an in-issue checklist for steps of the same outcome. Link actual dependencies. A small correction can use outcome, acceptance and verification in a few lines; do not create an epic or separate plan file for ceremony.

**PROJ-10 MUST:** Before editing, read the current issue, latest handoff and linked PR, then record the active actor/session and branch or worktree. Keep one accountable owner; the active actor may be an agent identifier rather than a GitHub assignee. Read back the recorded claim and check for concurrent claims before editing. A comment is not an atomic lock: conflicting claims stop overlapping edits until ownership is resolved. Never assume a silent or stale claim grants takeover.

**PROJ-11 SHOULD:** Keep one active implementation ticket per agent. Parallel actors use explicitly scoped tasks and isolated branches/worktrees; agree on ownership before changing shared files. A blocked task records the reason, unblock owner and next action before the agent switches work. Delegation still follows actual user/host authorization.

**PROJ-12 MUST:** Update the tracker at claim, material scope/decision change, blocker, review, handoff and completion. Keep current scope/acceptance in the issue body, structured fields on the board and diff feedback on the PR. Link verification output rather than copying it into several places. Do not post per-command progress or repeatedly read an unchanged board; refresh at these transitions and before resuming another actor's work.

**PROJ-13 MUST:** Recover a task from the latest durable issue/PR state and actual checkout, not chat memory. Verify branch, revision and uncommitted changes before continuing; preserve another actor's work. Handoff records completed work, exact checks/results, remaining work, blockers and next action. A fresh agent must be able to resume without a conversation transcript.

```text
Claim: agent-session-a · branch DOC-123/docs-agent-handoffs
Scope: handoff rule, managing-work skill and example
Handoff: revision <actual SHA>; guide updated; links passed; skill alignment remains
Next: inspect current diff, align skill, run checks, request review
```

**PROJ-14 MUST:** Retrospective tracking is explicitly labeled as backfill. Group existing work by outcome, link exact published commits/PRs and record when reconstruction happened. Keep original chronology; never claim an issue existed before the work, fabricate review/test evidence, or rewrite published commits solely to insert ticket keys. Unverified acceptance becomes a current follow-up, not a historical pass. Use the [backfill protocol](recipes/project-backfill.md) only when that work is requested.

**Execution checks:** two competing claims resolve before edits; a blocked agent leaves an actionable unblock request; a fresh agent resumes from the issue; a small correction stays small; a backfilled ticket separates observed artifacts from unknown historical proof. These are coordination rules, not guarantees provided automatically by the tracker.

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

The consuming repository's agent entrypoint points to this guide and supplies real project coordinates. Follow the [Git/Project setup recipe](recipes/git-project-setup.md) to configure forms, fields, workflows and required PR checks. The [ticket, sprint and handoff examples](recipes/project-work.md) show adoption. Automation assists but cannot prove that acceptance or a handoff comment is truthful; a reviewer checks those. The project owner periodically reviews unassigned, blocked, stale and carried-over work.

**Rationale:** A single current issue gives the team and a new agent the same scope and next action. Two-week goals make capacity and scope changes visible while release stays independent of the calendar. Target-based Done prevents merged code from being mistaken for delivered behavior.

**Verification:** A new agent with no prior chat can find the current ticket, branch/PR, verified work and next action. A sample sprint has a goal, selected issues, scope trades and explicit carryover. A sample Done ticket links observable proof in its agreed target. A PR without a valid project issue fails the gate; a linked partial PR merging does not close or mark its issue Done.

**Exception criteria:** During an active incident, restoration may start while logging is established; create the incident issue during response and reconcile it before the change is complete. If tracker write access is unavailable, provide the exact draft/update in the handoff and state that it was not applied. Equivalent tracker fields/forms are valid when the same issue-first, handoff and Done behavior is preserved. A different cadence requires an explicit project decision under [GOV-05](../00-governance.md), not an ad hoc skipped sprint.
