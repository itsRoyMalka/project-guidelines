# Frontend feature flows

**Scope:** React web applications and each MFE. **Why:** keep a user flow and its data behavior together.

```text
src/
  app/{routes,providers,store}.tsx
  pages/orders/{page.tsx,params.ts,sections.ts}
  features/orders/
    browse/
      api/{get-orders,query-options,use-orders}.ts
      ui/order-list/{order-list,order-list.skeleton}.tsx
      lib/                       # optional pure helpers
      browse.test.tsx
    cancel/{api,ui}/
    shared/api/query-keys.const.ts
    store/                       # only truly global client state
    messages/{en,he}.json
    index.ts
  shared/api/{client,use-api}.ts
  test/{render,fixtures,handlers}.ts
```

**FE-01 MUST:** Use app → pages → features → shared. Group feature flows such as browse/details/cancel; reuse through feature public exports. Enforce resolved import boundaries and cycles in CI; no cross-app private imports.

**FE-02 SHOULD:** UI imports its flow's API hook and pure helpers. A smart view coordinates the flow; children accept data/callbacks. A separate `model/` exists only for substantial non-API interaction logic.

**FE-03 MUST:** In the split/mobile profile, keep plain requests, Query options, key constants and hooks in `api/`. `shared/api` owns the injectable client and raw HTTP. Requests accept the client and work without React; `useApi()` retrieves it from context.

**FE-04 SHOULD:** Pages compose public feature surfaces. Related skeletons and presentation files live under the view's domain name. Use router splitting; add manual optimization only for measured needs.

**FE-05 MUST:** Render loading, empty, error, denied, data and mutation-pending states. Preserve usable data during failed background refresh; backend permissions remain authoritative.

**FE-06 SHOULD:** Choose MFE only for justified independent runtime delivery. The host owns session, routing, i18n and telemetry; remotes use typed host contracts and test supported mixed versions, failure fallback and recovery.

**FE-07 MUST:** Compose shared providers in `app/providers.tsx`; adapters implement external access and hooks expose small APIs. Providers own lifecycle, cleanup and scope, never domain policy or one request per consumer.

Fullstack route data follows the [router profile](../profiles/typescript-fullstack.md); do not add Query as a second owner of the same data.

**Check:** trace UI → hook → plain request → shared client/contract. **Vary when:** framework route filenames may differ; ownership and import rules remain. Source: internal review record (not distributed), [React context](https://react.dev/learn/passing-data-deeply-with-context).
