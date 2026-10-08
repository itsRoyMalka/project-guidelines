# Backend time and dates

**Applies to:** TypeScript handlers, jobs and persistence that read or decide with time. **Why:** an instant, a calendar date and a local schedule have different meanings. Wire and storage representations remain owned by [API-07](02-api-contracts.md) and [DATA-04](03-data-and-migrations.md); see [domain values](../recipes/domain-values.md).

**TIME-01 MUST:** The BE owns business time decisions: expiry, cutoffs, opening hours, retention and scheduled work. Declare whose IANA time zone defines a local rule (for example, a venue's zone); do not infer it from the server, browser or a numeric UTC offset. The FE formats the result for display.

**TIME-02 MUST:** Use an injected app clock for handler decisions and take one `now` snapshot when one operation needs a consistent answer. Use the DB clock inside an atomic SQL time condition, such as claiming an expired lease. In PostgreSQL, `now()` is transaction-start time, `statement_timestamp()` is statement-start time, and `clock_timestamp()` advances even within a statement. Choose the one matching the decision; do not compare app-clock and DB-clock values within the same atomic decision.

**TIME-03 MUST:** Derive a business date from an instant in the declared business zone; never classify it using the UTC date or a caller's device zone. Follow API-07/DATA-04 for wire/storage types. A `timestamptz` preserves the instant but does not retain the original zone.

**TIME-04 MUST:** Preserve the local date/time or recurrence **and** IANA zone for future local schedules. Define the policy for a nonexistent local time (DST gap), a repeated local time (DST overlap), missed runs and timezone-rule changes. A computed next UTC instant is execution state, not the whole schedule definition.

**TIME-05 MUST:** Name duration units and distinguish elapsed time (`24 hours`) from calendar time (`next local day`). Use half-open `[start, end)` ranges for querying and business windows so adjacent windows do not both include a boundary.

**TIME-06 SHOULD:** Use JavaScript Temporal for date/zone calculations through a small project-owned `shared/time` API; use one selected maintained polyfill where the runtime lacks support. Avoid implicit `Date` parsing, fixed offsets for places, hand-written DST math and multiple competing date libraries. Use a monotonic clock (`performance.now()` or `process.hrtime.bigint()`) for elapsed measurements, not persisted timestamps.

```ts
// shared/time/clock.ts — selected Temporal implementation is exported once.
import { Temporal } from './temporal';
export const systemClock = { now: () => Temporal.Now.instant() };
```

```ts
// features/orders/checkout/handler.ts — clock comes from app composition
import { Temporal } from '../../../shared/time/temporal';
const now = deps.clock.now(); // Temporal.Instant
if (Temporal.Instant.compare(now, reservation.expiresAt) >= 0) {
  throw new ReservationExpiredError();
}

// Good: keep a recurring local business rule, not only its next UTC run.
const opening = { localTime: '09:00', timeZone: 'Asia/Jerusalem' };
// Avoid: { utcTime: '07:00' } — the local hour changes across DST.
```

`systemClock` is wired at app composition; tests supply a fixed clock. The project-owned `shared/time/temporal` export selects native Temporal or the project's verified polyfill. A calendar-only value such as `birthDate: '1990-05-12'` stays a date; do not create an instant from it.

```sql
-- DAL: the lease decision and write use one statement timestamp atomically.
UPDATE jobs
SET claimed_at = statement_timestamp(),
    claimed_by = $2,
    lease_expires_at = statement_timestamp() + $3::interval
WHERE id = $1 AND lease_expires_at <= statement_timestamp()
RETURNING id;
```

The SQL assumes a validated, bounded lease duration and a verified row count; the actual job state machine may need another condition. For ordinary `created_at` defaults, `now()` provides a consistent transaction timestamp, not the commit timestamp.

**Verification:** API tests freeze the app clock at just before/at/after a cutoff; real-DB tests prove time-based conditional writes. Exercise midnight in the business zone, leap day, DST gap/overlap and future schedule behavior after timezone-data changes. Keep hosts synchronized and monitor clock drift where multiple services decide time. **Vary when:** a domain has a documented non-PostgreSQL store or runtime; preserve the same meanings and test its clock semantics. Sources: [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339), [PostgreSQL date/time types](https://www.postgresql.org/docs/current/datatype-datetime.html), [PostgreSQL clock functions](https://www.postgresql.org/docs/current/functions-datetime.html), [Temporal time zones](https://tc39.es/proposal-temporal/docs/timezone.html), [iCalendar recurrence](https://www.rfc-editor.org/rfc/rfc5545), [Node monotonic clock](https://nodejs.org/api/process.html).
