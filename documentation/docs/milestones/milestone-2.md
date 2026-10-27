---
id: milestone-2
title: Milestone 2 — Prototype Development
sidebar_label: Milestone 2 (Complete)
description: Milestone 2 prototype development review, with implementation evidence and targets carried into Milestone 3.
---

# Milestone 2 — Prototype Development (PoC)

**Period:** March – August 2026 &nbsp;|&nbsp; **Budget:** R 500,000 &nbsp;|&nbsp; **Status:** Period complete; several targets remain open

---

## Objective

M2's planned objective was to transform the M1 design specification into a live, end-to-end system. The period has ended. This page compares that plan with repository evidence; the planned architecture and deliverables below must not be read as implemented features.

:::info Progress verified 2026-08-06
Of the six deliverables below, **one is substantially built** (the GEE ingest pipeline, though with a
different trigger mechanism and cadence than originally targeted). The other five — XGBoost
forecasting, the NCD pipeline, server-side scoring, the alert engine, and multi-country expansion —
have no corresponding code in any of the three EOHA repositories as of this check. Each deliverable
below is marked with its actual status.
:::

---

## Deliverables

### 1. Automated GEE ingest pipeline — ✅ built, different mechanism than targeted

| Item | Targeted | As built |
|------|----------|----------|
| Trigger | Python Cloud Function, 8-day schedule (matching Sentinel-2 pass cadence) | **GitHub Actions cron, monthly** (`0 0 1 * *`) + manual dispatch |
| Source | Google Earth Engine — Sentinel-2 SR, MODIS MOD11A1, ERA5 | **MODIS `MOD11A1`/`MOD13Q1`/`MOD09GA` + ERA5-Land** — no Sentinel-2 used |
| Transform | Cloud masking (QA60 < 20%), zonal statistics via `reduceRegions()` | No explicit cloud-percentage filter; a `build_safe_band_image()` guard substitutes a blank image for data-sparse months. `reduceRegions()` at `scale=1000` — matches |
| Output | `Malaria_Observation` rows: `lst_surface_temp_c`, `soil_moisture_pct`, `ndwi_water_index`, `ndvi_vegetation_index` | **Matches** — plus `air_temp_c` and `agric_percentage` |
| Load | Writes to Ward Risk store via Data Ingestion service | Upserts directly into PostgreSQL (`zone`, `malaria_observation`) via `psycopg2` — no separate "Data Ingestion service" exists |

Full detail: [`eo-datapipeline/SUMMARY.md`](https://github.com/MEDICONSORTIUM/eo-datapipeline/blob/main/SUMMARY.md).

### 2. XGBoost Malaria Risk Forecasting — ❌ not started

The ML pipeline runs weekly on all zones with sufficient observation history:

```
ML Pipeline triggers
  → READ Malaria_Observation (lst, soil_moisture)
  → READ Ground_Observation (aggregated_case_count)
  → Apply environmental_lag_days offset
  → Run XGBoost algorithm
  → Output outbreak_probability_score per zone_id
  → IF score > 0.80 → CREATE User_Risk_Alert
```

Output stored in `Malaria_Risk_Forecast`: `forecast_id`, `zone_id`, `target_prediction_date`, `outbreak_probability_score`, `model_version_used`.

**Status:** no `Malaria_Risk_Forecast` table, no XGBoost code, and no ML pipeline of any kind exist
in `eo-datapipeline`, `eoha_backend`, or `eoha-prototype` as of this check. The "90-day forecast" page
in `eoha-prototype` shows `Math.random()`-generated sine curves, not model output.

### 3. NCD Atmospheric Pipeline — ❌ not started

Copernicus/Sentinel-based pipeline running in parallel:

| Satellite / Source | Indicator | Field |
|--------------------|-----------|-------|
| Copernicus S5P/OFFL/L3_NO2 | Nitrogen dioxide column | `no2_density` |
| Copernicus S5P/OFFL/L3_SO2 | Sulphur dioxide | `so2_density` |
| Copernicus S5P/OFFL/L3_AER_AI | Aerosol index (PM proxy) | `aerosol_index` |
| Copernicus S5P/OFFL/L3_UVI | UV radiation | `uv_radiation_index` |
| MODIS/061/MOD11A2 | Land surface temperature | `lst_mean_c` |
| ESA WorldCover/v100 | Urban growth boundary | `urban_cover_percentage` |

**Status:** `eo-datapipeline` extracts no NO2/SO2/aerosol/UV data — its GEE collection list is
malaria-only (§1). The NCD page in `eoha-prototype` displays hardcoded demonstration numbers for 8
countries/9 provinces baked into the page's JavaScript, not queried from any pipeline or API.

### 4. Server-side risk scoring — ❌ not started

`calculateDynamicRisk()` moves from the browser to a **Cloud Run** microservice:

```latex
R_{\text{ward}} = w_1 \cdot \text{NDWI} + w_2 \cdot \text{LST}_{\text{norm}} + w_3 \cdot \text{Precip}_{\text{anom}} + w_4 \cdot (1 - \text{NDVI})
```

Enables real-time scoring at request time rather than relying on pre-computed CSV values.

**Status:** `calculateDynamicRisk()` still runs entirely client-side in `eoha-prototype`'s browser
JavaScript — there is no Cloud Run service, and `eoha_backend` exposes no scoring endpoint at all
(only read-only `/api/zones` and `/api/malaria-observations`).

### 5. Alert engine integration — ❌ not started

The `User_Risk_Alert` entity goes live:

- Forecasts with `outbreak_probability_score > 0.80` trigger `CREATE User_Risk_Alert`
- Email dispatched to all users assigned to the affected `zone_id`
- Alert status transitions: `Active` → `Acknowledged` → `Resolved`
- Full audit trail written to `Audit Log`

**Status:** no `User_Risk_Alert` table, no user table, no email dispatch code, and no audit log exist
anywhere in the three repos.

### 6. Multi-country expansion — ❌ not started

Ward boundary GeoJSON for three additional countries ingested into the `Zone` table:

| Country | Admin level | Source |
|---------|-------------|--------|
| Zimbabwe | District ward | SADHS 2019 |
| Mozambique | Distrito | SADHS 2011 |
| Zambia | District | SADHS 2018 |

**Status:** `eo-datapipeline`'s `PROVINCES` list covers only the 9 South African provinces — no
Zimbabwe/Mozambique/Zambia boundary data or processing exists in any repo.

---

## Business rules in effect

| Rule | Requirement |
|------|-------------|
| BR-01 | Risk predictions refreshed minimum every 24 hours using latest SANSA/GEE pulls |
| BR-02 | Persistent disclaimer: outputs are predictive intelligence, not clinical directives |
| BR-03 | All ingest, scoring, and alert events immutably logged (POPIA compliance) |
| BR-04 | No external dataset ingested without passing the automated Quality Test protocol |

---

## Domain rules enforced

| Rule | Constraint |
|------|-----------|
| DR-01 | Malaria risk constrained by environmental thresholds (standing water proximity + LST combinations) |
| DR-02 | NCD forecasting weights long-term exposure metrics heavier than short-term anomalies |
| DR-03 | All ML predictions displayed with `outbreak_probability_score` confidence interval |
| DR-04 | Raster and vector data must be spatially and temporally aligned before entering PCA pipeline |

---

## Sprint plan

| Sprint | Focus | Target |
|--------|-------|--------|
| S1 (Mar–Apr) | GEE ingest pipeline end-to-end | `Malaria_Observation` rows flowing |
| S2 (Apr–May) | XGBoost model training and forecast pipeline | `Malaria_Risk_Forecast` rows + alerts |
| S3 (May–Jun) | NCD atmospheric pipeline + `NCD_Observation` | NCD scores live |
| S4 (Jun–Jul) | Server-side scoring + Cloud Run deploy | Real-time risk API |
| S5 (Jul–Aug) | Multi-country boundaries + dashboard integration | Full prototype demo |

---

## Related pages

- [Design Specification →](/Med_documentation/docs/design-specification/overview)
- [System Architecture →](/Med_documentation/docs/architecture/system-architecture)
- [EO Pipeline →](/Med_documentation/docs/architecture/eo-pipeline)
- [Milestones Overview →](/Med_documentation/docs/milestones/overview)
