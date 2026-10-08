# Set up Git and the product Project

Use this when creating a product from a PRD. [Project work](../07-project-work.md) owns tickets and sprints; [Git collaboration](../08-git-collaboration.md) owns branches and PRs. This recipe gives the **setup order**, not a script or a fixed hosting template. On a different Git host, configure equivalent controls and prove the same outcomes.

## 1. Decide the coordinates and owners

Record the Git organization/host, repository visibility, default branch, authoritative product Project, issue repository, accountable owner and key mapping. For example, `ODR-123` maps to `orders/issues/123`; the key alone is never proof of a real issue. Confirm who can create repositories, edit Project fields/workflows and protect branches. If access is missing, produce the exact proposed settings and mark setup incomplete.

## 2. Create the source repository

Create the remote repository in the selected organization or confirm an existing one; initialize local Git on `main`, connect `origin`, commit the actual starter, push it and verify the remote default branch and access. Commit the package lockfile and safe local setup; put generated files and local secrets in `.gitignore`, and keep secrets out of Git. Do not create a permanent `dev` branch. Put the project-specific collaboration files in the repository, even though the handbook itself stays documentation-only:

```text
.github/
  CODEOWNERS
  ISSUE_TEMPLATE/{feature,bug,chore,spike,incident}.yml
  PULL_REQUEST_TEMPLATE.md
  workflows/                   # target CI and metadata checks
AGENTS.md                      # handbook revision + Project/issue coordinates
README.md                      # install, start and check commands
.gitignore                     # generated files and local-only configuration
```

Use issue forms to ask for outcome, acceptance, important failure and Done target; type-specific fields follow the [ticket examples](project-work.md). The PR template asks for the linked issue, changed behavior, checks, rollout and remaining risk. `CODEOWNERS` names the actual owning teams for apps, shared packages, infra, CI and its own file; only list teams with the needed repository access. Example:

```text
# .github/CODEOWNERS — replace with real teams and actual paths
/apps/web/                 @acme/web
/apps/api/                 @acme/backend
/packages/                @acme/platform
/infra/                   @acme/platform
/.github/                 @acme/platform
```

## 3. Configure one product Project

Create the Project and add the issue repository. Set Status to **Backlog → Ready → In Progress → In Review → Ready to Release → Done**; add Type (feature/bug/chore/spike/incident), Priority and Area. Use an accountable assignee/owner and a **two-week Iteration** field. Create backlog, current sprint and review views as useful. Auto-add **issues** from the selected repository; PRs remain linked implementation, not duplicate sprint cards. Add the first PRD and starter issues only after the key mapping is set.

## 4. Set the repository and Project controls

In repository settings, allow squash merging as the normal merge method and use the PR title as the default squash subject; enable branch deletion after merge. Turn **off** “Auto-close issues with merged linked pull requests,” because Done follows target verification. In Project workflows, disable any `issue closed → Done` automation that could bypass that proof. Keep optional issue-added automation aligned with Backlog. Verify these settings on the actual host; product UI names may change.

Protect `main` with a ruleset or equivalent branch protection: PR required, relevant approving review and CODEOWNERS review, resolved conversations, required CI/metadata checks, no ordinary force push or deletion, and a narrow audited bypass role. If a merge queue is selected, required checks must run on its merge-group candidate too. Configure protections after CI has produced stable check names; do so **before ordinary feature work**.

## 5. Make the PR gate real

Target CI supplies build/type/lint/test checks chosen for this repo and a required metadata check. The metadata check validates the ticket key in branch, commit and PR title; resolves the number in the configured issue repository; verifies that the issue belongs to the configured Project and that the PR is genuinely linked. A title key or `Refs` prose alone does not satisfy the link. Configure host commit-metadata restrictions or a controlled merge path for the **actual final squash subject**; a pre-merge check of the PR title alone cannot guarantee an editable merge message. Bot exceptions are explicit and still traceable. Missing access, a wrong Project or a missing check fails closed. Keep credentials least-privileged and do not expose privileged tokens to untrusted PR code. The target project implements this gate; this handbook does not ship a generic script.

```text
ODR-123 → orders/issues/123 → Orders Project
ODR-123/feat-cancel-order → ODR-123: feat(orders): allow cancellation
PR #482 links orders#123; required checks and owner review pass on reviewed head
```

## 6. Prove the configuration before calling setup done

| Trial | Expected result |
| --- | --- |
| Valid issue in the right Project, keyed branch/commit/PR, linked PR, passing checks | Merge allowed after review |
| Missing issue/link, wrong Project, mismatched key or inaccessible tracker | Metadata check blocks merge |
| Direct push, force push or missing owner approval on protected `main` | Host blocks it |
| Linked partial PR merges | Issue stays open and outside Done; release proof is still required |
| Squash merge | Final subject retains the ticket key |
| Merge queue, if enabled | Required checks report on the merge group |

Record the actual Project/repository URLs, settings owner, check names and trial results in the target project's setup handoff. If any trial cannot run, name the unmet gate. The first agent ticket then follows [PROJ-06–08](../07-project-work.md); the first feature PR follows [GIT-01–09](../08-git-collaboration.md).

Sources: [GitHub Projects quickstart](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/quickstart-for-projects), [Project auto-add](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically), [built-in workflows](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations), [linked-PR issue closing](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-auto-closing-issues), [rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository), [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [issue/PR templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates), [squash settings](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests), [merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue).
