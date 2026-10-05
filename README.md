# Project Guidelines

Enterprise application standards for AI agents and engineers. This repository contains **guides and skills only**. It does not scaffold, deploy, or run a project.

**Status:** v0 working baseline. The decisions here are an integrated recommendation for review; they are not yet individually approved by the owner. Use them when starting a new project or evaluating an existing one, and record any deliberate exception.

## Start here

1. Read [the guide index](guides/README.md) and [how to apply the rules](guides/00-governance.md).
2. For a new application, read [architecture](guides/01-architecture.md), [stack](guides/02-stack.md), and [repository structure](guides/03-repository.md).
3. Load the relevant TypeScript frontend, TypeScript backend, Python backend, or data guides. Follow links from a guide only when the task touches that boundary.
4. For repeatable work, use a matching [skill](skills/README.md). Skills route work through the guides; they do not define a second set of rules.

The default product shape is a cohesive repository with a separately deployable TypeScript web app and API. The backend is a modular monolith until a concrete boundary needs an independent service. Python backend and analytics are optional profiles. See [architecture](guides/01-architecture.md) for the decision criteria.

## How to review this baseline

Read the local guides as the authority; record decisions with their owning rules and avoid duplicate guidance.

## Intended use

These files are readable directly by any agent with access to this repository. The root [AGENTS.md](AGENTS.md) is a short entrypoint when an agent works in this repository. Repository-local skills are not automatically installed into every other project; point an agent here or install a skill through its host's supported mechanism.
