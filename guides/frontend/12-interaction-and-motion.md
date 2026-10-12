# Interaction and motion

**Scope:** web product UI. Native implementations use platform tools and preferences. **Why:** communicate state and continuity without delaying work. Numeric timings are house starting values; DS owns reusable behavior and features own business outcomes.

**MOT-01 SHOULD:** Name the purpose before adding motion: feedback, spatial continuity or state explanation. Frequent actions should feel immediate. Prefer no motion when it adds no information; reserve decorative sequences for appropriate product contexts. Keyboard use alone neither requires nor forbids animation.

```text
Design decision: cancel-order submission
Immediate: show pending label; prevent repeat submission
Motion: short button color transition; no minimum spinner duration
Outcome: inline error/retry or completed state when the actual request settles
```

**MOT-02 SHOULD:** Start with 120ms feedback, 180ms small overlay and 240ms larger overlay transitions. Use named duration/easing tokens; specify transitioned properties. Use CSS for simple state transitions, and add a motion library only for needs such as gestures, springs or coordinated exits. Existing coherent motion tokens take precedence.

```css
/* apps/web/src/shared/ui/tokens.css — web DS token output */
:root {
  --motion-feedback: 120ms; --motion-overlay: 180ms; --motion-panel: 240ms;
  --ease-responsive: cubic-bezier(.2, .8, .2, 1);
}
/* apps/web/src/shared/ui/button/button.css */
.ds-button {
  transition: background-color var(--motion-feedback) var(--ease-responsive);
}
@media (hover: hover) and (pointer: fine) {
  .ds-button:not(:disabled):hover { background: var(--color-action-hover); }
}
/* Focus/pressed states remain visible even with zero transition duration. */
.ds-button:not(:disabled):active { background: var(--color-action-pressed); }
.ds-button:focus-visible {
  outline: var(--focus-width) solid var(--color-focus);
  outline-offset: var(--focus-offset);
}
```

Theme defines contrast-verified action/hover/pressed/on-action/focus roles; start focus width and offset at 2px each, verified against adjacent surfaces. Do not apply `transition: all`, a mandatory scale effect to every button, or hover-only access to an action.

**MOT-03 MUST:** Respect reduced-motion preferences, keep controls usable during transitions, and handle rapid reversal without stale state or timers delaying actions. Preserve focus management and semantics from the selected behavior library; an exit effect must not leave an invisible focused control.

```css
/* apps/web/src/shared/ui/popover/popover.css — DS animation excerpt */
/* Open/closed attributes and focus lifecycle belong to the chosen behavior adapter. */
.ds-popover {
  opacity: 1;
  transition: opacity var(--motion-overlay) var(--ease-responsive);
}
.ds-popover[data-closed] { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .ds-button, .ds-popover { transition: none; }
}
```

This shows only visual styles, not a complete popover: the DS adapter must remove closed content from interaction/accessibility exposure and manage mounting/focus. Any added movement, keyframes or library animations must also honor the preference. Essential progress remains understandable through text/state even when nonessential motion is removed.

**MOT-04 SHOULD:** Prefer transform/opacity for movement/fades; profile layout/paint-heavy effects on supported browsers and lower-powered devices. Hardware acceleration is conditional, not guaranteed by choosing CSS or a property. Scope motion to affected content instead of animating every row on each update.

```text
Review example: expanding order details
Risk: animating height can lay out the surrounding list repeatedly
Choice: instant expansion by default; animate only if it improves orientation
Proof if animated: inspect layout/paint and dropped frames with realistic row counts;
test reversal, reduced motion and keyboard focus on a lower-powered target
```

**Check:** pending/error/success, repeated clicks, rapid open/close, keyboard, touch, reduced motion and actual browser performance. Match UI-02 and DS-06 verification. **Vary when:** a gesture or explanatory sequence needs different timing; record purpose and measured cost. Never add fake delays to let an animation finish.

 Further reading: [Motion performance](https://motion.dev/docs/performance), [W3C interaction animation](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). WCAG 2.3.3 is AAA; this handbook independently selects reduced-motion behavior as a DS requirement, without calling it an AA criterion.
