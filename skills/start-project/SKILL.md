---
name: start-project
description: Plan a new enterprise application from product needs, selecting its architecture, stack, initial boundaries, and verification approach using this guideline library. Use before creating application code; do not run scaffolding or deployment.
---

Read [usage](../../USAGE.md) and [governance](../../guides/00-governance.md) before applying this skill. This skill requires the complete pinned handbook checkout; resolve links relative to this file. Use the [task map](../../guides/README.md) to select only relevant recipes.


# Start a project

Start with [product decisions](../../guides/07-product-and-decisions.md) and select one [runtime profile](../../guides/profiles/README.md). Read [architecture](../../guides/01-architecture.md), [stack](../../guides/02-stack.md), [repository structure](../../guides/03-repository.md), [security](../../guides/cross-cutting/01-security.md), and [testing](../../guides/cross-cutting/03-testing.md). Load frontend, backend, Python, or data guides only when the proposed project needs them.

Produce a compact architecture brief: product journeys; domains and data owners; trust/tenant boundaries; first deployables and repository shape; selected stack with reasons; critical integrations and failure handling; test/operational proof; rejected alternatives; triggers to revisit. Start with the simplest shape that satisfies the stated constraints. Mark unknowns as assumptions and ask only for information that materially changes a boundary. This skill creates a decision proposal, not a scaffold or permission to deploy.
