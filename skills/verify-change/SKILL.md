---
name: verify-change
description: Select and run proportionate checks for a code change, report actual evidence, and identify any unverified critical boundary before release.
---

Read [usage](../../USAGE.md) and [governance](../../guides/00-governance.md) before applying this skill. This skill requires the complete pinned handbook checkout; resolve links relative to this file. Use the [task map](../../guides/README.md) to select only relevant recipes.


# Verify a change

Read [testing](../../guides/cross-cutting/03-testing.md), [delivery](../../guides/cross-cutting/05-delivery.md), and the target repository's check commands. Map changed behavior to the cheapest meaningful test layer plus any affected cross-boundary proof.

Run checks available in the current environment, inspect failures, and rerun only to resolve a concrete remaining risk. Report commands and results precisely. Separate skipped/unavailable tests from passes; never describe a mocked UI journey as deployed integration proof. For data or contract changes, include migration/compatibility evidence. Stop when the stated acceptance and critical risks are sufficiently verified, or name the exact gap and owner.

Use the [risk-to-proof map](../../guides/cross-cutting/recipes/local-and-test.md). Finish with revision/environment, exact commands, observed results, unavailable checks and remaining release conditions. Skill completion never grants deployment permission.
