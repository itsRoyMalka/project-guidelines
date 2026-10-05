---
name: implement-feature
description: Implement a scoped application feature or bug fix within the owning module while preserving contracts, authorization, tests, and documentation.
---

# Implement a feature

Find the owning feature and its tests using [read-project](../read-project/SKILL.md). Load [repository](../../guides/03-repository.md), [TypeScript](../../guides/04-typescript.md) or [Python](../../guides/python/01-backend.md), and the affected frontend/backend/cross-cutting guides.

Change behavior through the feature's public operation. Keep edge validation, backend authorization, data ownership, and error mapping intact. Add focused behavioral proof, including a regression case for a bug. Update the contract and owning documentation when behavior changes. Finish with the target project's relevant checks and a concise account of what changed and what remains unverified. Do not expand the task into a general rewrite.
