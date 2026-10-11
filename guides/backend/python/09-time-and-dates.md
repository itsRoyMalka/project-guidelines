# Python backend time and dates

**Scope:** Python contracts, handlers and persistence that read or decide with time. Shared [time meanings](../shared/02-data-and-time.md) are canonical; this guide selects Python/PostgreSQL types. **Why:** a timestamp string, calendar date and future local schedule cannot be interchanged safely.

**PYTIME-01 MUST:** Represent an instant as an aware UTC `datetime` in Python and an ISO 8601 string with offset on the wire. Reject naive instants at external boundaries. For PostgreSQL store instants as `timestamp with time zone`; it normalizes to UTC internally but does not preserve the original zone. `date` represents a calendar-only value.

```python
# features/orders/shared/time_contract.py — Python wire boundary
class ReservationView(BaseModel):
    expires_at: AwareDatetime
    service_date: date
# Model serializer emits an offset-bearing ISO instant; tests assert the wire form.
```

**PYTIME-02 MUST:** Use `ZoneInfo` with the business entity's declared IANA zone for local dates, cutoffs and schedules. Store a future recurring schedule as local date/time, zone and recurrence policy; an offset alone cannot express future daylight-saving changes. Test ambiguous and nonexistent local times according to product policy.

```python
# features/orders/booking/handler.py — Python business decision
local_today = ctx.clock.now().astimezone(ZoneInfo(venue.time_zone)).date()
if requested_service_date < local_today:
    raise ServiceDateInPast()
```

**PYTIME-03 MUST:** Inject a clock into decisions and choose one owner for audit timestamps: DB default for row history or application clock when it must align with action decisions. Do not call `datetime.now()` throughout handlers; never use naive `datetime.utcnow()` as an instant. Persist time units explicitly in names/types.

```python
# app/clock.py — Python production adapter
class SystemClock:
    def now(self) -> datetime:
        return datetime.now(UTC)
# Test adapter returns a fixed aware UTC value across a DST boundary.
```

**PYTIME-04 MUST:** Avoid arithmetic on formatted local strings or fixed UTC offsets for business schedules. Convert at the boundary and compare like types; use `timedelta` for durations and name raw numeric units. For MySQL, validate a deliberate UTC `DATETIME` encode/decode convention because the column itself carries no timezone.

```python
# features/orders/shared/expiration.py — Python duration, not a local clock string
def require_aware_utc(value: datetime) -> datetime:
    if value.tzinfo is None or value.utcoffset() is None:
        raise InvalidInstant()
    return value.astimezone(UTC)

expires_at = require_aware_utc(created_at) + timedelta(minutes=hold_minutes)
```

**Verification:** API round-trip, UTC DB round-trip, DST gap/fold, future schedule after rule changes, fixed-clock expiration and old data migration. **Exception:** a product with only UTC instants omits future-schedule machinery. Sources: [Python datetime](https://docs.python.org/3/library/datetime.html), [zoneinfo](https://docs.python.org/3/library/zoneinfo.html), [Pydantic AwareDatetime](https://docs.pydantic.dev/latest/api/types/#pydantic.types.AwareDatetime), [PostgreSQL time](https://www.postgresql.org/docs/current/datatype-datetime.html).
