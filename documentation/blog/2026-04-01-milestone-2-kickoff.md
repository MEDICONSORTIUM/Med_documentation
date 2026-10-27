---
slug: milestone-2-prototype-kickoff
title: "Milestone 2: Building the EOHA Prototype"
authors: [msesenyane, simamnkele]
tags: [milestone, prototype, gee, machine-learning, eoha]
date: 2026-04-01
---

Milestone 1 laid the architectural foundation — every service zone mapped, every data store specified, every use case documented. Now we build.

<!-- truncate -->

## What Milestone 2 means

The prototype phase (March–August 2026) is where the EOHA platform transitions from a design artefact into a running system. The core deliverables are:

- **Automated GEE pipeline** — a Python-triggered Cloud Function that pulls Sentinel-2 and MODIS imagery on an 8-day cycle, runs zonal statistics against ward boundaries, and writes directly to the Ward Risk store without manual intervention.
- **Server-side risk scoring** — `calculateDynamicRisk()` moves from the browser to a Cloud Run service, enabling real-time scoring for all 9 Limpopo municipalities and laying the groundwork for multi-country expansion.
- **XGBoost ML forecasting** — the first live run of the Malaria Risk Forecast pipeline against the baseline dataset, producing `outbreak_probability_score` values per zone per prediction period.
- **NCD live data** — replacing the static NCD baseline with live GEE-computed scores using Copernicus/Sentinel atmospheric data (NO2, SO2, aerosol index, UV radiation).

## Design artefacts carried into M2

The Design Specification Document (v2) produced in M1 defines the full entity model the prototype must implement:

| Entity | Key fields | M2 target |
|--------|-----------|-----------|
| `Zone` | `zone_id`, `boundary_polygon`, `base_population` | GeoJSON sync automated |
| `Malaria_Observation` | `lst_surface_temp_c`, `soil_moisture_pct`, `ndwi_water_index` | GEE pipeline live |
| `Malaria_Risk_Forecast` | `outbreak_probability_score`, `environmental_lag_days` | XGBoost v1 deployed |
| `NCD_Observation` | `no2_density`, `so2_density`, `aerosol_index` | Copernicus pipeline live |
| `User_Risk_Alert` | `alert_status`, `forecast_id` | Alert engine wired to forecasts |

## What's shipping first

Our first sprint targets the Malaria pipeline end-to-end: GEE ingest → zonal statistics → XGBoost score → alert threshold check → `USER_RISK_ALERT` insert. Once that loop is closed on Limpopo data, we extend to NCD and begin multi-country boundary ingestion.

Follow progress on the [Milestones page](/Med_documentation/docs/milestones/overview) and in the [live platform](https://main.d1jko0jkg4m7f.amplifyapp.com).
