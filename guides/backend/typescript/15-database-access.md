# TypeScript database context and configuration

**Scope:** Prisma-backed TypeScript services. Existing [DATA rules](03-data-and-migrations.md) own schema/migrations; shared [access](../shared/database/01-identities-and-access.md) and [connections](../shared/database/02-connections-and-isolation.md) own guarantees. **Why:** DALs should work with the provided client without deciding transaction lifetime.

**TSDB-01 MUST:** Name the DAL execution parameter `db`; expose only the generated delegates/operations the feature needs. Regular and transaction-bound clients satisfy the same structural interface. Do not expose `$transaction`, disconnect or fallback client creation in DAL helpers. Preserve generated enum-to-wire mapping at the DAL boundary.

```ts
// src/features/orders/shared/dal.shared.ts — Prisma generated types
import { type PrismaClient, OrderStatus as DbOrderStatus } from '../../../generated/prisma/client';
// Configured generated path; Prisma ORM 7 enum representation (DATA-08).
export type OrdersDb = Pick<PrismaClient, 'order'>;

export async function cancelIfPending(db: OrdersDb, orderId: string): Promise<boolean> {
  const result = await db.order.updateMany({
    where: { id: orderId, status: DbOrderStatus.Pending },
    data: { status: DbOrderStatus.Cancelled },
  });
  return result.count === 1;
}
```

Generated enum declarations stay inside the DAL; the mapping example below converts storage values to the public contract. Do not pass public lowercase enum values into a generated enum that expects different names.

**TSDB-02 MUST:** The app-owned handler wrapper selects the regular client or binds the callback client from an interactive transaction. Participating handlers, audit and outbox receive that same bound `db`; feature code cannot override it. The shared DAL type permits both contexts but does not enforce atomicity. Keep the [transaction failure contract](recipes/transactions.md), including nested rollback-only state and unknown-commit reconciliation.

```ts
// src/app/database/transactions.ts — wrapper internals, lifecycle excerpt
await prisma.$transaction(async (db) => {
  // runAction includes authorization, business writes, audit/outbox and
  // rollback-only checking; it must not close over a separate Prisma client.
  return runAction({ ...context, db });
}, { maxWait: budgets.acquireMs, timeout: budgets.transactionMs });
// Ordinary reads receive the regular client's same delegate interface.
```

**TSDB-03 MUST:** App composition creates the supported Prisma client/driver adapter once per process and shuts it down after draining work. Supply only runtime credentials. Configure actual driver pool limits, TLS, connect/acquisition and query deadlines; interactive transaction limits are not the whole connection budget. Verify supported adapter/pooler behavior for the installed Prisma major.

```ts
// src/app/database/client.ts — Prisma ORM 7 + @prisma/adapter-pg
// settings are validated once; dbCa contains the selected trusted CA PEM.
const adapter = new PrismaPg({
  connectionString: settings.databaseUrl,
  max: settings.dbPoolMax,
  connectionTimeoutMillis: settings.dbConnectTimeoutMs,
  ssl: { ca: settings.dbCa, rejectUnauthorized: true },
}, { schema: settings.dbSchema });
const prisma = new PrismaClient({ adapter });
// After draining requests/workers: await prisma.$disconnect();
```

Import `PrismaPg` from `@prisma/adapter-pg` and `PrismaClient` from the configured generator output. This example selects adapter-owned pooling; verify disposal behavior for the installed version. Reject conflicting SSL URL parameters because node-postgres can replace the explicit SSL object with URL settings. Test hostname/CA rejection; do not set `rejectUnauthorized: false`. Server query/lock/idle limits are configured separately.

**TSDB-04 MUST:** Deployment tooling selects the migration identity and top-level `db/` configuration; the running app cannot read it. Development shadow databases, where the selected Prisma workflow needs them, are disposable and isolated from production. Review generated DDL/grants and verify ownership through the real runner before release.

```text
db/prisma.config.ts        # selected-version migration configuration
src/app/database/client.ts # runtime settings only
CI migration job          # migration identity; reviewed history
CI API integration tests  # runtime identity; real PostgreSQL
```

**TSDB-05 MUST:** Keep query results bounded and map storage types to public contracts deliberately. Use generated enum declarations in DALs, decimal-safe money mapping and UTC/date semantics; never serialize arbitrary ORM rows directly. Parameterize raw values and allowlist dynamic identifiers.

```ts
// src/features/orders/shared/dal.shared.ts — Prisma ORM 7 mapping excerpt
import { OrderStatus as DbOrderStatus } from '../../../generated/prisma/client';
import { OrderStatus } from './contract.shared'; // public declaration source

const row = await db.order.findUnique({ where: { id: orderId } });
const statusToWire = {
  [DbOrderStatus.Pending]: OrderStatus.Pending,
  [DbOrderStatus.Cancelled]: OrderStatus.Cancelled,
} as const;
const output = row ? { id: row.id, status: statusToWire[row.status] } : null;
```

The generated import path is configured by the target project. This excerpt selects Prisma ORM 7's enum representation; verify generated values for another major instead of copying its mapping blindly.

**Verification:** type-check the same DAL against both generated client types; real-DB action rollback/concurrency, forbidden DDL/grants, migration-owner checks, pool limits and shutdown. **Exception:** a different supported ORM implements the same `db` convention using its own typed execution context. Sources: [Prisma transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions), [connection management](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-management), [raw SQL](https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries), [Prisma PostgreSQL adapter](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql), [node-postgres TLS](https://node-postgres.com/features/ssl).
