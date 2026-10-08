# Git, branches, commits and pull requests

**Applies to:** code and documentation changes in a product repository. [Project work](07-project-work.md) owns tickets, sprints, handoffs and Done. [Repository structure](../03-repository.md) owns app/package boundaries; [delivery](05-delivery.md) owns build and release evidence. Select the target Git host's equivalent controls when it is not GitHub.

## Branch model

**GIT-01 MUST:** Use one permanent main branch and short-lived ticket branches. Shared dev deploys tested main; production promotes a known artifact. Temporary release/hotfix branches start from the relevant deployed revision and reconcile promptly.

**GIT-02 MUST:** Prefix human branch, commit and PR titles with the ticket key. Branch: `ODR-123/feat-cancel-order`; commit/PR: `ODR-123: feat(orders): allow cancellation`. Types: feat/fix/chore/docs/refactor/test/perf. Configure parsers for this nonstandard Conventional Commits prefix; bot/host exceptions retain PR traceability.

**GIT-03 SHOULD:** Keep PRs focused and reversible; squash merge is the ordinary default with a checked ticket-keyed subject. Preserve meaningful history when needed. Coordinate shared-branch history changes; never force-push protected branches.

## Pull request contract

**GIT-04 MUST:** Every code/doc change uses a PR to its protected target and a real tracker issue relationship. A title key or Refs text alone is insufficient. Disable GitHub linked-PR auto-close; do not use closing keywords before target verification. Artifact-only rollback links the incident/release record.

**GIT-05 MUST:** PRs state behavior, issue, affected deployables, meaningful decisions, actual checks, remaining risk and relevant rollout/recovery. Update evidence as the diff changes; draft PRs satisfy the same gates before merge.

**GIT-06 MUST:** Protect main/release branches with review, applicable checks, CODEOWNERS and resolved findings. Recheck material changes; reject stale/wrong-source/skipped proof. Merge queues need checks on the merge-group candidate; no ordinary direct/force push.

**GIT-07 MUST:** A required gate verifies ticket prefixes, real matching linked issue in the project, metadata and final squash subject. Missing/inaccessible/mismatched evidence fails closed. Human review judges acceptance and handoff truth; automation validates structure.

## Merge, release and repair

**GIT-08 MUST:** Merge the reviewed head after required checks. Delete the branch; keep the issue Ready to Release until target proof. Release records bind source and immutable digest; merge alone is not deployment.

**GIT-09 MUST:** Reverts, rollbacks and hotfixes retain incident/ticket evidence. Hotfix from deployed source, run the explicit expedited gates and reconcile into main. Emergency bypass needs a named authorized role, reason, audit and follow-up; a bypass is never a passing check.

## Worked trace

```text
Project issue:  ODR-123 → orders/issues/123 (In Progress)
Branch:         ODR-123/feat-cancel-order
Commit:         ODR-123: feat(orders): allow cancellation
PR title:       ODR-123: feat(orders): allow cancellation
PR body:        Refs #123 · behavior, tests, rollout, remaining risks
After merge:    main → tested artifact → dev/prod verification → issue Done
```

An ordinary PR body can stay this small:

```md
Refs #123
Behavior: eligible orders cancel; ineligible orders return a clear reason.
Proof: order API integration tests passed; UI feature test passed on this revision.
Release: deploy orders-api before web; monitor cancellation errors; prior digests retained.
Remaining: production verification after promotion.
```

**Rationale:** Short-lived branches and protected `main` reduce integration drift. Ticket keys and linked issues make each change traceable; reviews and required checks protect the shared branch. Artifact promotion separates integration from release, and the hotfix path preserves a repair trail when production lags `main`.

**Verification:** Inspect a feature, bug and hotfix trace from project issue through branch, commits, PR, merge, artifact and Done evidence. Try missing/mismatched ticket links and skipped checks; the merge gate must fail. Rehearse a release-branch hotfix and reconciliation into `main`. Confirm an automated changelog parser handles the leading key if used.

**Exception criteria:** A separate repository, merge method or supported release branch needs a concrete ownership, compliance or history reason and a project decision under [GOV-05](../00-governance.md). Generated bot/merge commits may vary when the controlling PR and release remain traceable. Emergency bypass does not make a skipped check pass; record the risk, compensating verification and expiry in the incident. Existing repositories can adopt branch/title/key rules incrementally while preserving their current protected branch until migration is deliberate.

Sources: [GitHub rulesets and required checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [GitHub issue/PR links](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [Conventional Commits grammar](https://www.conventionalcommits.org/en/v1.0.0/).
