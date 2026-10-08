# Project-work examples

Apply [PROJ-01–08](../07-project-work.md). These are examples of the selected convention, not a second source of rules. Substitute a real project, repository and key mapping before an agent uses them.

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

Create the five issue types or maintained equivalent labels; create the status/priority/area/owner/iteration fields and two-week cycle; set up issue forms and issue-only auto-add if useful. Keep issues as planning cards and expose linked PRs rather than duplicating them as sprint work. Disable GitHub's linked-PR issue auto-close in the relevant issue repositories, and disable the Project's `issue closed → Done` automation when Done requires target verification. Then configure the [Git PR gate](../08-git-collaboration.md) for a real issue in the correct Project and matching key. Test it with one valid ticket, a missing link, a wrong-project link and a linked partial PR that merges without closing the issue. A required check can prove metadata and links, while a reviewer checks acceptance quality and handoff truth.
