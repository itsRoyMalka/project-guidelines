# Form and URL ownership

Owners: [STATE rules](../02-state-and-forms.md), [ROUTE rules](../05-routing-and-access.md).

```text
pages/orders/page.tsx
pages/orders/{params,use-order-params}.ts
features/orders/browse/api/{get-orders,query-options,use-orders}.ts
features/orders/browse/ui/search-form.tsx
```

Applied search/filter/page lives in typed URL state. React Hook Form holds the editable draft; submit commits the draft and resets page atomically. Query keys include those params plus trusted visibility scope. Back/Forward resets the draft deliberately without remounting the input. Live search debounces commits and distinguishes its own writes from external navigation.

Save updates server data and resets form baseline on confirmed success. Discard returns to the latest known saved snapshot. Failed save keeps edits; a background response cannot overwrite dirty data. Forms use DS fields and preserve accessible focus/error association.

**Proof:** share/reload/Back, stale response cancellation, invalid submit, failed save and concurrent refresh. A scoped feature editor can use a private store; an SSR app cannot share a mutable singleton across requests.

### Example: successful save baseline

```ts
// features/orders/edit/ui/use-order-form.ts — existing RHF form + API hook
const submit = form.handleSubmit(async draft => {
  try {
    const saved = await updateOrder.mutateAsync(toUpdateOrderInput(draft));
    form.reset(toOrderDraft(saved));
  } catch (error) {
    applyOrderFormErrors(form, toSafeApiError(error));
  }
});
```

Disable editing while this submission is pending, or reconcile any edits made after the submitted snapshot before reset. The draft schema/defaults and field-error mapper are flow-owned; failed save preserves input. A background refresh does not call this reset on a dirty form.
