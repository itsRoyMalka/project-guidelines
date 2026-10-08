# Adoption and evolution

**Applies to:** starting a project or applying this baseline to an existing one.

**ADOPT-01 MUST:** For a new product, complete the architecture brief, select the relevant language/profile guides, and state the first deployables/data owner/critical journey before implementation. Add only the packages and infrastructure needed now. When building from a PRD, use the [project-setup flow](08-project-setup.md) through starter verification.

**ADOPT-02 MUST:** For an existing system, map boundaries and tests first. Adopt a small coherent change that addresses a concrete risk, including related contract/data/security rules together where necessary. Do not rewrite working code to match a directory example.

**ADOPT-03 MUST:** Record deviations with rule ID, rationale, owner, and review trigger. A local exception may be permanent when the product context warrants it; do not pretend it is technical debt automatically.

**ADOPT-04 SHOULD:** Assign a handbook maintainer and review at least quarterly, plus on major source/security/runtime changes or demonstrated failures. Measure incidents, test reliability, accessibility and onboarding outcomes. Consumers assign a local owner for impact assessment; review cadence is a team default.

**ADOPT-05 MUST:** Consumers record the handbook revision and selected profiles. A standard change identifies affected rules, examples, skills and consumers, with upgrade/deprecation notes. Preserve retired IDs and their successors. Use [handbook consumption](../USAGE.md) to keep local instructions aligned without copying the whole rule set.

**Verification:** each adopted rule has a concrete owner and evidence; exceptions are discoverable; the target project can still ship safely while migrating.

### Example: bounded adoption

```text
docs/decisions/handbook-exceptions.md
Rule: FE-03; scope: legacy Orders search
Decision: retain the existing request client during the current release
Owner: Web team; revisit: Orders search replacement
Proof: existing access/error behavior remains covered
```
