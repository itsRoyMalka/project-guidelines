# Choose a profile

Profiles express the shared rules in a concrete environment. They do not override identity, data integrity or evidence requirements. Select one TS runtime shape per product boundary; add Python/analytics only where present.

| Profile | Choose when | Runtime/data owner |
| --- | --- | --- |
| [TS full-stack](typescript-fullstack.md) | One web product, shared release owner, server rendering or server operations useful | One web server owns session and domain operations |
| [TS split](typescript-split.md) | Independent API consumers, static hosting or separate release/trust/scale needs | API owns domain writes; static web or explicit BFF owns presentation |
| [Python](../python/01-backend.md) | Workload/team benefits from Python | FastAPI operation/session lifecycle, shared wire principles |
| [Analytics](analytics.md) | Warehouse/reporting/dbt work | Declared model grain/lineage; transactional owner remains upstream |

[Version and integration evidence](verification.md) describes what was exercised. Choose installed versions at adoption and repeat the relevant proof. Provider deployment specifics, native mobile and AI model pipelines are explicit extensions.
