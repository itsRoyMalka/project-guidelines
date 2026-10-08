---
name: implement-feature
description: Implement a scoped application feature or bug fix within the owning module while preserving contracts, authorization, tests, and documentation.
---

# Implement a feature

Read [usage](../../USAGE.md), [governance](../../guides/00-governance.md), target instructions and current issue/handoff. Apply [WORK](../../guides/cross-cutting/06-workflow-and-docs.md), [project](../../guides/cross-cutting/07-project-work.md) and [Git](../../guides/cross-cutting/08-git-collaboration.md).

Load the selected profile and affected guides from [the map](../../guides/README.md). For a BE, FE or E2E design choice, consult that sector's anti-pattern and pattern-inventory guides before adding an abstraction. Time-dependent work loads the BE/FE time guides from the map. BE uses feature/action API/handler/DAL slices; FE uses flow api/ui/lib; mobile adds its native profile. Build a focused slice with behavior proof, update contracts/docs and inspect the diff for scope, security and duplication. Report actual checks and gaps. Update the issue at meaningful transitions; a stopped task gets a durable handoff. Do not mark Done before target verification.
