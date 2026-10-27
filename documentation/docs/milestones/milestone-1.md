---
id: milestone-1
title: Milestone 1 — System Design & Data Architecture
sidebar_label: Milestone 1
---

# Milestone 1 — System Design & Data Architecture

| Property | Detail |
|----------|--------|
| **Period** | 1 November 2025 – 16 March 2026 |
| **Budget** | R 250,000 |
| **Status** | 🔵 In progress |

---

## Deliverables

| Deliverable | Status | Link |
|-------------|--------|------|
| Design specification document | ✅ Complete | See below |
| EO data integration architecture plan | ✅ Complete | [Annexure A](/docs/architecture/system-architecture) |
| EO Data Pipeline Framework | ✅ Complete | [Annexure B](/docs/architecture/eo-pipeline) |
| Prototype wireframe and workflow design | 🔵 In progress | [Live platform](https://main.d1jko0jkg4m7f.amplifyapp.com/) |

---

## Activities completed

### Stakeholder consultation

Initial consultation completed with NICD, UCT and CSIR to define:
- Priority disease areas (malaria, NCD)
- Required EO indices and data products
- Dashboard output formats for public health decision-makers

### Data source definition

EO collections confirmed and tested in Google Earth Engine:

| Collection | Variable | Resolution |
|-----------|---------|-----------|
| `COPERNICUS/S2_SR_HARMONIZED` | NDWI, NDVI | 10 m |
| `MODIS/061/MOD11A2` | LST | 1 km |
| `NASA/USDA/HSL/SMAP10KM_soil_moisture` | Soil moisture | 10 km |
| `ESA/WorldCover/v200` | Habitat class, Agric % | 10 m |
| `WorldPop/GP/100m/pop` | Population density | 100 m |

### Architecture and data flow diagrams

See [System Architecture](/docs/architecture/system-architecture) (Annexure A) and [EO Data Pipeline](/docs/architecture/eo-pipeline) (Annexure B).

### Prototype wireframes

The working prototype is deployed at:

👉 **[https://main.d1jko0jkg4m7f.amplifyapp.com/](https://main.d1jko0jkg4m7f.amplifyapp.com/)**

Current prototype capabilities:
- Malaria risk map for Limpopo (7,384 ward-month records)
- Time slider: Jan 2025 – Jan 2026
- Region drill-down: Province → Municipality → Ward
- Risk level filter (High / Moderate / Low)
- Environmental factors panel
- NCD risk module with Southern Africa choropleth

---

## Dataset produced

The primary dataset for Milestone 1 is `Limpopo_Risk_Jan25_Jan26_Safe.csv`:

- **7,384 records** across 9 municipalities
- **13 monthly snapshots** (Jan 2025 – Jan 2026)
- **13 EO-derived variables** per ward per month
- Extracted from Google Earth Engine

[View dataset documentation →](/docs/data/datasets)

---

## Outstanding activities

- [ ] Final architecture sign-off by UCT/CSIR
- [ ] Prototype wireframe review session with TuksNovation
- [ ] Submit design specification document to NeoFrontiers
- [ ] Close-out report for Milestone 1 (due 16 March 2026)

---

## Draw-down

Upon completion of all Milestone 1 deliverables and submission of close-out documentation, **R 250,000** will be drawn down against the total R 1,000,000 budget.