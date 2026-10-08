# UI, accessibility, and localization

**Applies to:** user-facing web surfaces. The product's design system is the source for actual token names and components.

**UI-01 MUST:** Feature/page UI composes design-system components, including layout/text primitives. Raw rendering elements stay inside the design system; features own business compositions and meaningful labels. Use tokens for visual values.

**UI-02 MUST:** Use WCAG 2.2 AA as the target for new web UI. Map applicable criteria to automated and manual checks, including names/semantics, keyboard/focus, contrast, zoom/reflow, target size and accessible authentication. Exercise critical journeys with a screen reader; a clean automated scan is not conformance proof.

**UI-03 MUST:** Build mobile-first and adapt components to their container. Verify phone width, long text and zoom/reflow for each important data state; keep inherently two-dimensional content in accessible contained scroll regions.

**UI-04 MUST:** Support RTL throughout layouts, overlays, navigation, focus, tables, charts and forms. Set lang/dir from locale, use logical CSS and direction-aware primitives; mirror only directional meaning. Format numbers/dates with locale and explicit time semantics.

**UI-05 SHOULD:** Use proportionate error prevention for consequential actions: clear scope, review, confirmation or safe undo according to impact and reversibility. Avoid routine confirmation dialogs when inline feedback or undo provides the needed protection.

**UI-06 SHOULD:** Show outcomes at the affected surface. Use toasts for outcomes that would otherwise be invisible, not for every success. Keep field errors at fields, loading skeletons shaped like the resulting content, and durable notices in a discoverable location.

**UI-07 MUST:** Charts and status indicators convey meaning without color alone. Aggregates should offer a path to underlying evidence when the contract supports it. Overlays manage focus and do not extend beyond the viewport.

**Verification:** design-system review, accessibility checks, supported LTR/RTL and narrow/wide walkthroughs, and journey tests. Further reading: [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

Use the [UI recipe](recipes/ui-patterns.md) for component selection, interaction states, supported locale/input matrix and manual evidence.

**UI-08 MUST:** Public components accept and forward `testId` to a meaningful root; exposed feature boundaries assign it. Keep per-domain constants in shared `packages/test-ids`. Use stable scoped instance IDs, never copy, CSS, array position or PII.

**UI-09 MUST:** Features own shallow locale JSON groups by user flow under `messages/<locale>.json`. App navigation and design-system copy have their own owners; shared i18next setup/formatters register namespaces. Verify en/he key completeness, interpolation/plurals and mixed-direction text.

See [design system](04-design-system.md) for managed tokens and reusable components, and [frontend tests](07-testing.md) for composition proof.
