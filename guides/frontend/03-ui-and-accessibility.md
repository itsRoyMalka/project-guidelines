# UI, accessibility, and localization

**Applies to:** user-facing web surfaces. The product's design system is the source for actual token names and components.

**UI-01 MUST:** Use semantic design tokens and shared accessible primitives. Do not invent product-level color, spacing, dialog, table, or form systems per feature. Add a shared primitive when multiple genuine consumers need it.

**UI-02 MUST:** Meet WCAG 2.2 AA as the accessibility target for new web UI. Every control has an accessible name, keyboard operation, visible focus, appropriate semantics, and usable error feedback. Test with keyboard and a screen reader for critical journeys.

**UI-03 MUST:** Design narrow layouts deliberately. Tables and dense dashboards need a readable phone composition, not accidental horizontal clipping. Test loading, empty, error, forbidden, and success states at narrow and wide widths.

**UI-04 MUST:** Localize user-visible strings and format dates/numbers by locale. Use logical CSS properties and direction-aware components; verify RTL where the product supports it. Store instants in UTC, render them in the intended viewer/site timezone, and distinguish date-only values.

**UI-05 MUST:** Confirm consequential, irreversible, externally delivered, or costly actions. State what changes, the affected scope, and reversibility. Navigation and ordinary filters do not need confirmation.

**UI-06 SHOULD:** Show outcomes at the affected surface. Use toasts for outcomes that would otherwise be invisible, not for every success. Keep field errors at fields, loading skeletons shaped like the resulting content, and durable notices in a discoverable location.

**UI-07 MUST:** Charts and status indicators convey meaning without color alone. Aggregates should offer a path to underlying evidence when the contract supports it. Overlays manage focus and do not extend beyond the viewport.

**Verification:** design-system review, accessibility checks, English/RTL and narrow/wide walkthroughs, and journey tests. Further reading: [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
