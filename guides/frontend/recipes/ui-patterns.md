# UI foundations and interaction patterns

Applies to [UI rules](../03-ui-and-accessibility.md). Start with the product's supported browser, input and locale matrix.

## Foundation

Choose an actively maintained accessible component library after trying keyboard behavior, labeling, composition, theming and bundle impact on a real form/table/dialog. Wrap only where the product needs stable semantics; do not fork a complete design system first. Define semantic tokens for surface/text/border/focus/intent, spacing, typography and motion. Themes map roles to values; each theme needs contrast checks. Tokens alone cannot prove accessibility.

| Pattern | Expected behavior | Evidence |
| --- | --- | --- |
| Form | Persistent label, help/error association, pending and success feedback | Keyboard submit, error focus, screen reader name/error |
| Table | Header relationships, sort state, labeled pagination and actions | Screen reader navigation; stable loading/empty/error states |
| Dialog | Accessible name, appropriate focus placement/containment, close behavior, return focus | Keyboard and assistive technology check |
| Destructive action | Explain impact; use undo when truly reversible, confirmation when costly/irreversible | No accidental duplicate action; recovery path works |
| Async content | Preserve useful context, expose progress/status without noisy announcements | Slow network, retry and empty-state action |

## Responsive and inclusive behavior

Test narrow viewport and zoom without loss of controls/content. A genuine two-dimensional data table may use accessible horizontal overflow; keep surrounding content reflowing and expose overflow discoverably. Do not convert tables into unlabeled visual cards just to remove scrolling. Preserve focus visibility, adequate targets, contrast and meaningful reading order. Automated accessibility scans supplement manual keyboard and representative screen-reader checks against the chosen WCAG 2.2 target.

Use logical CSS properties. Format numbers/dates with locale-aware APIs and distinguish display locale from scheduling timezone. Translate complete messages with plural rules; avoid concatenation. Test long strings and only the RTL locales actually supported. Empty/error copy says what happened and gives a useful next action without exposing internals.

Honor reduced-motion preferences; avoid essential information conveyed only by animation or color. Test semantic light/dark themes and representative loading/error/empty/disabled/focus states. Visual regression uses stable fixtures, meaningful viewport/theme coverage and reviewed diffs; a pixel match is not usability proof.

## Completion

Attach the browser/locale/input matrix, manual checks, automated findings and representative screenshots to the consuming change. Record unsupported combinations explicitly. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) defines criteria, not a universal widget implementation.
