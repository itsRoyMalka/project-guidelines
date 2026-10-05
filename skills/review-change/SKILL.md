---
name: review-change
description: Review a code change for behavior, domain ownership, contract compatibility, tenant/security scope, tests, and operational impact using the relevant guides.
---

# Review a change

Read the diff and the changed feature's surrounding code/tests. Use [workflow](../../guides/cross-cutting/06-workflow-and-docs.md), [testing](../../guides/cross-cutting/03-testing.md), and only the guides for affected boundaries.

Prioritize actionable defects: incorrect behavior, lost data, broken compatibility, missing authorization/tenant scope, non-idempotent retries, unverifiable changes, and deployment/migration hazards. Cite the exact file/line and explain the failing scenario. Distinguish a violated MUST from a preference or local exception. Do not invent findings from style differences or demand a greenfield structure in a legacy project. Summarize residual risk if no actionable issue is found.
