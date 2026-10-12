# Maintaining this handbook

These coordinates configure this repository only; consuming projects use their own tracker.

- Project: https://github.com/users/itsRoyMalka/projects/2
- Issues: https://github.com/itsRoyMalka/project-guidelines/issues
- Key: `GL-<issue number>`; accountable maintainer: `@itsRoyMalka`.
- Canonical rules: the guides in this checkout; record the working revision in checks/handoffs.
- Cadence: two weeks. Historical backfill is excluded from current sprint delivery counts.
- Statuses: Backlog, Ready, In Progress, In Review, Ready to Release, Done.
- Views: Current work, Historical backfill, Backlog. The Project is private pending a visibility decision.

Read the issue and current handoff, claim a branch, then use the local project-work and Git guides. Public issues contain only publishable information. When Project access is unavailable, issue context remains readable and the missing board update is reported.

## Adoption boundary

The 2026-10-12 reconstruction is a one-time maintainer-authorized exception to GIT-03/06/10 and PROJ-14's normal preservation of published history: confidential history is sanitized and real issue keys are added. Original author dates are retained, committer dates record reconstruction, and private email metadata uses the author's public GitHub noreply identity. This is not permission for routine history rewriting.

Historical commits are marked retrospective. There were no historical PRs to recreate. Verification performed now is not presented as past review. The private recovery/mapping archive is excluded from this repository.

Subsequent ordinary changes use real issue-first branches and PRs. Repository templates, protected-branch gates and an actual trial remain tracked in GL-19; the existence of this file or a Project does not prove those controls are active. The distribution license remains GL-20 pending maintainer selection.

## Daily work

1. Read the issue, latest comments, linked PR and actual checkout. If no issue fits, create one with the issue form; rename its title to `GL-<number>: <outcome>` once GitHub assigns the number.
2. Triage: Project #2, type/priority/area, accountable owner, acceptance and Done target. Add an iteration only for planned sprint scope. Contributors without private Project access ask the maintainer to add/update the card.
3. Claim: actor/session, branch, scope and short plan in the issue. Read it back; stop overlapping work if another actor owns it. Set In Progress and the Active actor field.
4. Implement on `GL-19/chore-development-workflow` (substitute your issue/type/summary). Commit subjects and PR title use `GL-19: chore(workflow): establish development gates`.
5. Run the checks below. Review meaning, example consistency, adoption impact and confidentiality manually. Record actual revision/results, including skipped checks.
6. Open a PR with the supplied template and link the issue in its Development sidebar. `Refs #19` alone is insufficient. Re-run Ticket metadata after linking or Project changes. Set In Review and leave a durable handoff.
7. A different authorized reviewer reviews the current head. Resolve feedback and satisfy required checks. Squash using the exact keyed PR title; recheck title/issue/Project membership immediately before merge.
8. Verify the merged documentation revision against acceptance; record proof, obtain owner acceptance, then close the issue and move it to Done. No separate release is normally needed.

Small fixes use this same short flow; no separate spec or plan document is required. Preserve blocked work in the issue with reason, unblock owner and next action.

## Local checks

From the repository root (Python 3.12.12 and Node 22.22.0 on CI):

```sh
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install --require-hashes -r .github/checks/requirements.txt
python3 .github/checks/handbook.py
python3 -m unittest discover -s .github/checks -p 'test_*.py'
node --test .github/checks/metadata.test.cjs
git diff --check
```

The Markdown check covers tracked Markdown, CommonMark local links/images and resolved reference links, heading anchors outside code examples, balanced fences and unique normative IDs. Stage new documents before running it. It does not compile illustrative application snippets, validate unresolved reference labels (CommonMark treats these as text), raw HTML links or every Markdown extension, prove guideline quality or replace a privacy/secret review. Check CI logs for the exact runtime versions; runtime versions and action revisions are pinned; review updates deliberately.

## Automation and trust boundary

- `documentation`: read-only PR CI, no repository secrets. Runs the maintenance checks.
- `ticket-metadata`: trusted `pull_request_target` workflow, checks out **main only**, reads PR data as data, and publishes a status on the exact checked head. It verifies keyed branch/commits/title, real open issue, Development relationship, private Project membership and populated PR sections (HTML template comments do not count).
- `PROJECT_READ_TOKEN`: dedicated credential with read access to Project #2; no write/admin scopes. Configure through repository Actions secrets; never use an agent's CLI credential as the CI credential. Missing access fails the gate. Rotate/revoke through the maintainer.
- Development links and external Project membership edits do not reliably trigger PR workflows. Dispatch **Ticket metadata** with the PR number after changing them and immediately before merge. Human review validates proof and current tracker state.
- Required checks and review apply to admins too. No ordinary direct push, force push or deletion. A PR author cannot approve their own work; if the sole CODEOWNER authored the PR, a second designated CODEOWNER is needed before normal merge.
- Squash defaults to the keyed PR title. This default alone does not constrain an edited final message; host commit-message restriction (where supported) or the maintainer's controlled exact-title merge is required.

## Bootstrap and remaining proof

GL-19 introduces the first CI workflows. The trusted metadata workflow cannot execute from an unmerged PR: its code must first exist on protected main. Do not falsely publish a passing status or silently bypass protection to bootstrap it. The maintainer must review the bootstrap diff and explicitly authorize any one-time bootstrap exception, recording scope and restoration steps on GL-19. Subsequent changes use the full gates.

GL-19 stays open until hosted positive/negative trials and the partial-PR no-auto-close trial are recorded. Local fixture tests demonstrate validator behavior, not live branch rejection. Project workflow settings and merge/review proofs belong in the issue handoff.

### Host configuration verified during GL-19

- Main protection is active: PR, one approval, CODEOWNER approval, latest-push approval, stale-review dismissal, resolved conversations, linear history, strict `documentation` and `ticket-metadata` checks from GitHub Actions. Admins are included; force pushes/deletion are disabled.
- Squash-only merging uses PR title and deletes merged branches. Auto-close linked issues is disabled.
- This host rejected a commit-message-pattern ruleset (HTTP 422). The maintainer must use the exact validated PR title for the squash subject; this is a manual control, not a host-enforced message restriction.
- No independent CODEOWNER has been selected for owner-authored changes. This is a review blocker, not permission to self-approve.

Project workflow readback confirms auto-close, item-closed, linked-PR and merged-PR transitions are disabled. Issue intake is maintainer-managed: create → key → add to Project → set fields. No automatic sprint assignment or Done transition is claimed.

### CI security boundary

Owner: handbook maintainer. The asset is the Project credential and the authority to publish required statuses. Untrusted contributions must not execute with either. Documentation CI has no secrets; the metadata job executes only protected-main code, consumes PR text as data and uses minimal permissions. SHA-pinned actions and hash-pinned parser dependencies make verification inputs explicit.

Proof: review workflow checkout/token permissions; test missing credentials, API failure, candidate changes and Project removal during verification. Hosted verification remains required after bootstrap. A status is a snapshot: later issue/Project changes require a rerun and final maintainer inspection, not a claim of continuous authorization.

These are small maintenance programs using Node CommonJS and Python, not backend services. Product backend layering and application package requirements do not apply; the local commands, pinned dependencies, meaningful tests and review requirements above do.
