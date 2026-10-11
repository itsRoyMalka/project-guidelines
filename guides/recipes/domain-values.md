# Values that survive boundaries

Read for wire types, storage models and business calculations. Owners: TS-03, API-07, DATA-04, ANA-02. These choices prevent accidental loss of meaning; contract requirements may select a different explicit representation.

| Concept | Selected representation | Failure to avoid |
| --- | --- | --- |
| Instant | Offset-bearing timestamp; normalize to UTC and state precision | Treating a local wall time as an instant |
| Calendar date | Validated YYYY-MM-DD date without timezone conversion | A birthday shifting to yesterday |
| Future local schedule | Local time/date or recurrence plus IANA zone and DST ambiguity policy | UTC-only storage changing intended local meeting time |
| Duration | Numeric value with unit in name/contract | Mixing milliseconds and seconds |
| Money | Currency plus integer minor units within safe range, or decimal string plus decimal arithmetic | Floating point totals and assuming every currency has two decimals |
| Large integer | Decimal string on JSON boundaries when outside JS safe integer range | Rounding an identifier or counter during parse |
| ID | Stable opaque identifier with documented scope; validate format | Treating unguessable IDs as authorization |

For money, define rounding mode and stage, currency precision, overflow bounds, and who converts exchange rates. Never add different currencies without an explicit conversion policy. For schedules, decide what happens at a skipped/repeated local time and when timezone rules change. Retain the original business intent, not only a computed next instant.

```ts
// packages/contracts/shared/domain-values.ts — illustrative wire types
type Money = { currency: string; amountMinor: string };
type LocalSchedule = {
  localTime: string;
  timeZone: string;
  gap: 'skip' | 'next-valid';
  overlap: 'earlier' | 'later';
};
```

These shapes still require runtime validators; they do not implement arithmetic or recurrence. **Proof:** decimal rounding boundaries, safe-integer overflow, negative/refund rules, leap dates and DST gap/overlap. **Alternative:** use a maintained domain library with contract-compatible serialization; avoid writing your own date or decimal engine. Platform behavior: [PostgreSQL numeric types](https://www.postgresql.org/docs/current/datatype-numeric.html), [date/time types](https://www.postgresql.org/docs/current/datatype-datetime.html).
