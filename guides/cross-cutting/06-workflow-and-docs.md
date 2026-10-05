# Development workflow and maintained knowledge

**Applies to:** humans and agents making a change. Use the task skills in [skills](../../skills/README.md) for repeatable work.

**WORK-01 MUST:** Read the target repository's instructions, nearby code, tests, and current architecture before editing. Identify the owning feature, public contract, data owner, and downstream consumers. An existing codebase's constraints take precedence over a greenfield example here.

**WORK-02 SHOULD:** For a meaningful change, write a brief plan: desired behavior, affected artifacts, risks, test proof, documentation updates, and rollout/rollback. Keep the plan proportional to the change. A spec is useful for uncertain user behavior; an ADR is useful for a durable architecture choice.

**WORK-03 MUST:** Make a focused change with matching verification. Review the diff for unnecessary abstraction, duplicate rules, missing states, contract drift, and security/tenant scope. Explain what changed, why, how verified, and remaining risk.

**WORK-04 MUST:** Keep documentation by role: README for orientation and running; architecture brief/ADRs for durable decisions; API/schema for machine contracts; runbook for operations; tests for executable behavior. Update the owning document when a change makes it false.

**WORK-05 SHOULD:** Make examples small and realistic. Link to maintained source rather than copying a large implementation into a guide. Give docs an owner and review trigger; remove obsolete guidance instead of stacking contradictory notes.

**WORK-06 MUST:** Record an exception to this baseline in the target project with rule ID, reason, owner, and review condition. Do not hide a deliberate deviation in code comments alone.

**Verification:** another engineer or agent can find the current behavior and decision from the code, tests, and linked docs.
