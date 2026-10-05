# Small project records

Use these Markdown forms in the target project; omit fields irrelevant to the decision. Values below are prompts, not completed project evidence.

## Brief

```text
User/outcome and first journey:
Acceptance examples (success, failure, forbidden outcome):
Domain/data owners; trust/tenant boundaries:
Profile and runtime/deployment choice:
Load/latency/availability; RPO/RTO; cost:
Data classification, retention and supported locales:
Integrations and failure modes:
Facts, assumptions and consequential open decisions/owners:
Verification and first delivery slice:
```

## Decision or exception

```text
ID, date, owner, status:
Context / applicable rule IDs / adopted handbook revision:
Selected option and reason:
Alternative and why not selected:
Consequences, security compensations where applicable:
Actual verification / unverified scope:
Migration impact and revisit trigger:
```

The target organization determines security risk acceptance; an agent can draft but cannot impersonate that owner. Existing task authorization is not erased by this template.

## Review / release evidence

```text
Behavior changed and affected consumers:
Finding: location, concrete failure scenario, confidence, impact:
Checks: exact command/environment → result:
Unavailable/excepted gates → reason, owner, next action:
Compatibility, rollout/stop criteria and recovery:
Docs/contracts updated; residual risk:
```

## Incident record

```text
Impact, start time, affected journey/release:
Response owner / escalation / update channel:
Evidence and competing hypotheses:
Mitigation action, authorization, time and observed effect:
Recovery proof including durable business outcomes:
Follow-up owner and due/review condition:
```

## Filled illustration: initial deployment shape

This is a hypothetical example, not evidence of a deployed product or owner approval.

- **ADR-001; status:** selected for a hypothetical one-team order application, technical owner “application team.”
- **Context:** browser users, one release owner, no current external API clients; ARCH-02 and STACK-02 apply.
- **Decision:** one React Router fullstack deployment, server-only domain operations and relational persistence. Route loaders/actions own ordinary remote data.
- **Alternative:** static SPA plus separate API; deferred because independent hosting/release/consumer requirements are absent.
- **Consequences:** simpler deployment and direct operation calls, but web and backend deploy together; protect server-only code and request-scoped identity.
- **Verification:** client/server build, negative server import, authenticated loader/action journey and real DB policy/concurrency tests required; none asserted executed for this hypothetical application.
- **Migration/revisit:** add a public contract through existing owned operations when external consumers become real; revisit separate deployment for demonstrated ownership, trust or scale needs.
