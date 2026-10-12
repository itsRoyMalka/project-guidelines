# Contributing

This is a standalone, documentation-only handbook. Start with [usage](USAGE.md), [governance](guides/00-governance.md) and the [guide map](guides/README.md).

## Write reusable guidance

- Give each rule one local owner, a stable ID, scope, rationale, verification and exception criteria.
- Include a small nearby example for code, configuration or file-layout decisions. Follow [example conventions](guides/recipes/example-conventions.md).
- Define custom helper behavior locally; use the [project-owned API map](guides/recipes/project-owned-apis.md).
- Distinguish house preferences from standards and framework guarantees. Public official documentation is optional further reading, not a substitute for the rule.
- Update affected maps, examples and skill routing together. Report adoption impact and actual checks.

## Keep contributions publishable

Do not commit private research notes, internal repository links, organization/customer details, incident reports, source-review findings, credentials, personal paths or conversation exports. Use fictional examples and reserved example domains. Review prose, links, configuration, comments and fixtures, not just executable files.

Contribute original explanations and minimal examples you have the right to share. Renaming copied proprietary code does not make it publishable. If third-party material is legitimately included, retain its required notices and compatible licensing; do not remove attribution to disguise copying.

## Review before merging

1. Resolve every local Markdown link and anchor; check fences, rule IDs and names.
2. Trace the affected workflow using only this checkout. Fill any missing convention locally.
3. Scan the diff for private data and secret patterns; inspect realistic-looking identifiers manually.
4. State which checks ran. Documentation excerpts do not become tested application code merely by being committed.

Publication/history checks belong in [publication guidance](PUBLICATION.md). Do not post sensitive findings in public issues; use a privately agreed maintainer contact.

## Work on this repository

Use the [maintainer sequence and local commands](docs/maintenance.md#daily-work). Every ordinary change has a GL issue, a matching branch/commit/PR key, current evidence and a reviewed PR. Issue forms collect the brief; the issue remains the plan/handoff record. New issues start in triage until a maintainer assigns the key and Project fields.
