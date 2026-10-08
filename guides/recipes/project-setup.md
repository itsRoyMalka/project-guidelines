# Worked PRD-to-project setup

Use with [SETUP rules](../08-project-setup.md) and the [start-project skill](../../skills/start-project/SKILL.md). This is an illustration, not a required product template.

## Example intake and decisions

PRD excerpt: “One team needs a browser app where staff create orders and customers see status. Mobile is possible later. Orders contain customer contact details. The first release serves one organization; no external API client is committed.”

| Decision | Evidence and starting choice | Revisit when |
| --- | --- | --- |
| First slice | Staff create an order; customer sees its status | Later PRD journeys enter the backlog |
| Runtime shape | One TypeScript fullstack deployable, modular Orders feature | A real independent API/mobile consumer or release owner appears |
| Frontend | One web app with feature boundaries, no MFE | Separate teams need independently released UI surfaces |
| Data | PostgreSQL owned by the app; Orders owns order writes | A new service boundary has a justified data owner |
| Identity | Clarify staff/customer sign-in and authorization before implementing protected behavior | Identity provider or trust scope changes |
| Shared code | No package until two consumers share the same contract or capability | A second deployable has a real shared contract |

The agent asks the identity question because it changes safe access and the first journey. It can inspect the rest of the PRD, draft the architecture and choose provisional tools while awaiting the answer; it does not implement a guessed authorization policy.

## Result in the target repository

```text
AGENTS.md
README.md
.github/
  CODEOWNERS
  ISSUE_TEMPLATE/
  PULL_REQUEST_TEMPLATE.md
  workflows/
docs/
  product/mvp.md
  architecture/overview.md
  decisions/
apps/
  web/
    src/features/orders/
      create-order/{handler.server,dal.server,contract}.ts
      create-order/ui/create-order.tsx
      create-order/create-order.test.tsx
      details/{api,ui}/
      db/orders.prisma
      shared/
    src/app/                # runtime composition and providers
    db/                     # config and migration history
```

The target's actual framework may place routes or migrations differently; preserve one owner and the selected profile's boundaries. Add `apps/e2e/` when the first journey needs a browser-level check. Add `packages/contracts/` only after a separate consumer exists. Keep provider and infrastructure files where the chosen target platform requires them. The `.github/` files are an example for GitHub; use the host's equivalent. Follow the [Git/Project setup recipe](../cross-cutting/recipes/git-project-setup.md) to configure the remote Project and protections, not just these files.

## Ready means observed behavior

From a fresh checkout, install with the pinned runtime and lockfile; start a safe local database; apply migrations; start the app; create an order as authorized staff; view the resulting status as the intended customer; run the relevant checks. Verify the Git/Project trial matrix against the actual remote settings. Record exact commands, results and anything unverified. A real tracker issue then holds the next slice and handoff. A scaffold that only serves a welcome page is still in progress.
