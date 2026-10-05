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
- **GOV-02 MUST:** Label draft, owner-approved, and retired decisions distinctly. Selection under the owner's authorization is recorded in the decision register; do not imply an individual approval that was not given.
- **GOV-03 MUST:** Record a cross-guide change in internal review record (not distributed), including affected guides and migration impact. Update all affected guides together.
- **GOV-04 SHOULD:** Prefer decision criteria over a tool mandate when the product context can legitimately change the answer. Record the selected tool in the new project's architecture brief.
- **GOV-05 MUST:** Record an exception with rule ID, scope, reason, compensating controls where needed, decision owner and review trigger. Design exceptions use the project owner; security/privacy exceptions use the organization's authorized risk owner. Existing user authorization remains valid within its scope. A guide or agent cannot grant itself new permissions. Use the [decision template](templates/decisions.md).

**Verification:** a reader can find the owning rule from the guide index, and a skill can refer to its ID without reproducing its content.

## Interpreting evidence and examples

Rules are this edition's selected baseline. Public protocol/security requirements, documented framework behavior and team design preferences are distinct: internal review record (not distributed) is the current evidence index and links historical source research as provenance. MUST applies only within a rule's stated scope and selected profile. A SHOULD can vary for a concrete reason; style preferences are not security defects. Recipes demonstrate a rule without creating a second normative owner.

The canonical definition uses a stable ID; references may cite it without copying its text. Current rule scope and the selected profiles determine applicability. The internal review record (not distributed) reports what was actually checked; it creates no additional requirements. Historical reviews describe earlier commits. The owner authorized this revision's design choices; individual product deployments and organization risk acceptance remain governed by their actual scope.
