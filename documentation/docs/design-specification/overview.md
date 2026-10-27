---
id: overview
title: Design Specification
sidebar_label: Overview
description: EOHA Design Specification — as-built reference for what the platform's three repositories actually implement today.
---

# Design Specification

**Document:** EOHA Design Specification &nbsp;|&nbsp; **Prepared by:** Simamnkele Mlisana & Msesenyane Makhongela
**Organisation:** Medical Consortium of Africa (Pty) Ltd, University of Pretoria / TuksNovation

---

:::caution As-built, not aspirational
This section originally summarised the Milestone 1 planning document (ERDs, use cases, and
architecture describing a full ML forecasting and alerting platform). It has been rewritten to
describe **only what exists in the three EOHA repositories today** — `eo-datapipeline`,
`eoha_backend`, and `eoha-prototype`. Planned-but-unbuilt features (user accounts, XGBoost
forecasting, automated alerts, NCD data ingestion) are described in
[Milestone 3 →](/docs/milestones/milestone-3) as open work, not in this section as current
capability. The original planning PDF remains available for download below for historical
reference.
:::

## Document sections

| Section | Contents |
|---------|----------|
| [System Architecture →](/docs/design-specification/system-architecture-design) | As-built component diagram: the three independent repositories and how (little) they connect |
| [Data Architecture →](/docs/design-specification/data-architecture) | The two entities that actually exist in the database — `Zone` and `Malaria_Observation` |
| [Use Cases →](/docs/design-specification/use-cases) | The interactions the system actually supports today |
| [Wireframes →](/docs/design-specification/wireframes) | Home, Malaria, and NCD pages, annotated with which parts are live vs. fabricated |
| [Operational Workflow →](/docs/design-specification/operational-workflow) | The real trigger-to-database flow (GitHub Actions → GEE → GCS → PostgreSQL) |

---

## Original planning documents (historical)

The design work referenced above was originally captured in a full planning document produced for
Milestone 1. It describes a substantially larger system than what has been built to date — see the
callout above. Kept here for historical reference and as the source for Milestone 2/3 planning:

| File | Format | Link |
|------|--------|------|
| Design Specification Document v2 | PDF | [Download →](/Med_documentation/assets/design-spec/Design_Specification_Document_v2.pdf) |
| Initial UML (Draw.io) | `.drawio` | [Download →](/Med_documentation/assets/design-spec/Med_Consort_Initial_UML.drawio) |
| Use Case Set | Word `.docx` | [Download →](/Med_documentation/assets/design-spec/Use_Case_Set.docx) |

---

## System description — as built today

- **Data Ingestion** — a monthly GitHub Actions job (`eo-datapipeline`) pulls MODIS and ERA5-Land
  environmental data from Google Earth Engine for all 9 South African provinces and upserts it into
  a PostgreSQL database.
- **Read API** — a Spring Boot service (`eoha_backend`) exposes that database read-only over REST.
  It has no known caller today.
- **Geo Dashboard** — a static site (`eoha-prototype`) renders an interactive Leaflet map from a CSV
  file bundled in its own repository — not from the two components above. Risk scores are computed
  by a fixed rule-based formula in the browser, not a trained model.

Not implemented in any repo today: predictive machine learning (XGBoost or otherwise), an alert
system, user accounts/roles, or a live NCD data pipeline (the NCD dashboard page shows hardcoded
demonstration values). These remain open items tracked under [Milestone 3 →](/docs/milestones/milestone-3).

## Actors — as the system actually supports them

| Actor | What they can actually do today |
|-------|------------------------|
| Any visitor | Browse the public dashboard (no login) — view the malaria risk map and the NCD demo map |
| API consumer | Call `eoha_backend`'s read-only endpoints directly (no auth required, no known integration exists yet) |
| Pipeline operator | Trigger the monthly ingestion job manually via GitHub Actions `workflow_dispatch`, or let the cron schedule run it |

There is no concept of a logged-in "End User," "Data Contributor," or "Administrator" role in any of
the three repos — no authentication exists anywhere in the system.
