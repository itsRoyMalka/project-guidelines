# Adoption and evolution

**Applies to:** starting a project or applying this baseline to an existing one.

**ADOPT-01 MUST:** For a new product, complete the architecture brief, select the relevant language/profile guides, and state the first deployables/data owner/critical journey before implementation. Add only the packages and infrastructure needed now.

**ADOPT-02 MUST:** For an existing system, map current boundaries and tests before proposing a change. Adopt one rule at a time where it improves a concrete risk. Do not rewrite working code to match a directory example.

**ADOPT-03 MUST:** Record deviations with rule ID, rationale, owner, and review trigger. A local exception may be permanent when the product context warrants it; do not pretend it is technical debt automatically.

**ADOPT-04 SHOULD:** Review the baseline when a source platform, framework, or product constraint changes. Measure outcomes such as lead time, incident patterns, test reliability, accessibility defects, and onboarding effort instead of counting rule compliance alone.

**ADOPT-05 MUST:** Keep this library and project-local instructions aligned. When a standard changes, identify affected guides, skills, examples, and consumers before release. Retire contradictory rules explicitly.

**Verification:** each adopted rule has a concrete owner and evidence; exceptions are discoverable; the target project can still ship safely while migrating.
