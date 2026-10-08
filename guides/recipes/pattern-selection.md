# Select a pattern for a concrete problem

Read when adding an abstraction. Owners: ARCH-03/05, BE-03/05, TS-04, REPO-03. A pattern is useful when it makes a current invariant or boundary clearer; complexity alone does not justify more layers.

| Need | Useful pattern | Simpler alternative / avoid when |
| --- | --- | --- |
| Replace a provider or isolate its API | Adapter with a narrow application-owned port | Direct local function for stable, trivial behavior |
| Several algorithms with the same domain contract | Strategy selected at composition | Plain conditional with two small obvious branches |
| Valid transitions and impossible state combinations | Discriminated union and explicit state machine | Ordinary value when no lifecycle exists |
| One operation commits several owned changes | Transaction/unit-of-work boundary | One atomic statement if sufficient |
| Translate another domain's meanings | Anti-corruption adapter at integration boundary | Reuse an already identical public contract |
| Long work needing durable timers/resumption | Durable workflow with explicit compensations | Short queue job when independent and repeatable |
| Shared behavior with stable consumers | Focused module/package | Local duplication while meanings/lifecycles differ |

Composition wires dependencies once at the runtime boundary; it need not use a dependency-injection container. Prefer explicit clock/client arguments when tests need control. Keep business policy out of generic base classes and “universal” CRUD repositories. Value objects/classes are legitimate when they enforce invariants; global singleton mutable state needs lifecycle and concurrency proof.

```ts
// features/orders/shared/handler.shared.ts — pure decision helper
// OrderStatus is the shared contract constant/type.
function canCancelOrder(status: OrderStatus): boolean {
  return status === OrderStatus.Pending;
}
```

The pure decision is separate from authorization, conditional persistence and notification; it does not prove atomicity. **Verification:** show the concrete problem, responsibility owner, dependency direction and one failure test. **Exception:** preserve a framework-required abstraction or working existing pattern when its cost is understood. This catalog is a design aid, not a mandate to introduce every pattern.
