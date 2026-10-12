# Implement the project-owned APIs

**Scope:** custom helpers named in handbook snippets. These names describe contracts to implement in the adopting project; they are not packages to install or APIs to retrieve from another repository. Use your selected framework behind these boundaries. Imports and uninteresting glue may be abbreviated in examples; required behavior must remain explicit.

## Contract map

| Boundary | Minimum behavior | Local specification and proof |
| --- | --- | --- |
| `defineEndpoint` | Register method/path, validate wire inputs/outputs, enforce explicit access policy, invoke the action, map failures once | [API contracts](../backend/typescript/02-api-contracts.md), [contract adapter](../backend/typescript/recipes/contracts.md) |
| `defineHandler` / `ctx.call` | Bind trusted dependencies, start or join selected transaction, propagate context, enforce rollback-only failure, record required audit before commit | [Action lifecycle](../backend/shared/01-actions-and-boundaries.md), [TS transaction semantics](../backend/typescript/recipes/transactions.md), [Python lifecycle](../backend/python/recipes/action-lifecycle.md) |
| `defineEvent` / outbox / consumer | Validate the committed fact; save intent with state; relay after commit; deduplicate consumer effects and acknowledge only after success | [Events](../backend/typescript/04-events-and-workflows.md), [outbox and consumer proof](../backend/typescript/recipes/outbox-and-consumers.md) |
| Provider port and adapter | Own the internal input/result shape, translate provider data/errors, enforce deadlines and retry/idempotency policy | [Integrations](../backend/typescript/05-integrations.md), [Python providers](../backend/python/05-integrations-and-work.md) |
| Job/worker adapter | Validate the envelope, dispatch the registered action, preserve identity, cancellation and retry semantics | [Background jobs](../backend/typescript/08-background.md) |
| `createApiTestContext` | Allocate isolated state, build the real app, bind helpers, record external effects, clean partial setup and drain workers during teardown | [BE fixture lifecycle](../backend/typescript/07-testing.md), [Python fixture](../backend/python/recipes/test-harness.md) |
| `renderFeature` | Render real feature UI with fresh router/locale/data-client state; replace HTTP at the boundary and clean it after each test | [FE tests](../frontend/07-testing.md) |
| E2E `createOrder` | Perform the user's UI steps using shared test IDs; return a stable identity; keep business assertions in the spec | [E2E journeys](../e2e/01-journeys.md) |
| DS `Panel`, `Stack`, `Button` | Own semantic HTML, tokens, interaction and accessibility; expose typed product APIs and forward test IDs | [DS](../frontend/04-design-system.md), [layout defaults](../frontend/11-visual-composition.md) |

## Build only the selected boundary

```text
Target-project implementation order
1. Read the local owning guide and its failure cases.
2. Define the smallest typed input/result/context needed by the first action.
3. Bind the framework/provider in app composition.
4. Implement required failure/lifecycle guarantees, then the happy path.
5. Verify the boundary once with shared infrastructure tests.
6. Add the feature's focused behavior test using that proven boundary.
```

For example, a handler transaction wrapper is not complete just because it calls the ORM transaction method:

```text
Nested transaction test — TS or Python target project
Given: a root action writes an order, then invokes a participating child
When: the child writes and throws, and the root catches that failure
Then: the wrapper rejects root completion; neither write nor success audit/outbox commits
Owner: shared handler infrastructure test; feature tests need not duplicate it
```

No adapter promises a capability its provider cannot implement. Select a supported provider, implement and test the missing semantics, or reject the configuration before accepting work. Keep optional wrappers out of simple actions until they enforce a real repeated concern.

**Verification:** a new reader can explain the custom API's lifecycle and failure semantics using only these local links. Executable implementation belongs to the target project and still needs checks against its chosen library versions. Public documentation may clarify library syntax; it does not supply missing handbook conventions.
