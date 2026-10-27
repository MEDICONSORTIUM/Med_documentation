---
id: system-architecture
title: System Architecture
sidebar_label: System Architecture
---

# Annexure A — System Architecture

> **Deliverable for Milestone 1** — Design specification document and EO data integration architecture plan.

## Overview

The platform is structured as a **four-layer architecture** connecting raw satellite data sources to a health surveillance dashboard consumed by public health partners.

```
┌──────────────────────────────────────────────────────────────┐
│  Layer 1 — Data Sources                                      │
│  EO Satellites · NICD · Public Health · Ground Sensors · DWS│
└──────────────────────┬───────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  Layer 2 — EO Data Pipeline                                  │
│  Ingestion → Pre-process → Feature Extraction → Storage      │
└──────────────────────┬───────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  Layer 3 — Analytics & Modelling Engine                      │
│  Pathogen index · NCD risk · Spatial analysis · Alerts       │
└──────────────────────┬───────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  Layer 4 — Health Surveillance Dashboard                     │
│  Interactive maps · Time-series · Alerts · Reports           │
└──────────────────────────────────────────────────────────────┘
```

---

## Layer 1 — Data Sources

| Source | Type | Data provided |
|--------|------|---------------|
| **Sentinel-2/3** | EO satellite | NDWI, NDVI, turbidity, chlorophyll-a |
| **Landsat 8/9** | EO satellite | Land surface temperature (LST), land cover |
| **MODIS** | EO satellite | Soil moisture, vegetation index |
| **NICD** | Epidemiological | Disease case counts, outbreak alerts |
| **DoH** | Public health | Disease registry, facility data |
| **DWS** | Water agency | Water body status, quality indices |
| **SAWS** | Meteorological | Air temperature, rainfall |
| **Ground sensors** | Field obs. | Water quality, in-situ validation |

---

## Layer 2 — EO Data Pipeline

See [EO Data Pipeline →](/docs/architecture/eo-pipeline) for the full six-stage breakdown.

**Summary steps:**
1. **Ingestion** — scheduled API pulls via Google Earth Engine
2. **Pre-processing & QA/QC** — atmospheric correction, cloud masking, normalisation
3. **Feature extraction** — NDWI, NDVI, turbidity, LST, chlorophyll-a
4. **Spatial-temporal fusion** — join EO features with health & ground data by GPS + date
5. **Storage** — cloud database + data lake (CSV for prototype, PostGIS for production)

---

## Layer 3 — Analytics & Modelling Engine

### Malaria risk index

The composite risk score is computed per ward per month:

```python
def calculate_dynamic_risk(d):
    score = 0
    if d['Soil_Moisture'] > 0.35:   score += 40
    elif d['Soil_Moisture'] > 0.25: score += 20
    if 25 <= d['LST_Surface_C'] <= 30: score += 30
    if d['NDWI_Water'] > -0.1:     score += 20
    if d['Population_Density_Per_KM2'] > 300: score += 10
    return score  # 0–100
```

Risk thresholds:

| Score | Label | Colour |
|-------|-------|--------|
| ≥ 50 | **High** | `#d93025` |
| 25–49 | **Moderate** | `#f9bb06` |
| < 25 | **Low** | `#34a853` |

### NCD risk factors

NCD risk is derived from:
- Air Quality Index (AQI)
- Urban heat stress (LST deviation)
- Population density and healthcare access
- Lifestyle and land-cover proxies

### Spatial analysis

- Ward-level and municipality-level aggregation (Limpopo, using GADM ADM3 boundaries)
- Country-level NCD choropleth (South Africa, Botswana, Zimbabwe, Lesotho)
- Hotspot detection via spatial clustering

### Alert engine

- Configurable risk thresholds trigger notifications
- Outputs: dashboard flags, email/SMS alerts, automated PDF reports

---

## Layer 4 — Health Surveillance Dashboard

The dashboard is a Leaflet-based single-page application deployed on **AWS Amplify**.

| Component | Description |
|-----------|-------------|
| **Interactive maps** | Risk-coloured circle markers per ward; Leaflet with OSM tiles |
| **Region selector** | Province → Municipality → Ward drill-down with Apply/Reset |
| **Time slider** | Monthly snapshots from January 2025 to January 2026 |
| **Risk filter** | Show all / High / Moderate / Low |
| **Environmental panel** | Habitat type, population density, agricultural area, surface temperature, soil moisture |
| **Risk prediction panel** | Current risk level label + percentage |
| **Popup cards** | Per-ward risk summary on marker click |

---

## Technology stack

| Layer | Technology |
|-------|------------|
| EO processing | Google Earth Engine (Python API) |
| Frontend | HTML · CSS · JavaScript (ES6) |
| Mapping | Leaflet.js + OpenStreetMap |
| CSV parsing | PapaParse |
| Hosting | AWS Amplify |
| Boundary data | GADM ADM1/ADM3 GeoJSON |

---

## Validation partners

The system architecture has been scoped in consultation with:

- **UCT** — University of Cape Town (environmental health modelling)
- **CSIR** — geospatial analysis and EO validation
- **NICD** — epidemiological data integration
- **TuksNovation / NeoFrontiers** — incubation and funder oversight