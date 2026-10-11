# Choose a profile

Profiles express the shared rules in a concrete environment. They do not override identity, data integrity or evidence requirements. Select a TypeScript or Python backend profile for each service boundary; add analytics only where present.

| Profile | Choose when | Runtime/data owner |
| --- | --- | --- |
| [TS full-stack](typescript-fullstack.md) | One web product, shared release owner, server rendering or server operations useful | One web server owns session and domain operations |
| [TS split](typescript-split.md) | Independent API consumers, static hosting or separate release/trust/scale needs | API owns domain writes; static web or explicit BFF owns presentation |
| [Mobile](../mobile/01-react-native.md) | iOS/Android app | React Native feature flows and native lifecycle |
| [desktop (Windows/macOS/Linux)](../desktop/01-app-and-security.md) | Installable desktop app with selected OS capabilities | Electron main/preload/renderer by selected default; load only the selected [OS profiles](../desktop/07-platform-profiles.md) |
| [Python backend](../backend/python/01-backend.md) | Python service or worker | FastAPI/Pydantic/SQLAlchemy selected profile, shared backend invariants |
| [Analytics](analytics.md) | Warehouse/reporting/dbt work | Declared model grain/lineage; transactional owner remains upstream |

Choose installed versions at adoption and prove the relevant contract/build path. Provider-specific implementation and AI model pipelines need project-level proof. Native mobile and desktop use their linked platform profiles.
