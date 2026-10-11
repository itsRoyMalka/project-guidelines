# Choose a profile

Profiles express the shared rules in a concrete environment. They do not override identity, data integrity or evidence requirements. Select one TS runtime shape per product boundary; add Python/analytics only where present.

| Profile | Choose when | Runtime/data owner |
| --- | --- | --- |
| [TS full-stack](typescript-fullstack.md) | One web product, shared release owner, server rendering or server operations useful | One web server owns session and domain operations |
| [TS split](typescript-split.md) | Independent API consumers, static hosting or separate release/trust/scale needs | API owns domain writes; static web or explicit BFF owns presentation |
| [Mobile](../mobile/01-react-native.md) | iOS/Android app | React Native feature flows and native lifecycle |
| [macOS desktop](../macos/01-app-and-security.md) | Installable Mac app with OS capabilities | Electron main/preload/renderer by selected default; renderer reuses FE rules |
| [Python](../python/01-backend.md) | Workload/team benefits from Python | FastAPI operation/session lifecycle, shared wire principles |
| [Analytics](analytics.md) | Warehouse/reporting/dbt work | Declared model grain/lineage; transactional owner remains upstream |

Choose installed versions at adoption and prove the relevant contract/build path. Provider-specific implementation and AI model pipelines need project-level proof. Native mobile and macOS desktop use their linked platform profiles.
