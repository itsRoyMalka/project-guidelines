# How to apply these standards

**Applies to:** every project and every guide in this repository.

## Authority and reading order

1. Follow the actual task, applicable organization/security policy, and the target repository's local instructions.
2. Use this library as the shared baseline. A local exception must name the affected rule, explain the constraint, and identify who will revisit it.
3. Treat examples as illustrations. Inspect the target project's code before changing it; do not force a greenfield structure onto an existing system.
4. A guide states a rule. A skill tells an agent when to read the guide and how to complete a recurring task. Skills link to rules rather than copying them.

## Rule format

Use the [example conventions](recipes/example-conventions.md) for names, placement, required context and proof labels. Write one short rule per decision, usually one to three sentences. Skills link to rule owners instead of repeating checklists.

Each new rule needs a stable ID and **MUST** or **SHOULD**. Its owning guide states the scope, rationale, verification method, and conditions that justify an exception; add a rule-specific note when those differ. Define the complete convention locally; public references are optional further reading.

## Change control

- **GOV-01 MUST:** Keep one canonical location for a rule. Cross-reference it elsewhere.
- **GOV-02 MUST:** Label proposed, selected, and retired guidance distinctly in its owning guide or change description. Do not imply an individual approval that was not given.
- **GOV-03 MUST:** For a cross-guide change, state affected guides and migration impact in the change description. Update all affected guides together.
- **GOV-04 SHOULD:** Prefer decision criteria over a tool mandate when the product context can legitimately change the answer. Record the selected tool in the new project's architecture brief.
- **GOV-05 MUST:** Record an exception with rule ID, scope, reason, compensating controls where needed, decision owner and review trigger. Design exceptions use the project owner; security/privacy exceptions use the organization's authorized risk owner. Existing user authorization remains valid within its scope. A guide or agent cannot grant itself new permissions. Use the [decision template](templates/decisions.md).
- **GOV-06 MUST:** A guideline that prescribes code, configuration, file placement or call flow includes a small example beside that decision in its owning guide. Name its file and runtime, and show the important boundary rather than a full implementation. A linked recipe may expand it but does not replace the local example. Keep examples consistent with the other applicable rules; use a filled record for non-code workflow rules.

**Verification:** a reader can find the owning rule from the guide index, and a skill can refer to its ID without reproducing its content. Review each shape rule for a nearby, consistent example.

## Interpreting evidence and examples

Rules are this edition's selected baseline. Distinguish public standards, framework behavior and house preferences. MUST applies only within a rule's stated scope and selected profile. A SHOULD can vary for a concrete reason; style preferences are not security defects. Recipes demonstrate a rule without creating a second normative owner.

The canonical definition uses a stable ID; references may cite it without copying its text. Current rule scope and selected profiles determine applicability. Each adopting project verifies its selected implementation and records actual results. Individual product deployments and organization risk acceptance remain governed by their actual scope.

### Example: apply a rule with a scoped exception

```text
Rule: FE-03 (request/query separation)
Scope: legacy reporting screen only
Reason: replacement is already scheduled; current client has access/error tests
Owner: Web team; revisit: reporting replacement release
Other features: continue applying the selected profile
```
