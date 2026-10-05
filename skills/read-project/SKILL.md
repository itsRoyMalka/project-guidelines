---
name: read-project
description: Orient an agent in an existing application before changing it by locating authority, code ownership, contracts, data boundaries, tests, and operational constraints.
---

Read [usage](../../USAGE.md) and [governance](../../guides/00-governance.md) before applying this skill. This skill requires the complete pinned handbook checkout; resolve links relative to this file. Use the [task map](../../guides/README.md) to select only relevant recipes.


# Read a project

Read the target repository's README, AGENTS/CLAUDE instructions, architecture notes, manifests, and the closest feature and tests. Use [workflow](../../guides/cross-cutting/06-workflow-and-docs.md) and [repository boundaries](../../guides/03-repository.md) as the baseline, then load only domain-relevant guides.

Return a short map: entrypoints and deployables; feature/data owner; request or event path; public contracts; relevant tests and commands; known local exceptions; unanswered questions. Distinguish documented claims from observed code and note stale or unverified documents. Do not rearrange the project merely because it differs from the greenfield example here.
