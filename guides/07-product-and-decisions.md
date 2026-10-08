# Product brief and acceptance

**Read when:** a new product/major feature has uncertain requirements. Scope to the smallest useful decision. Owns PROD rules; architecture owns deployable selection. This is a team workflow convention, not an industry certification.

**PROD-01 MUST:** Identify users, desired outcome, primary journey, forbidden outcomes and acceptance examples before implementation. Distinguish supplied facts, assumptions and open decisions. Resolve only questions that change a meaningful boundary; use explicit reversible assumptions for ordinary choices.

**PROD-02 MUST:** Give consequential quality requirements measurable meaning: expected load, latency/availability window, recovery objectives, data sensitivity/retention, accessibility and cost constraints. A value may be pending owner input, but cannot be described as satisfied without it.

**PROD-03 SHOULD:** Record a durable tradeoff in a short ADR: context, selected option, meaningful alternative, consequences, verification and revisit trigger. Use an ordinary change plan for routine implementation choices.

**PROD-04 MUST:** Define done as observable user behavior plus relevant verification/operational evidence. A folder structure, test count or deployed page is not proof that the intended journey works.

Example: “An approver can decide a request once; two simultaneous decisions cannot both win; a requester sees the committed result; failed submission preserves the draft.” This identifies a domain invariant, concurrency test and UI recovery state without selecting a framework prematurely.

Use the [brief/ADR templates](templates/decisions.md). For a small internal tool, five clear lines may suffice; for multiple teams or sensitive data, expand trust and failure analysis. **Verification:** another reader can derive success/failure cases and identify who owns each unresolved consequential assumption. **Exception:** reuse a maintained product spec instead of duplicating it. Source context: [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final); template and proportionality are local choices.

**PROD-05 SHOULD:** Deliver small usable vertical slices with explicit dependencies and unfinished exposure. Link enabling work to its user outcome; product owners decide consequential behavior and priority.

**PROD-06 MUST:** Define launch success signals and revisit decisions when measured outcomes contradict assumptions. Use a short ADR for durable tradeoffs, not every implementation choice.
