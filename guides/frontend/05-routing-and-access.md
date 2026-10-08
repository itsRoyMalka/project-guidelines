# Routes, deep links and access

**Scope:** app/page composition. **Why:** refresh, login and direct links must preserve valid user intent.

**ROUTE-01 MUST:** App owns route map/access metadata; pages own typed URL codecs, defaults, update actions, section IDs and link builders. Path identifies resource, query applied state, hash rendered section.

**ROUTE-02 MUST:** Use named Public, GuestOnly, Authenticated and Action policies. Every protected loader/action checks access because parent/child loaders can run concurrently. Backend checks every request independently.

**ROUTE-03 MUST:** Unauthenticated users get login with a validated internal return path; authenticated denial gets 403 and missing routes/resources get 404. Identity callbacks are separate protocol endpoints with state/nonce validation. Never turn 403 into a login loop.

**ROUTE-04 MUST:** Decode/sanitize parameters and encode with URLSearchParams, preserving unrelated keys. Update related filter/page state atomically; clear selected items only when known invalid. Use push for deliberate navigation and replace for rapid live edits.

**ROUTE-05 MUST:** Links include the tab/filter needed to reveal their target. Static sections use anchors; async sections wait until rendered, then scroll/focus with sticky-header spacing. Missing sections leave the page usable.

**ROUTE-06 MUST:** `useCan(Action)` uses verified session grants; resource `allowedActions` reflects server policy. Gate UI without duplicating eligibility rules. On logout/scope/grant change, cancel old requests and clear/partition protected caches, drafts and client state.

```text
/orders/42?tab=history#payment
app/routes.ts
pages/order-details/{page.tsx,params.ts,sections.ts}
```

**Check:** guest/denied/allowed direct links, safe return, Back/Forward, refresh, async section and revoked access. **Vary when:** framework-owned routing files preserve the same policy. Sources: [React Router routes](https://reactrouter.com/start/framework/route-module), [OWASP redirects](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html).
