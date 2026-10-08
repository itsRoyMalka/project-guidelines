# UI composition example

Owners: [UI](../03-ui-and-accessibility.md), [DS](../04-design-system.md).

```text
features/orders/browse/ui/order-list/
  order-list.tsx
  order-list.skeleton.tsx
  order-row.tsx
```

The feature view connects its API hook and renders loading/empty/error/data using DS primitives. The skeleton describes this view's structure. Presentational rows take data/callbacks; backend capabilities decide which business actions are available.

```tsx
<OrderRow order={order} onCancel={cancel}
  testId={OrderTestId.row(order.id)} />
```

Use logical spacing and mobile-first composition; check both directions, long translation, zoom and keyboard focus. DS components own behavior such as labels, dialog focus and reduced motion; feature tests verify the composed flow.
