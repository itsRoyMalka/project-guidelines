# Project-work examples

Apply [project-work rules](../07-project-work.md). These are examples of the selected convention, not a second source of rules. Substitute a real project, repository and key mapping before an agent uses them.

## Consuming repository agent entrypoint

Add a short instruction in the consuming repository's `AGENTS.md` or equivalent:

```text
Handbook: <complete pinned checkout path and revision>
Project: <authoritative GitHub Project URL>
Issue repository: <owner/repo>; key ODR-<issue number> (e.g. ODR-123 → owner/repo#123)
Accountable product owner: <team/role>

Before product implementation, read guides/cross-cutting/07-project-work.md and
08-git-collaboration.md from that handbook. Find or create the project issue,
read its current acceptance criteria and last handoff, and keep status current.
Use the ticket key first in branch, commit and PR title. Leave an issue handoff
before stopping. Do not mark Done until target verification is recorded.
```

The same instructions need to be discoverable by every agent host used on the project. Keep the real URL and key mapping there; the shared handbook must not guess them. If the tracker changes, update this entrypoint and the PR gate together.

## Issue body

```md
## Outcome or problem
Customer can cancel an eligible order without contacting support.

## Acceptance
- Eligible order becomes Cancelled and the customer sees confirmation.
- Ineligible order stays unchanged and shows the reason.

## Done target
Production behavior verified on the released web/API versions.

## Dependencies and constraints
Uses existing order authorization; no cancellation after fulfillment begins.
```

The issue title becomes `ODR-123: Customer can cancel an eligible order` after creation. Type, owner, priority, area, status and committed iteration are project fields rather than prose repeated in every description. Add enough context to understand success; the implementation plan can evolve in the PR.

Type-specific additions:

| Type | Add to the issue | Good completion artifact |
| --- | --- | --- |
| `feature` | User journey and important negative case | Verified behavior in agreed target |
| `bug` | Actual/expected result, reproduction, affected version | Regression proof and observed fix |
| `chore` | Current maintenance problem and desired operational state | Changed artifact/check or measured improvement |
| `spike` | Question, time box, options to compare | Short recommendation with evidence and next ticket |
| `incident` | Impact, start time, recovery target, timeline | Recovery evidence and owned follow-ups |

Avoid an epic containing only a long checklist when different outcomes can ship independently; use linked child issues and dependencies.

## Two-week sprint record

```text
Iteration: 8–21 Oct
Sprint Goal: eligible customers can cancel safely
Selected: ODR-123 cancellation flow; ODR-127 confirmation notice
Capacity note: based on the last two iterations and known absence
Scope change: ODR-130 production bug entered; ODR-127 returned to Ready backlog
Review: ODR-123 met Done in production; ODR-130 fixed; notice replan required
Improvement: add ineligible-order case to refinement before next planning
```

Track selected issues through the Project's iteration field. Keep the goal and scope-trade record in the Project's iteration description, a linked planning issue or an agreed team document; choose one maintained location. Do not copy the whole sprint into every ticket.

## Agent handoff comment

```md
Handoff — ODR-123
Current: API policy merged; UI branch `ODR-123/feat-cancel-order` at `abc123`, PR #482.
Verified: backend integration tests passed on abc123; UI flow not run yet.
Remaining: show ineligible reason, run feature test, request review.
Decision/blocker: none.
Next: check out abc123, finish UI test, update PR, move ticket to In Review.
```

The next agent reads this with the issue and PR timeline and checks the actual branch revision. A new comment supersedes a stale handoff; do not erase historical decisions. Keep code-line feedback on the PR.

## Adoption and enforcement

Follow the [Git/Project setup recipe](git-project-setup.md) for repository creation, Project fields and workflows, issue/PR templates, protection, gates and negative trials. A required check can prove metadata and links; a reviewer checks acceptance quality and handoff truth.


## Documentation task: complete small example

```md
Title: DOC-123: Standardize agent handoffs
Type: chore · Priority: High · Area: Agent workflow · Status: Ready
Owner: accountable maintainer; active actor recorded when claimed

Outcome: an agent resumes work from the issue and repository without the prior chat.
Scope: owning guide, managing-work skill and one filled example.
Acceptance:
- Handoff includes branch/revision, completed work, checks, remaining work and next action.
- Passed, failed and unrun checks are distinguishable.
- Incoming agent verifies the actual checkout before editing.
- No private paths or conversation links are required.
Plan: inspect current rules → align guide/skill/example → check links and consistency.
Done target: reviewed PR merged; acceptance and doc checks recorded on reviewed revision,
with applicability confirmed against the merged result.
```

DOC-123 is illustrative. Create the real issue first, then use its actual number/key; this example is not a live task. Status/owner/type fields have one maintained location on the tracker, not duplicate manually synchronized copies.

```text
Starting comment
Claim: agent-session-a · branch DOC-123/docs-agent-handoffs
Scope: guide, skill, example · next: inspect existing handoff rules

Handoff comment
Revision: <actual commit>; uncommitted changes: <none or exact scope>
Completed: guide and example updated
Verified: <actual link-check command> passed on <revision>
Remaining: skill alignment and consistency review
Blocker: none
Next: inspect current diff, update skill, run checks, request review
```

An actor identifier does not fabricate a GitHub account. Keep the accountable assignee and active executor distinct. Read back the claim; resolve overlap with any other claim before editing.

For a typo correction, the ticket can be three lines: the wrong text, expected correction and verification. For separately deliverable outcomes, use linked child tickets. Do not create a ticket per file or copy the plan into the PR.

## Interrupted and blocked work

```text
Blocker: required acceptance behavior is undecided
Unblock owner: product owner
Needed decision: whether a cancelled order can be reopened
Preserved work: <branch/revision>; no overlapping actor edits authorized
Next: resume after decision; other Ready work may be claimed meanwhile
```

Use the blocker field/reason without inventing a second status workflow. Never silently change acceptance to bypass the blocker. Retrospective work follows the separate [backfill protocol](project-backfill.md).
