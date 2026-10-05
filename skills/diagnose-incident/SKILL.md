---
name: diagnose-incident
description: Diagnose application failures and guide incident mitigation, evidence collection, recovery verification and follow-up. Use for production degradation or a debugging investigation; this skill does not grant permission for production changes.
---

# Diagnose an incident

Read [usage](../../USAGE.md), [governance](../../guides/00-governance.md), [operations](../../guides/cross-cutting/04-operations.md) and the [incident workflow](../../guides/cross-cutting/recipes/operations.md). This skill requires the complete pinned handbook checkout.

Establish impact, time range, release/config timeline, owner and actual access. Preserve safe evidence and label hypotheses. Rank mitigations by reversibility, compatibility and expected impact; carry out only actions authorized by the task and environment. Prefer a focused diagnostic over speculative broad changes.

For data/schema changes load the migration recipe before suggesting rollback. For external side effects load the idempotency recipe before retry/replay. Use the task map for affected security, Python or integration boundaries. Document each action and observed result. Verify user-visible recovery and reconcile pending/unknown work; include a recovery observation window.

Finish with impact, facts, hypothesis/confidence, mitigation performed or proposed, recovery evidence, unresolved risk and owned follow-ups. Do not claim root cause or resolution from a process restart alone. Send external incident messages only with explicit authorization.
