---
name: plan-change
description: Plan a meaningful feature, bug fix, or architecture change with its owning module, contract/data impact, risks, verification, and rollout.
---

# Plan a change

Use [read-project](../read-project/SKILL.md) first when the codebase is unfamiliar. Read [workflow](../../guides/cross-cutting/06-workflow-and-docs.md), [architecture](../../guides/01-architecture.md), and the guides for affected boundaries.

Write a proportionate plan: desired behavior and acceptance examples; owner and files; contract/schema/migration impact; authorization/tenant implications; test layers that will prove the change; observability and release concerns; documentation updates. Identify a reversible sequence when deployments or data migration span versions. Keep routine fixes brief. Mark design choices that need a project-specific decision rather than silently inventing a new standard.
