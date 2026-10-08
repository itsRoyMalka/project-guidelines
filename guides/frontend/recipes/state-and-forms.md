# Form and URL ownership

Owners: [STATE rules](../02-state-and-forms.md), [ROUTE rules](../05-routing-and-access.md).

```text
pages/orders/{page,params,use-order-params}.ts
features/orders/browse/api/{get-orders,query-options,use-orders}.ts
features/orders/browse/ui/search-form.tsx
```

Applied search/filter/page lives in typed URL state. React Hook Form holds the editable draft; submit commits the draft and resets page atomically. Query keys include those params plus trusted visibility scope. Back/Forward resets the draft deliberately without remounting the input. Live search debounces commits and distinguishes its own writes from external navigation.

Save updates server data and resets form baseline on confirmed success. Discard returns to the latest known saved snapshot. Failed save keeps edits; a background response cannot overwrite dirty data. Forms use DS fields and preserve accessible focus/error association.

**Proof:** share/reload/Back, stale response cancellation, invalid submit, failed save and concurrent refresh. A scoped feature editor can use a private store; an SSR app cannot share a mutable singleton across requests.
