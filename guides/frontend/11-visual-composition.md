# Visual composition and concrete defaults

**Scope:** web product UI; native apps reuse the principles through their platform DS. **Why:** agents need usable starting values and composition decisions, not only “make it consistent.” These are selected house defaults, not universal industry measurements. Existing coherent product tokens take precedence; record material departures under GOV-05.

## Task and hierarchy

**VIS-01 SHOULD:** Before building a surface, identify its user task, primary action, information order and expected density. Preserve the existing product language. Marketing, reading and operational screens need different emphasis; decoration must not hide actions or state.

```text
docs/design.md — project-owned design context, links to actual DS token source
Surface: cancel-order confirmation
Task: understand consequences and confirm cancellation
Hierarchy: order identity → consequences → cancel / keep order
Density: comfortable; danger emphasis only on the cancellation action
States: ready, submitting, rejected, completed
```

Keep this in the existing design/spec record; do not require another document for every component. The record explains intent; token source owns values.

## Spacing and sizing

**VIS-02 SHOULD:** Start with the scale below and map it to semantic layout roles in the DS. Related items sit closer than separate groups. Features use named DS props; they do not pass arbitrary pixel values or create new spacing systems.

| Role | Starting value at a 16px root |
| --- | --- |
| Primitive spacing | 4, 8, 12, 16, 24, 32, 48px |
| Label → input; inline icon → label | 8px |
| Related fields | 16px |
| Separate sections | 32px |
| Panel padding | 16px narrow; 24px when its container permits |
| Default control minimum height | 44px; grow for text |
| Control radius / panel radius | 8px / 12px |
| Typical control icon | 20px inside the control target |

```css
/* apps/web/src/shared/ui/tokens.css — web; generated output of DS token source */
:root {
  --space-1: .25rem; --space-2: .5rem; --space-3: .75rem;
  --space-4: 1rem; --space-6: 1.5rem; --space-8: 2rem; --space-12: 3rem;
  --layout-gap-field: var(--space-2);
  --layout-gap-form: var(--space-4);
  --layout-gap-section: var(--space-8);
  --panel-padding: var(--space-4);
  --control-min-height: 2.75rem;
  --radius-control: .5rem; --radius-panel: .75rem;
  --icon-size-control: 1.25rem;
}
/* DS placement wrapper provides the container; container queries cannot style itself. */
.ds-panel-container { container-type: inline-size; }
.ds-panel { padding: var(--panel-padding); border-radius: var(--radius-panel); }
@container (min-width: 40rem) {
  .ds-panel { --panel-padding: var(--space-6); }
}
```

Values use rem without fixing the user's root font size. A compact preset may reduce row spacing, but keep content and controls accessible under UI-02. A 44px house default is not a claim that WCAG AA requires every target to be 44px.

```ts
// apps/web/src/shared/ui/layout/layout.const.ts — project-owned DS API
export const LayoutGap = { Field: 'field', Form: 'form', Section: 'section' } as const;
export type LayoutGap = typeof LayoutGap[keyof typeof LayoutGap];
```

```css
/* apps/web/src/shared/ui/layout/stack.css — DS maps typed props to token roles */
.ds-stack { display: flex; flex-direction: column; }
.ds-stack[data-gap="field"] { gap: var(--layout-gap-field); }
.ds-stack[data-gap="form"] { gap: var(--layout-gap-form); }
.ds-stack[data-gap="section"] { gap: var(--layout-gap-section); }
```

```tsx
// features/orders/cancel/ui/cancel-order-view.tsx — React excerpt
// Panel/Stack/SectionHeading are project-owned DS exports. Stack maps gap to data-gap;
// each exposes testId per UI-08. Child feature compositions own their control IDs.
<Panel testId={OrderTestId.CancelPanel}>
  <Stack gap={LayoutGap.Section}>
    <SectionHeading>{t('cancel.title')}</SectionHeading>
    <Stack gap={LayoutGap.Form}>
      <CancelOrderSummary order={order} />
      <CancelOrderActions onCancel={onCancel} isPending={isPending} />
    </Stack>
  </Stack>
</Panel>
// packages/test-ids/orders.ts: add CancelPanel: 'orders.cancel.panel' to OrderTestId.
```

## Typography and layout proportions

**VIS-03 SHOULD:** Start with body 16px/1.5, supporting text 14px/1.5, section titles 20px/1.3 and page titles 28px/1.2. Use weight and spacing to establish hierarchy. Keep essential content readable, allow text growth and use tabular numerals for aligned numeric comparisons.

```css
/* apps/web/src/shared/ui/tokens.css and typography.css — DS web excerpts */
:root {
  --text-body: 1rem; --text-support: .875rem;
  --text-section: 1.25rem; --text-page: 1.75rem;
  --leading-body: 1.5; --leading-section: 1.3; --leading-page: 1.2;
  --weight-body: 400; --weight-heading: 600; --measure-prose: 65ch;
}
.ds-text { font-size: var(--text-body); line-height: var(--leading-body); }
.ds-section-heading {
  font-size: var(--text-section); line-height: var(--leading-section);
  font-weight: var(--weight-heading);
}
.ds-prose { max-inline-size: var(--measure-prose); overflow-wrap: anywhere; }
.ds-number { font-variant-numeric: tabular-nums; }
```

The font family is a product choice; system fonts are valid. Do not apply prose width to data tables. Translate, pluralize and format using the existing locale/time guides, not custom string concatenation.

**VIS-04 SHOULD:** Let content determine proportions. Start single-column; introduce columns when their minimum useful widths fit. Keep forms around 40rem maximum; a work/detail layout may start at 2:1. These are starting points, not ratios to force on every screen.

```css
/* apps/web/src/shared/ui/layout/work-layout.css — reusable DS layout */
.ds-work-container { container-type: inline-size; }
.ds-work-layout { display: grid; gap: var(--layout-gap-section); }
.ds-work-layout > * { min-inline-size: 0; }
@container (min-width: 56rem) {
  .ds-work-layout { grid-template-columns: minmax(0, 2fr) minmax(16rem, 1fr); }
}
.ds-form-panel { inline-size: 100%; max-inline-size: 40rem; }
```

Keep reading/DOM order meaningful in both layouts. Use logical spacing; do not use CSS visual reordering to contradict keyboard order. UI-03/04 own mobile and RTL requirements.

## Color, emphasis and content resilience

**VIS-05 SHOULD:** Use semantic surface/text/border/action/status roles. Give the principal action the strongest emphasis within its task group. Start with one surface and spacing for grouping; add a border or elevation only when it communicates a useful boundary. Status must include text or another non-color cue.

```css
/* apps/web/src/shared/ui/button/button.css — theme supplies verified role pairs */
.ds-button {
  min-block-size: var(--control-min-height);
  padding-block: var(--space-3); padding-inline: var(--space-4);
  border-radius: var(--radius-control);
  background: var(--color-action); color: var(--color-on-action);
}
```

Theme colors are selected and contrast-tested per DS-03; no universal brand palette, ban on gradients, or mandatory shadow is introduced. Icons use one coherent library/style; icon-only actions need localized accessible names and shared test IDs under UI-08.

**VIS-06 MUST:** For each important view, exercise real loading/empty/error/success states and plausible difficult content. Decide wrapping or truncation by meaning; provide an accessible way to read truncated values. Keep important amounts and identifiers distinguishable. Inspect actual rendered results; report checks not performed.

```ts
// features/orders/cancel/ui/cancel-order-view.stories.tsx — fixture excerpt
// cancelOrderViewDefaults is the existing typed, sanitized story fixture.
const longContent = {
  ...cancelOrderViewDefaults,
  customerName: 'Alexandra Fernández-Wiśniewska-Kowalczyk',
} satisfies CancelOrderViewProps;
// Render through the same view boundary; no special markup that hides the failure.
```

**Check:** representative container widths, narrow 320 CSS px/reflow, zoom, light/dark, Hebrew/RTL, keyboard, supported screen-reader paths, missing data and long translations. Combine with UI-02's accessibility checks; a screenshot or automated scan alone is not conformance proof. Reuse Storybook/feature fixtures, not a separate production “test data” mode.

**Vary when:** product tasks, script/font metrics or an established DS justify different numeric defaults. Document the chosen presets once; preserve accessibility and ownership requirements. Motion: [interaction guide](12-interaction-and-motion.md).
