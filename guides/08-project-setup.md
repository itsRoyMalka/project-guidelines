# PRD to working project

**Applies to:** a new product repository created from an MVP PRD, product brief or equivalent user request. This guide owns SETUP rules. [Product decisions](07-product-and-decisions.md) own the outcome; [architecture](01-architecture.md) owns deployable boundaries; [stack](02-stack.md) owns technology selection; [adoption](05-adoption.md) owns ongoing handbook use. The [start-project skill](../skills/start-project/SKILL.md) executes this flow. The handbook remains documentation-only; agents create the application in the target repository.

## 1. Understand before choosing tools

**SETUP-01 MUST:** Extract PRD users, first journeys, acceptance, roles, data owners, integrations, trust/privacy scope, load/reliability and constraints. Mark facts, assumptions and open decisions; select the first useful slice.

**SETUP-02 MUST:** Ask small batches of questions only where answers change consequential boundaries, behavior or safety. Recommend a default and continue independent work while waiting. Use explicit reversible assumptions for ordinary preferences; silence is not approval.

## 2. Select a coherent starting shape

**SETUP-03 MUST:** Record repo/runtime/FE/BE/data/contract/identity/integration/test/delivery choices with evidence, alternative, tradeoff and revisit trigger. Apply ARCH and STACK rules; verify actual compatible versions and create only needed capabilities.

**SETUP-04 MUST:** On every setup run, read the pinned handbook and selected profile/guides. Target agent instructions record path/revision, profile, tracker/key/owner and exceptions. Link rules without copying them; report missing references.

## 3. Create a usable starter

**SETUP-05 MUST:** After consequential choices are resolved, build the selected starter in the target repo: feature path, contracts/data, composition, safe config, tools, commands, tests, CI and appropriate delivery source. Inspect nonempty destinations and preserve existing work.

**SETUP-06 MUST:** Create or connect the target Git repository and authoritative product Project; configure their fields, issue/PR templates, owners, CI and Git protections according to [Project/Git setup](cross-cutting/recipes/git-project-setup.md). Create/link PRD, architecture brief, consequential ADRs, README commands and first tickets. Unavailable host/admin access gets exact proposed settings and an honest unmet gate, never invented IDs or revisions.

## 4. Prove the handoff

**SETUP-07 MUST:** Prove clean install/config/start, affected checks/build, one thin journey and the Git/Project configuration trials. Record exact evidence and gaps; hand off the next ticket and decisions. Structural CI checks or a welcome page alone do not prove readiness.

## Minimal target-project record

```text
AGENTS.md                     # handbook revision/profile and project coordinates
README.md                     # real install, dev and verification commands
.github/                      # CODEOWNERS, issue/PR templates and target CI
docs/product/mvp.md           # supplied PRD or linked source, refined first journey
docs/architecture/overview.md # selected shape, owners and revisit triggers
docs/decisions/              # only consequential ADRs and local exceptions
apps/...                      # only selected deployables
packages/...                  # only real shared boundaries, if any
```

The actual tree follows the architecture brief. A fullstack app may have no `packages/` or separate API; a split web/API product has its own contract and test seam. Native mobile uses the [React Native profile](mobile/01-react-native.md); installable desktop apps use the [desktop profile](desktop/01-app-and-security.md), select only needed [optional OS capabilities](desktop/06-optional-capabilities.md), and prove a packaged candidate. See the [worked setup recipe](recipes/project-setup.md) and [Git/Project setup](cross-cutting/recipes/git-project-setup.md).

**Verification:** Given the same PRD, a new agent can identify which questions affect structure, locate selected rules, explain why each deployable exists, run the starter from a fresh checkout and continue from a real first ticket. **Exception:** For a request explicitly limited to architecture planning, stop after SETUP-04 and label code/setup verification as not performed; do not represent a proposal as a built starter. Further reading: [Azure microservices architecture tradeoffs](https://learn.microsoft.com/en-us/azure/architecture/microservices/), [AWS micro-frontend alternatives](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/micro-frontend-alternatives.html). The question and artifact workflow is this handbook's selected convention.
