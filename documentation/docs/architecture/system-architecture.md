---
id: system-architecture
title: System Architecture
sidebar_label: System Architecture
---

# Annexure A — System Architecture

> **As-built reference**, verified against the three EOHA repositories
> (`eo-datapipeline`, `eoha_backend`, `eoha-prototype`). Originally drafted as a Milestone 1 design
> specification; updated here to describe what actually runs today rather than the original plan.

## Overview

The platform has separate data paths: a monthly ingestion job that writes to a database, a read-only
API over that database, and a static dashboard that reads its own bundled CSV. The dashboard does
not currently consume the API or the ingestion output.

```
┌──────────────────────────────────────────────────────────────┐
│  Component 1 — EO Data Ingestion (eo-datapipeline)            │
│  GEE extraction → GCS staging → PostgreSQL upsert             │
│  Triggered monthly by GitHub Actions cron                     │
└──────────────────────┬───────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  eoha_backend — read-only REST API over that PostgreSQL data  │
│  (GET /api/zones, GET /api/malaria-observations)               │
│  No known caller today — not wired to the dashboard below.    │
└────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Component 2 — Dashboard (eoha-prototype)                     │
│  Static HTML/CSS/JS, reads a CSV bundled in its own repo       │
│  No HTTP call to eoha_backend or eo-datapipeline anywhere.     │
└──────────────────────────────────────────────────────────────┘
```

---

## Component 1 — EO Data Ingestion

Implemented in [`eo-datapipeline`](https://github.com/MEDICONSORTIUM/eo-datapipeline) — see its
repository README and source for full detail. Summary:

1. **Trigger** — GitHub Actions cron, `0 0 1 * *` (monthly), plus manual dispatch. Not Cloud Run,
   not Kubernetes.
2. **Extraction** — for each of the 9 South African provinces, pulls MODIS (`MOD11A1` land surface
   temperature, `MOD13Q1` NDVI, a manually-computed NDWI from `MOD09GA` reflectance bands) and
   ERA5-Land (air temperature, soil moisture) via the Google Earth Engine Python API, plus WorldPop
   population and ESA WorldCover v100 land cover.
3. **Staging** — per-province CSVs exported to a Google Cloud Storage bucket.
4. **Load** — downloaded, transformed with pandas, and upserted (`ON CONFLICT DO UPDATE`) into two
   PostgreSQL tables: `zone` and `malaria_observation`.

There is no NCD data pipeline — this job only ever writes malaria-relevant environmental columns.

---

## `eoha_backend` — REST API

Implemented in [`eoha_backend`](https://github.com/MEDICONSORTIUM/eoha_backend); see its
repository README and source for the endpoint reference. It is a read-only Spring Boot API over the same
PostgreSQL tables `eo-datapipeline` writes: `GET /api/zones/*` and
`GET /api/malaria-observations/*`. There is no authentication, no write endpoints, and — as far as
either repo's source shows — no current caller of this API.

---

## Component 2 — Dashboard

Implemented in [`eoha-prototype`](https://github.com/MEDICONSORTIUM/eoha-prototype); see its
README and source for the page-by-page reference. It is a static, framework-free HTML/CSS/JS site.
The risk-scoring formula and dashboard behaviour:

```javascript
function calculateDynamicRisk(d) {
  let score = 0;
  if (d.Soil_Moisture > 0.35)       score += 40;
  else if (d.Soil_Moisture > 0.25)  score += 20;
  if (d.LST_Surface_C >= 25 && d.LST_Surface_C <= 30) score += 30;
  if (d.NDWI_Water > -0.1)          score += 20;
  if (d.Population_Density_Per_KM2 > 300) score += 10;
  return score;   // 0–100, computed client-side, no ML involved
}
```

Risk thresholds:

| Score | Label | Colour |
|-------|-------|--------|
| ≥ 50 | **High** | `#d93025` |
| 25–49 | **Moderate** | `#f9bb06` |
| < 25 | **Low** | `#34a853` |

This runs entirely in the browser against a CSV bundled in the `eoha-prototype` repo
(`data/Limpopo_Risk_Jan25_Jan26_Safe.csv`) — **not** against `eo-datapipeline`'s output or
`eoha_backend`'s API. The NCD page reads the same CSV for environmental measurements and population
context; it does not calculate NCD scores. Its scoring specification requires scores to remain
disabled (see [Modules → NCD Exposure](/docs/modules/ncd)).

| Component | Description |
|-----------|-------------|
| **Interactive maps** | Risk-coloured markers + heatmap layer per ward; Leaflet with CartoDB/OSM tiles |
| **Region selector** | Country → Municipality → Ward drill-down (municipality dropdown is CSV-derived, not GeoJSON-derived) |
| **Time slider** | Monthly snapshots from January 2025 to January 2026 |
| **Risk filter** | Show all / High / Moderate / Low |
| **Environmental panel** | Environmental measurements; some visible malaria panel labels do not match the bound CSV fields |
| **Risk prediction panel** | Current risk level label + percentage, from `calculateDynamicRisk()` |
| **NCD observations** | Shared CSV measurements displayed separately; NCD scoring is disabled |
| **Popup cards** | Per-ward risk summary on marker click |

Not present: alert notifications (email/SMS/dashboard flags), automated PDF report generation, and
user authentication — none of these exist in any of the three repos today.

## Validation data status

The prototype data path contains environmental variables and population density, not observed
disease outcomes. **Validation data has not been acquired**: there are no linked malaria case counts
or NCD health outcomes against which to evaluate the dashboard indicators. The malaria score is a
heuristic and has not been epidemiologically validated; NCD exposure scoring is disabled. Software
tests of the data schema or UI do not replace outcome validation.

---

## Technology stack

| Layer | Technology |
|-------|------------|
| EO processing | Google Earth Engine Python API, triggered via GitHub Actions |
| Staging | Google Cloud Storage |
| Database | PostgreSQL on AWS RDS (plain PostgreSQL — no PostGIS extension referenced in either repo) |
| Backend API | Spring Boot 4 (Java 21), read-only |
| Frontend | Static HTML · CSS · vanilla JavaScript (ES6), no bundler |
| Mapping | Leaflet.js + CartoDB/OpenStreetMap tiles |
| CSV parsing | PapaParse (client-side) |
| Hosting (frontend) | AWS Amplify — hookup not present in-repo; the tracked CI workflow only runs a file-existence check and a Discord notification |

---

## Consultation context

The original architecture was scoped in consultation with UCT, CSIR, NICD, and the
TuksNovation/NeoFrontiers funders (see [Design Specification Document v2](/docs/design-specification/overview)
for the full stakeholder and business context). This page describes only the technical system as
built; partner/business framing lives in the Design Specification and Milestones sections.
