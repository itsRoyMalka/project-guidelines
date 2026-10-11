# Frontend time and dates

**Applies to:** web UI and browser-side feature code; the mobile profile adopts these rules with its runtime's verified `Intl`/Temporal support. **Why:** the UI must show and collect the user's intended time without changing its meaning. The [shared BE time guide](../backend/shared/02-data-and-time.md) owns business decisions.

**FTIME-01 MUST:** Format instants with an explicit locale and IANA display zone from the user, resource or product policy. Label the zone when ambiguity matters. Do not silently use the browser's current zone; account for SSR and hydration using the same known zone or defer localized rendering until it is known.

**FTIME-02 MUST:** Keep a date-only form value as `YYYY-MM-DD` and format it without converting it to an instant. A local appointment form collects local date/time and the intended IANA zone, then sends those values or an explicitly confirmed instant according to its contract. Never turn a date-only value into a JavaScript `Date` just to submit it; do not silently resolve a DST gap/overlap.

**FTIME-03 MUST:** Treat the browser/device clock as a display aid only. Countdown and disabled states improve the UI, but the BE makes the final expiry or cutoff decision. Handle a BE rejection even if the UI timer showed time remaining.

**FTIME-04 SHOULD:** Own formatting and parsing helpers in shared `time/`, using `Intl.DateTimeFormat` for display and JavaScript Temporal for calendar/zone calculations. Select and verify one maintained Temporal polyfill for unsupported browsers/mobile runtimes. Avoid feature-specific date libraries, implicit `Date.parse`, `toLocaleString()` without a zone and hand-written offset arithmetic.

```ts
// shared/time/format-instant.ts — createdAt is a validated UTC instant string.
export function formatInstant(createdAt: string, locale: string, timeZone: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt));
}

formatInstant(order.createdAt, locale, user.timeZone); // good: explicit display zone
// Avoid: new Date(order.createdAt).toLocaleString(); // device zone is implicit

const birthDate = '1990-05-12'; // good: date-only form and API value
// Avoid: new Date(birthDate).toISOString(); // creates an unrelated instant

const appointment = {
  localDate: '2026-10-08',
  localTime: '09:00',
  timeZone: 'Asia/Jerusalem',
}; // good: send local intent; BE validates and applies its DST policy
```

The `Date` in `formatInstant` is only an `Intl` bridge for an already validated instant; it is not used for date-only values or calendar arithmetic.

**Verification:** feature tests render the same instant in two zones, keep date-only values unchanged, cover DST gap/overlap input and confirm that a server-side expiry error is shown. For SSR, verify server and hydrated markup use the same declared zone. **Vary when:** a project has a supported internationalization stack that provides equivalent explicit-zone behavior; document its one shared adapter. Sources: [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat), [Temporal availability](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal), [Temporal calendar dates](https://tc39.es/proposal-temporal/docs/plaindate.html).
