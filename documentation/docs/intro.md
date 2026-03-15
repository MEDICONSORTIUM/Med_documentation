---
id: intro
title: Platform Overview
sidebar_label: Platform Overview
slug: /intro
---

# MED Consortium — EO Health Surveillance Platform

**Using Earth Observation data to monitor water-borne pathogens and non-communicable disease risk factors across Southern Africa.**

:::info Current status
Milestone 1 (System Design & Data Architecture) is in progress: **1 November 2025 – 16 March 2026**.
:::

## What is this platform?

The MED Consortium platform integrates **satellite Earth Observation (EO) imagery** with **epidemiological and public health datasets** to generate near-real-time risk maps for two disease categories:

| Module | Focus | Geography |
|--------|-------|-----------|
| **Malaria Risk** | Water-borne vector habitat, soil moisture, surface temperature | Limpopo Province (ward level) |
| **NCD Risk** | Air quality, heat stress, land-cover, lifestyle factors | Southern Africa (country → province → municipality) |

Data is sourced from Google Earth Engine and processed through a six-stage automated pipeline before being surfaced on the interactive dashboard.

## Key capabilities

- 🛰️ **Automated EO data ingestion** — Sentinel-2/3, Landsat 8/9, MODIS via GEE
- 🗺️ **Interactive Leaflet maps** with ward-level drill-down and time sliders (Jan 2025 – Jan 2026)
- 📈 **Dynamic risk scoring** — composite index from soil moisture, LST, NDWI, population density
- 🔔 **Risk-level filtering** — High / Moderate / Low with popup summaries
- 📅 **13-month temporal coverage** — monthly snapshots for trend analysis
- 🏥 **Partner-validated outputs** for UCT, CSIR, NICD and DoH

## Architecture in brief

```
Data Sources → Ingestion → Pre-process & QA → Feature Extraction
    → Spatial-Temporal Fusion → Risk Modelling → Dashboard Output
```

See [System Architecture](/docs/architecture/system-architecture) and [EO Data Pipeline](/docs/architecture/eo-pipeline) for full detail.

## Live platform

The platform is deployed on AWS Amplify:

👉 **[https://main.d1jko0jkg4m7f.amplifyapp.com/](https://main.d1jko0jkg4m7f.amplifyapp.com/)**

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
- [NCD Risk Module →](/docs/modules/ncd)
- [Datasets →](/docs/data/datasets)
- [Milestone 1 →](/docs/milestones/milestone-1)