---
id: eo-pipeline
title: EO Data Pipeline
sidebar_label: EO Data Pipeline
---

# Annexure B — EO Data Pipeline Framework

> **Deliverable for Milestone 1** — Data pipeline and storage architecture plan.

## Overview

The EO Data Pipeline is a six-stage framework that takes raw satellite imagery from acquisition through to health surveillance output. All EO processing is performed via **Google Earth Engine** (GEE), with health and ground-truth data integrated at the fusion stage.

```
Stage 1: EO Data Acquisition
        ↓
Stage 2: Pre-processing & QA/QC
        ↓  ← Health data inputs (NICD, DoH)
Stage 3: Feature Extraction          ← Ground truth (sensors, lab)
        ↓
Stage 4: Spatial-Temporal Data Fusion
        ↓
Stage 5: Risk Modelling Engine
        ↓
Stage 6: Surveillance Dashboard Output
        ↑________ validation feedback loop __________↑
```

---

## Stage 1 — EO Data Acquisition

**Sources ingested:**

| Satellite | Band / Product | Spatial res. | Temporal res. |
|-----------|---------------|-------------|---------------|
| Sentinel-2 MSI | B3 (Green), B8 (NIR), B11 | 10 m | 5 days |
| Sentinel-3 SLSTR | LST | 1 km | Daily |
| Landsat 8/9 OLI | NDVI, land cover | 30 m | 16 days |
| MODIS Terra | Soil moisture proxy | 500 m | Daily |
| MODIS Aqua | Chlorophyll-a, SST | 1 km | Daily |

**Acquisition method:** Scheduled batch pulls via the GEE Python API. Assets are filtered by date range, cloud cover threshold (< 20 %) and study area boundary.

```python
import ee
ee.Initialize()

sentinel2 = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate('2025-01-01', '2026-01-31')
    .filterBounds(limpopo_geometry)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)))
```

---

## Stage 2 — Pre-processing & QA/QC

All imagery is processed to surface-ready values before analysis.

| Step | Description |
|------|-------------|
| **Atmospheric correction** | Sentinel-2 SR product already corrected; Landsat applies USGS surface reflectance |
| **Cloud masking** | SCL band (Sentinel-2) and QA_PIXEL (Landsat) used to mask cloud and shadow |
| **Normalisation** | Band values scaled to 0–1 reflectance range |
| **Temporal compositing** | Monthly median composites reduce noise from residual cloud |
| **QA/QC checks** | Automated scripts flag missing data, extreme outliers and CRS mismatches |

---

## Stage 3 — Feature Extraction

Five primary indices are derived from the pre-processed imagery:

### NDWI — Normalised Difference Water Index

Detects surface water and waterlogged areas (mosquito breeding habitat):

```
NDWI = (Green – NIR) / (Green + NIR)
```

Values > −0.1 indicate significant surface water presence.

### NDVI — Normalised Difference Vegetation Index

Tracks vegetation density and seasonal land-cover change:

```
NDVI = (NIR – Red) / (NIR + Red)
```

### LST — Land Surface Temperature

Derived from Sentinel-3 SLSTR and Landsat thermal bands. Key malaria vector activity range: **25°C – 30°C**.

### Soil Moisture

Approximated from MODIS surface reflectance and Sentinel-1 SAR backscatter. Threshold values:

| Value | Interpretation |
|-------|---------------|
| > 0.35 | High moisture — high vector risk (+40 pts) |
| 0.25–0.35 | Moderate moisture (+20 pts) |
| < 0.25 | Low moisture |

### Agric_Percentage

Proportion of the ward covered by agricultural land, derived from ESA WorldCover 10 m land cover classification (Class 40 — Cropland).

---

## Stage 4 — Spatial-Temporal Data Fusion

EO features are joined to health and ground-truth datasets using **ward boundary polygons** (GADM ADM3 for Limpopo) and **monthly time steps**.

```
EO Features (per ward, per month)
    + NICD case counts (per ward, per month)
    + Ground sensor readings (per station, interpolated to ward)
    ─────────────────────────────────────────
    → Fused dataset: Limpopo_Risk_Jan25_Jan26_Safe.csv
```

**CSV schema:**

| Column | Type | Description |
|--------|------|-------------|
| `Month` | string | `Jan 2025` … `Jan 2026` |
| `WardLabel` | string | Ward code (e.g. `LIM331_1`) |
| `Municipali` | string | Municipality name |
| `latitude` | float | Ward centroid latitude |
| `longitude` | float | Ward centroid longitude |
| `LST_Surface_C` | float | Land surface temperature (°C) |
| `Air_Temp_C` | float | Air temperature (°C) |
| `Soil_Moisture` | float | Soil moisture index (0–1) |
| `NDWI_Water` | float | NDWI surface water index |
| `Habitat_Vegetation_Index` | float | Vegetation density (0–1) |
| `Agric_Percentage` | float | Agricultural area fraction |
| `Population_Density_Per_KM2` | float | Population density |
| `Habitat_Class_Code` | float | ESA WorldCover class code |

**Current dataset:** 7,384 records · 13 months · Limpopo Province · 9 municipalities

---

## Stage 5 — Risk Modelling Engine

See [System Architecture — Analytics & Modelling Engine](/docs/architecture/system-architecture#layer-3--analytics--modelling-engine) for the full risk formula.

**Key outputs per ward per month:**
- Composite risk score (0–100)
- Risk label: High / Moderate / Low
- Risk colour: `#d93025` / `#f9bb06` / `#34a853`

---

## Stage 6 — Surveillance Dashboard Output

The processed risk data is served to the frontend as a CSV file loaded at runtime by PapaParse:

```javascript
Papa.parse('../data/Limpopo_Risk_Jan25_Jan26_Safe.csv', {
  download: true,
  header: true,
  dynamicTyping: true,
  step: ({ data }) => {
    if (data.Municipali) {
      allCSVData.push(data);
      (districtLookup[data.Municipali] ||= []).push(data);
    }
  },
  complete: () => renderAllHotspots()
});
```

The dashboard renders Leaflet circle markers coloured by risk score, with popups, time-slider filtering and dropdown drill-down.

---

## Validation feedback loop

Post-render, stakeholder feedback from UCT, CSIR and NICD is used to:

1. Audit risk score accuracy against known disease burden data
2. Adjust index weights in the modelling engine
3. Validate QA/QC thresholds
4. Refine ward boundary alignment

This loop is formalised in **Milestone 3** (Prototype Validation & Testing).