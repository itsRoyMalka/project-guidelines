---
name: review-change
description: Review a code change for behavior, domain ownership, contract compatibility, tenant/security scope, tests, and operational impact using the relevant guides.
---

# Review a change

Read [usage](../../USAGE.md), [governance](../../guides/00-governance.md), issue/PR and affected guides from [the map](../../guides/README.md). Inspect the actual diff and consumers.

Prioritize concrete correctness, contract, authorization, data, lifecycle and deployment failures. Use the affected BE/FE/E2E anti-pattern guide to spot a failure and its pattern inventory to assess whether an abstraction earns its cost; the owning rule remains authoritative. Check copied excerpts against [example conventions](../../guides/recipes/example-conventions.md) and the target project's real APIs. For time-dependent changes, load the BE/FE time guides from the map and check clock/zone ownership. Check agreed feature structure, named constants, DS/RTL/test IDs and behavioral proof when relevant. Report location, failure scenario, impact and confidence; distinguish defects from justified style choices. Check stale docs and unmet acceptance, not just code syntax. Use [Git review gates](../../guides/cross-cutting/08-git-collaboration.md); never claim a test ran without results.

When reviewing this handbook, apply GOV-06: each code-shape rule needs a nearby small example in its owning guide. Check examples against the other applicable rules and the shared reference flow.
