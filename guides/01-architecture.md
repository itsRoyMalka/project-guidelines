# Architecture selection

**Applies to:** new products and major boundary changes. See [repository shape](03-repository.md) for directories and [service design](backend/01-service-design.md) for internal layers.

## Default

**ARCH-01 MUST:** Write a short architecture brief before selecting framework or deployment shape. Name users, core journeys, bounded domains and data owners, tenant/trust boundaries, external dependencies, latency/availability needs, expected scale, and team/release ownership. Record the chosen option and a trigger to revisit it.

**ARCH-02 SHOULD:** For one product team, start with one backend deployable organized by domain and one frontend deployable organized by feature. They build and deploy separately, even if they share a repository. Keep domain boundaries explicit so extraction remains possible.

**ARCH-03 MUST:** One module/service owns each durable data set and all writes to it. Other modules use its public operations. A separately deployed service never imports another service's source or reads its tables directly.

**ARCH-04 SHOULD:** Use synchronous calls when a user needs an immediate answer. Use a queue or durable workflow for slow, retryable, externally triggered, or long-running work. A domain event reports a fact that already occurred; it is not an untracked substitute for a command.

**ARCH-05 MUST:** Add a deployable service only for a named need: independent ownership/release, distinct scaling/runtime, failure isolation, or a trust/compliance boundary. Document contract, data owner, failure handling, and operational cost. Module Federation has the same bar for frontend apps: use it for independently owned runtime-composed apps, not for ordinary feature folders.

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
