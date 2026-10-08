# TypeScript profile verification

**Historical runtime evidence:** this fixture predates D-18. It proves only the recorded scenario and versions, not the revised shared-contract, mobile or custom factory profiles.
**Executed:** 2026-10-05 in an isolated temporary workspace outside the handbook. These are compatibility observations for the listed combination, not required permanent version pins. Consumers select supported versions, commit a lockfile and rerun relevant proof on adoption/upgrade.

## Environment and selected versions

Final checks explicitly used Node **24.14.0**, with npm **11.9.0** available in that runtime's bin directory. An initial default-shell run also succeeded on Node 26.5.0/npm 11.17.0; that is not the handbook's production LTS selection. The explicit Node 24 rerun removed this environment ambiguity. macOS local execution; no deployment.

| Package | Installed version |
| --- | --- |
| `@fastify/swagger` | `9.9.1` |
| `@react-router/dev` | `8.4.0` |
| `@react-router/node` | `8.4.0` |
| `@types/node` | `24.19.1` |
| `@types/react` | `19.3.0` |
| `@types/react-dom` | `19.3.0` |
| `fastify` | `5.12.5` |
| `fastify-type-provider-zod` | `7.0.0` |
| `isbot` | `5.2.2` |
| `openapi-typescript` | `7.13.0` |
| `react` | `19.3.0` |
| `react-dom` | `19.3.0` |
| `react-router` | `8.4.0` |
| `typescript` | `5.9.3` |
| `vite` | `8.3.2` |
| `zod` | `4.6.5` |

The dependency resolver initially selected TypeScript 7.0.2, while openapi-typescript 7.13.0 declared TypeScript `^5.x` peer support. The fixture selected 5.9.3 and checked the resulting installed graph. This demonstrates why selecting every latest package independently is insufficient. `isbot` was added by React Router's default server-entry tooling and is resolved in the lockfile. The profile fixture used npm for isolation; it did not test the handbook's pnpm workspace preference.

## Observed checks

| Check | Result / scope |
| --- | --- |
| Zod → Fastify → OpenAPI → generated TypeScript | Export and generation passed; generated public consumer typechecked |
| Request and response boundaries | Invalid request rejected; private output field omitted; invalid server output produced safe 500 |
| Router action/revalidation | API-backed memory-router loader changed from open to cancelled after action |
| Typecheck | React Router type generation plus strict TypeScript passed |
| SSR production build | Client/server artifacts built |
| SSR request lifecycle | Built handler GET → POST → GET returned open then cancelled |
| Server-only boundary | Deliberate client render reference to `.server` operation rejected by build; restored fixture built |
| Public bundle | Private sentinel absent from all emitted client assets |
| SPA profile | `ssr:false`, clientLoader/clientAction typechecked and static index built |

The SSR request trial initially posted to `/` and received 405 because the action belongs to an index route; targeting the rendered form's `?index` action succeeded. Use the framework's Form routing behavior rather than manually guessing action URLs. The SPA trial initially placed HydrateFallback on a child route, then omitted Scripts from its fallback document; both builds failed. Correct root fallback plus shared Layout with Scripts built successfully. The [split profile](typescript-split.md) now states these integration details.

## Reproduction and limits

The internal review record (not distributed) preserves source excerpts, version/lock identity and commands. The executable fixture remains outside this documentation-only repository.

These checks cover the compiler/schema/router/build seam. They do **not** verify browser end-to-end behavior, real sessions/CSRF, reverse-proxy/CORS configuration, database transactions/migrations, deployment rollback, the complete proposed dependency set, Python drivers or a warehouse. The fixture intentionally uses in-memory state and no identity system; never copy that state model into a production server. Private-sentinel absence and one negative import case are useful checks, not a complete information-flow proof.

Sources: [React Router SPA mode](https://reactrouter.com/how-to/spa), [Zod type provider](https://github.com/turkerdev/fastify-type-provider-zod), [Fastify validation/serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/). Actual execution, not those source pages, supports the pass results above.
