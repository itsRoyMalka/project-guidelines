# TypeScript code conventions

**Applies to:** frontend, backend, and shared TypeScript packages. Product-specific examples do not override external contract schemas.

**TS-01 MUST:** Enable `strict`; keep type errors at zero in changed code. Treat external JSON, environment input, storage, and third-party callbacks as `unknown` until parsed or narrowed. Avoid `any`; document a narrow boundary when a third-party type forces it.

**TS-02 SHOULD:** Prefer discriminated unions and `as const` maps to TypeScript `enum` for application states and wire values. A generated contract's enum remains authoritative when that contract owns it. Exhaustively handle variants.

```ts
type Job =
  | { status: 'queued' }
  | { status: 'running'; startedAt: string }
  | { status: 'failed'; code: string }
  | { status: 'done'; resultId: string };
```

**TS-03 MUST:** Distinguish absence, null, and failure. Do not use non-null assertions to bypass an unproven condition. Name temporal units (`timeoutMs`, `durationSeconds`) and preserve UTC instants separately from calendar dates.

**TS-04 SHOULD:** Use pure functions for transformations and classes only for stateful instances or framework-required interfaces. Keep side effects at adapters, handlers, and composition roots. Do not turn a module into a class merely to group functions.

**TS-05 MUST:** Await or explicitly handle promises. Bound concurrency for external calls. Retry only operations shown to be idempotent or protected by an idempotency key. Do not swallow errors or log and rethrow the same error at every layer.

**TS-06 SHOULD:** Name functions for behavior, types for domain concepts, and files by their owning feature. Use comments to explain non-obvious constraints and decisions; make ordinary code self-explanatory. Prefer named exports and short public APIs.

**TS-07 MUST:** Format and lint in CI with one workspace configuration. Project-specific restrictions may enforce boundary rules from [repository structure](03-repository.md). Avoid arbitrary line/file limits as a substitute for cohesive responsibilities.

**Verification:** strict typecheck, lint, and a code review of trust boundaries. Further reading: [TypeScript strict](https://www.typescriptlang.org/tsconfig/strict).
