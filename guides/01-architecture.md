# Architecture selection

**Applies to:** new products and major boundary changes. See [repository shape](03-repository.md) for directories and [service design](backend/01-service-design.md) for internal layers.

## Default

**ARCH-01 MUST:** Before choosing a new architecture, record users, acceptance examples, domains/data owners, trust boundaries, dependencies, load/latency, availability/recovery, data classification/retention, cost and team constraints. State assumptions, selected option and revisit trigger. A small product can use a brief paragraph; see [product planning](07-product-and-decisions.md).

**ARCH-02 SHOULD:** Start with one cohesive product and explicit domain modules. Choose a [single full-stack deployable](profiles/typescript-fullstack.md) for shared ownership and one web runtime, or [separate web/API deployables](profiles/typescript-split.md) for separate clients, hosting, trust, scaling or releases. Neither shape is a quality tier. Add independent services only under ARCH-05.

**ARCH-03 MUST:** Give every durable dataset one write owner and public operations. Runtime consumers use owned contracts, not another service's implementation or private tables. Owner-published read models, CDC and analytical replicas are allowed with a versioned data/access contract. Controlled migrations, backfills and repair tools have explicit owner, scope and recovery proof.

**ARCH-04 SHOULD:** Use synchronous calls when a user needs an immediate answer. Use a queue or durable workflow for slow, retryable, externally triggered, or long-running work. A domain event reports a fact that already occurred; it is not an untracked substitute for a command.

**ARCH-05 MUST:** Add a deployable service for a named need: independent ownership/release, distinct scale/runtime, failure isolation or trust boundary. Document contract, data owner, failure handling and operational cost. Runtime frontend composition needs a similar justification and proven host/remote mixed-version compatibility; Module Federation alone does not make deployment independent.

## Architecture brief

```text
Product and primary journeys:
Domains and data owners:
Tenant, identity, and trust boundary:
Deployables and why:
Synchronous and durable asynchronous paths:
Expected load, latency, and availability:
External systems and failure modes:
Rejected alternatives and revisit trigger:
```

**Alternatives:** microservices from day one for hard isolation or independent teams; separate repositories for access/release boundaries; one full-stack deployable for a small product with one runtime. Each is a scoped decision, not a quality tier.

**Verification:** every deployable and database has a named owner, and the architecture brief explains why it exists.

### Example: one backend deployable, clear feature owners

```ts
// apps/api/src/app/create-app.ts — project-owned composition API
const app = createApiApp({ config, db, integrations });
app.registerFeatures([ordersFeature, paymentsFeature]);
await app.ready();
```

Orders and Payments own their data and public operations; API composition joins them without a service-to-service call. Add a separate backend service only when ARCH-05 has a named reason. The app factory, feature manifests and startup checks are defined by the consuming project; see [service design](backend/01-service-design.md) and the [split profile](profiles/typescript-split.md).
