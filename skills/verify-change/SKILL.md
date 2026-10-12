---
name: verify-change
description: Select and run proportionate checks for a code change, report actual evidence, and identify any unverified critical boundary before release.
---

# Verify a change

Read [usage](../../USAGE.md), [governance](../../guides/00-governance.md), issue acceptance and [testing](../../guides/cross-cutting/03-testing.md). Select [TypeScript BE action](../../guides/backend/typescript/07-testing.md), [Python BE action](../../guides/backend/python/06-testing.md), [FE flow](../../guides/frontend/07-testing.md), [mobile](../../guides/mobile/01-react-native.md) or [E2E](../../guides/e2e/01-journeys.md) proof for the risk.

Discover actual commands. Check affected units and consumers; compare observed results with acceptance. E2E evidence names the deployed manifest under [ENV](../../guides/e2e/02-environments.md). For a desktop app, apply [installed-app proof](../../guides/desktop/03-quality-and-delivery.md) to IPC, OS behavior and release candidates for every selected [platform profile](../../guides/desktop/07-platform-profiles.md). Report command/environment/result, skips, limits and next action. Use [delivery](../../guides/cross-cutting/05-delivery.md) for release proof; green local checks do not establish production readiness.

For database access/bootstrap changes, run the [positive and negative permission cases](../../guides/backend/shared/database/01-identities-and-access.md) with the actual selected roles. For pool, driver, schema or recovery changes, select the relevant [database connection](../../guides/backend/shared/database/02-connections-and-isolation.md) and [operational](../../guides/backend/shared/database/03-administration-and-recovery.md) proof; do not require a full infrastructure drill for every feature edit.


Apply WORK-12: start with affected checks and broaden for shared impact, concrete risk or required gates. Tie results to the exact revision and any dirty diff; do not recycle stale proof. For handbook-only work, verify local links/anchors, rule IDs, cross-guide consistency and the changed example or reader scenario. PROJ-04/08 determines Done from the stated target; documentation does not need a fictitious production deployment.
