---
id: intro
title: Platform Overview
sidebar_label: Platform Overview
slug: /intro
---

# MED Consortium — EO Health Surveillance Platform

**Exploring how Earth Observation variables can support public health monitoring across Southern Africa.**

:::info Current status
Milestones 1 and 2 have ended. The project is now in **Milestone 3 (Prototype Validation & Testing)**.
The prototype collects environmental variables only; disease validation data has not been acquired.
See [Milestones →](/docs/milestones/overview) for the current status and open dependencies.
:::

## What is this platform?

The EOHA prototype presents monthly environmental observations and exploratory indicators in a
browser-based dashboard. Its current data collection contains environmental variables only and
does **not** include observed disease outcomes. Validation data has not been acquired, and the
environmental indicators have not been validated against disease incidence.

| Module | Focus | Geography | Status today |
|--------|-------|-----------|---------------|
| **Malaria Risk** | Rule-based environmental habitat suitability score | Monthly ward observations across South Africa | Prototype dashboard using bundled CSV; not validated against malaria cases |
| **NCD Exposure** | Environmental measurements and geographic context | Monthly South African ward observations, with country/province boundary views | Observation prototype; NCD scoring is disabled |

:::caution Separate data paths today
The published architecture (below) describes one continuous pipeline from satellite ingestion to
dashboard. As actually built, the platform is **three independent repositories** with no live
connection between them: a monthly Earth Engine ingestion job (`eo-datapipeline`) writes to a
PostgreSQL database; a read-only REST API (`eoha_backend`) can query that database but has no known
caller; and the public dashboard (`eoha-prototype`) reads a static CSV file bundled directly in its
own repo, entirely independent of the other two. See each repository's README and source for full detail.
:::

## Key capabilities

- 🛰️ **Automated EO data ingestion** — a monthly GitHub Actions job pulls MODIS (LST, NDVI, a
  computed water index) and ERA5-Land (air temperature, soil moisture) via Google Earth Engine for
  all 9 South African provinces
- 🗺️ **Interactive Leaflet maps** with ward-level drill-down and a 13-month time slider (Jan 2025 –
  Jan 2026)
- 📈 **Dynamic risk scoring** — a fixed rule-based formula (not a trained model) combining soil
  moisture, LST, NDWI, and population density, computed client-side in the browser
- 🔔 **Risk-level filtering** — High / Moderate / Low with popup summaries
- 📅 **13-month temporal coverage** — monthly snapshots for trend analysis

:::caution Validation gap
The dashboard collection contains environmental variables, but no malaria case counts, NCD outcomes,
or health-survey labels for validation. The malaria score is a heuristic
environmental proxy; the NCD scoring proposal remains disabled. The dashboard is not evidence of
validated disease prediction.
:::

## Architecture in brief

```
eo-datapipeline (monthly cron) → Google Earth Engine → GCS → PostgreSQL
                                                            ↑
                                              eoha_backend reads this (unconsumed today)

eoha-prototype (separately) → static CSV bundled in-repo → browser-rendered dashboard
```

See [System Architecture](/docs/architecture/system-architecture) and [EO Data Pipeline](/docs/architecture/eo-pipeline) for full detail.

## Live platform

The current public webapp is:

👉 **[https://www.eoha.co.za/](https://www.eoha.co.za/)**

> Best experienced on desktop. Mobile (portrait) support is in active development.

## Project context

| Item | Detail |
|------|--------|
| **Funder** | TuksNovation / NeoFrontiers |
| **Period** | 1 November 2025 – 31 October 2026 |
| **Total budget** | R 1,000,000 |
| **Director** | Kagisho Montjane |
| **Validation partners** | UCT · CSIR · NICD · DoH |

## Quick navigation

- [System Architecture →](/docs/architecture/system-architecture)
- [EO Data Pipeline →](/docs/architecture/eo-pipeline)
- [Malaria Risk Module →](/docs/modules/malaria)
- [NCD Exposure Module →](/docs/modules/ncd)
- [Datasets →](/docs/data/datasets)
- [Milestone 1 →](/docs/milestones/milestone-1)
- [Milestone 2 ->](/docs/milestones/milestone-2.md)
- [Milestone 3 ->](/docs/milestones/milestone-3)
