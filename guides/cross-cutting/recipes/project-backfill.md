# Retrospective project tracking

Use only for requested reconstruction of existing work. Owners: [PROJ-14](../07-project-work.md) and [GIT-10](../08-git-collaboration.md). Backfill creates traceability from real artifacts; it does not recreate a workflow that never happened.

## Plan before creating tickets

1. Identify the authoritative repository, board, key mapping and approved history range. Record the exact start/end commits; include applicable branches, tags and real PRs. Keep unpushed work separate.
2. Inventory commits and inspect their diffs/current outcome, not just subjects. Search existing issues before proposing new ones.
3. Group by deliverable. Several commits can map to one issue; a mixed commit can link several issues with explained file/scope coverage. No mandatory ticket per commit.
4. Prepare a mapping of commit → outcome → existing/proposed issue → proof/gap. Explicitly account for merges, reverts, superseded work and administrative commits.
5. Review the mapping and creation scope, then create/update the approved records. Re-running uses the mapping and exact commit links to avoid duplicates.

## Minimal retrospective ticket

```md
Title: DOC-123: Standardize agent handoffs
Tracking: retrospective; reconstructed on <actual date>
Outcome: a new agent can recover the active task from the issue.
Implemented by: <full published commit links>; no PR existed for this work.
Current evidence: relevant guide and skill are present at <revision>.
Historical verification: not recorded; no prior review is inferred.
Follow-up: validate the handoff scenario in <linked current ticket>.
```

Use a dedicated `backfill` label or equivalent field. Distinguish observed implementation date from ticket creation date; do not alter dates or assign historical work to a current sprint. Record owner as unknown when unsupported. The historical acceptance is reconstructed and labeled accordingly.

## Completion and reconciliation

If the outcome can be verified now, record the present check/date/revision and reviewer decision, then apply the normal Done rule. Do not describe today's check as historical proof. Superseded/reverted work gets an explicit disposition; it is not an active delivered feature. Unknown or unmet acceptance remains open or has an explicit linked follow-up according to the recorded disposition.

```text
Commit range: <verified start>..<verified end>
Every commit: mapped to issue(s) or explicit non-product disposition
Every issue: real artifact link + reconstruction marker + proof or named gap
Adoption boundary: subsequent changes use actual issue-first branches and PRs
```

Private archives never become public evidence merely to fill a traceability gap. For a sanitized publication with fresh history, map the publishable snapshot/diffs and public follow-up commits. Keep old private SHA mappings and source-review details outside the public tracker/repository. Do not attach private patches, logs or history bundles.

**Check:** no unmapped commits in the approved range; no duplicate tickets on rerun; no invented PRs, approvals or checks; scope links explain mixed commits; records respect target visibility. Report exclusions and uncertainty instead of claiming complete coverage beyond the inspected range.
