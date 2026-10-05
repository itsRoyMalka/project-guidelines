# How to apply these standards

**Applies to:** every project and every guide in this repository.

## Authority and reading order

1. Follow the actual task, applicable organization/security policy, and the target repository's local instructions.
2. Use this library as the shared baseline. A local exception must name the affected rule, explain the constraint, and identify who will revisit it.
3. Treat examples as illustrations. Inspect the target project's code before changing it; do not force a greenfield structure onto an existing system.
4. A guide states a rule. A skill tells an agent when to read the guide and how to complete a recurring task. Skills link to rules rather than copying them.

## Rule format

Each new rule needs a stable ID and **MUST** or **SHOULD**. Its owning guide states the scope, rationale, verification method, and conditions that justify an exception; add a rule-specific note when those differ. Add a small code/file example only when wording alone leaves ambiguity. Define the complete convention locally; public references are optional further reading.

## Change control

- **GOV-01 MUST:** Keep one canonical location for a rule. Cross-reference it elsewhere.
- **GOV-02 MUST:** Label draft, owner-approved, and retired decisions distinctly. This repository is currently a working baseline awaiting review; no file's existence implies owner approval.
- **GOV-03 MUST:** Record a cross-guide change in internal review record (not distributed), including affected guides and migration impact. Update all affected guides together.
- **GOV-04 SHOULD:** Prefer decision criteria over a tool mandate when the product context can legitimately change the answer. Record the selected tool in the new project's architecture brief.
- **GOV-05 MUST:** A project exception states its scope, reason, owner, and review condition. It must not silently weaken security, tenant isolation, contract compatibility, or verification.

**Verification:** a reader can find the owning rule from the guide index, and a skill can refer to its ID without reproducing its content.
