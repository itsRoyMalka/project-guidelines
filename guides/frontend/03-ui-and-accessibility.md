# UI, accessibility, and localization

**Applies to:** user-facing web surfaces. The product's design system is the source for actual token names and components.

**UI-01 MUST:** Establish a minimal semantic token set and accessible primitives from the chosen design system or a vetted library. Keep them app-local initially and extract packages for real consumers. Features reuse these foundations rather than inventing inconsistent forms/dialogs/colors. See [UI patterns](recipes/ui-patterns.md).

**UI-02 MUST:** Use WCAG 2.2 AA as the target for new web UI. Map applicable criteria to automated and manual checks, including names/semantics, keyboard/focus, contrast, zoom/reflow, target size and accessible authentication. Exercise critical journeys with a screen reader; a clean automated scan is not conformance proof.

**UI-03 MUST:** Preserve usable reflow at narrow widths and zoom. Inherently two-dimensional tables may use an accessible contained scroll region with usable headers/cells; do not clip content accidentally. Choose a distinct phone composition when the product warrants it, and test every relevant UI state.

**UI-04 MUST:** Keep user-visible content localization-ready and format numbers/dates for supported locales. Use logical CSS and direction-aware components; test RTL only when supported, alongside long text/plurals and the actual language matrix. Render instants in the intended timezone and preserve date/schedule semantics.

**UI-05 SHOULD:** Use proportionate error prevention for consequential actions: clear scope, review, confirmation or safe undo according to impact and reversibility. Avoid routine confirmation dialogs when inline feedback or undo provides the needed protection.

**UI-06 SHOULD:** Show outcomes at the affected surface. Use toasts for outcomes that would otherwise be invisible, not for every success. Keep field errors at fields, loading skeletons shaped like the resulting content, and durable notices in a discoverable location.

**UI-07 MUST:** Charts and status indicators convey meaning without color alone. Aggregates should offer a path to underlying evidence when the contract supports it. Overlays manage focus and do not extend beyond the viewport.

**Verification:** design-system review, accessibility checks, supported LTR/RTL and narrow/wide walkthroughs, and journey tests. Further reading: [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

Use the [UI recipe](recipes/ui-patterns.md) for component selection, interaction states, supported locale/input matrix and manual evidence.
