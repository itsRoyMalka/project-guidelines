# Project Guidelines

A handbook for engineers and AI agents building enterprise TypeScript web applications and services. Python backend and analytics are optional profiles. This repository contains Markdown guides and skills; executable verification fixtures live outside it.

**Edition:** revised 2026-10-05 under the owner's authorization to choose and integrate the baseline. internal review record (not distributed) records actual checks and limits. Architecture/style defaults are selected conventions, not claims that one stack is universally best. The internal review record (not distributed) is historical; internal review record (not distributed) tracks its findings.

## Start by task

- New product: [product brief](guides/07-product-and-decisions.md) → [architecture](guides/01-architecture.md) → [profile](guides/profiles/README.md) → [start-project skill](skills/start-project/SKILL.md).
- Existing code: [read-project](skills/read-project/SKILL.md), then the [task/subject map](guides/README.md).
- Feature or fix: [plan](skills/plan-change/SKILL.md), [implement](skills/implement-feature/SKILL.md), [verify](skills/verify-change/SKILL.md), proportionate to the task.
- Review: [review-change](skills/review-change/SKILL.md). Incident: [diagnose-incident](skills/diagnose-incident/SKILL.md).
- Use from another project: [consumption contract](USAGE.md). Read [governance](guides/00-governance.md) once before applying rules.

## Scope

Core covers product decisions, code architecture, TypeScript, HTTP, persistence, identity, UI, testing, delivery and operations. Load multi-tenancy, durable messaging, files, analytics and Python only when applicable. Realtime/offline sync, AI product evaluation, native mobile, embedded systems, ML training, jurisdiction-specific compliance and detailed cloud-provider setup require an explicit project extension. A selected exception is recorded, not silently ignored.

Read the current guides as the authority for this edition. Profiles choose compatible expressions; recipes explain failure-prone implementation decisions; templates capture project evidence. Skills route tasks to those owners. 

internal review record (not distributed) · internal review record (not distributed) · [Full map](guides/README.md)
