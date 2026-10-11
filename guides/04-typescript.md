# TypeScript code conventions

**Applies to:** frontend, backend, and shared TypeScript packages. Product-specific examples do not override external contract schemas.

**TS-01 MUST:** Use strict checking for new TypeScript packages and check affected packages plus consumers. Track inherited errors separately without introducing new ones. Parse genuinely untrusted JSON/config/storage as unknown; typed library callbacks need not be revalidated solely because they are external functions. Avoid any except a narrow documented adapter. Evaluate noUncheckedIndexedAccess and exactOptionalPropertyTypes deliberately; runtime validation is separate.

```ts
// apps/api/src/config/read-settings.ts — Node; env is untrusted at this boundary.
const settingsSchema = z.object({ PORT: z.coerce.number().int().min(1).max(65535) });
export const settings = settingsSchema.parse(process.env);
```

**TS-02 MUST:** Declare domain/protocol values once in typed `as const` maps or justified enums: actions, states, events/jobs, routes, params and test IDs. Import them at call sites; use exhaustive mappings/switches. Ordinary prose and declaration literals do not need constants.

```ts
// packages/contracts/jobs/job.const.ts — declaration source
export const JobStatus = {
  Queued: 'queued', Running: 'running', Failed: 'failed', Done: 'done',
} as const;
type Job =
  | { status: typeof JobStatus.Queued }
  | { status: typeof JobStatus.Running; startedAt: string }
  | { status: typeof JobStatus.Failed; code: string }
  | { status: typeof JobStatus.Done; resultId: string };
```

`startedAt` is a validated UTC instant at the wire boundary; the TS type alone does not validate its format. Consumers compare with `JobStatus.*`, not repeated strings.

**TS-03 MUST:** Distinguish absence, null and failure; narrow before dereferencing and do not assert away uncertainty. Name temporal units. Separate instants, calendar dates and future zoned schedules; use deliberate money/large-number representations described in [domain values](recipes/domain-values.md). Apply the [BE](backend/typescript/14-time-and-dates.md) or [FE](frontend/10-time-and-dates.md) time guide at the relevant boundary.

```ts
// features/orders/shared/format-delivery.ts — pure TS; null is an explicit absence.
function formatDelivery(instant: string | null, locale: string, timeZone: string) {
  if (instant === null) return undefined;
  return new Intl.DateTimeFormat(locale, { timeZone, dateStyle: 'medium' }).format(new Date(instant));
}
```

**TS-04 SHOULD:** Prefer simple functions and cohesive values. Use classes when they improve invariants, lifecycle or framework integration; value objects are valid. Keep business decisions separate from I/O and avoid classes or interfaces that merely add ceremony. See [pattern selection](recipes/pattern-selection.md).

**TS-05 MUST:** Await promises or assign explicit lifecycle/error ownership to background work. Propagate cancellation and deadlines where supported; bound external concurrency and resource use. Retry only when the actual operation is safe or atomically deduplicated, not merely because a key is present. Preserve causes and avoid duplicate boundary logging.

```ts
// features/orders/cancel-order/handler.ts — awaited effect; caller owns the boundary log.
try {
  return await deps.orders.cancel(input, { signal: context.signal });
} catch (cause) {
  throw new CancelOrderError('Cancellation failed', { cause });
}
```

**TS-06 SHOULD:** Name functions for behavior, types for domain concepts, and files by their owning feature. Use comments to explain non-obvious constraints and decisions; make ordinary code self-explanatory. Prefer named exports and short public APIs.

**TS-07 MUST:** Use a shared formatting/lint baseline with scoped frontend, backend and generated-code overrides as needed. CI checks affected code and consumers. Enforce meaningful import rules; arbitrary file-length limits are not substitutes for cohesion.

## Runtime and module contract

Choose package module format, emitted target and resolution for the actual runtime. A browser bundle, Node server and published library need not share identical tsconfig output settings. `moduleResolution: bundler` is suitable only when a compatible bundler/loader owns execution; it does not prove emitted imports run directly in Node. Keep browser-safe exports separate from server code, declare supported package exports, and test the produced artifact with its real host. Framework-required default exports are valid under REPO-05. Generated code has a separate ownership/formatting policy; never patch a generated type as the source of truth.

**Verification:** strict typecheck, lint, and a code review of trust boundaries. Further reading: [TypeScript strict](https://www.typescriptlang.org/tsconfig/strict).
