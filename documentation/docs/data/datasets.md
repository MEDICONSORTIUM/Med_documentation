---
id: datasets
title: Datasets
sidebar_label: Datasets
---

# Datasets

All datasets used by the platform are described here. The prototype dataset was extracted from Google Earth Engine and covers Limpopo Province, South Africa for January 2025 – January 2026.

---

## Primary dataset — Limpopo Risk Data

**File:** `Limpopo_Risk_Jan25_Jan26_Safe.csv`

| Property | Value |
|----------|-------|
| Records | 7,384 |
| Time range | January 2025 – January 2026 |
| Temporal resolution | Monthly |
| Spatial coverage | Limpopo Province, South Africa |
| Spatial unit | Ward (GADM ADM3) |
| Municipalities | 9 |
| Source | Google Earth Engine |

### Column reference

| Column | Type | Unit | Description |
|--------|------|------|-------------|
| `Month` | string | — | Month-year label (e.g. `Jan 2025`) |
| `WardLabel` | string | — | Ward code (e.g. `LIM331_1`) |
| `Municipali` | string | — | Municipality name |
| `latitude` | float | degrees | Ward centroid latitude (WGS84) |
| `longitude` | float | degrees | Ward centroid longitude (WGS84) |
| `LST_Surface_C` | float | °C | Land surface temperature |
| `Air_Temp_C` | float | °C | Near-surface air temperature |
| `Soil_Moisture` | float | m³/m³ | Volumetric soil moisture |
| `NDWI_Water` | float | index | Normalised Difference Water Index |
| `Habitat_Vegetation_Index` | float | index | Vegetation density |
| `Agric_Percentage` | float | fraction | Agricultural land cover (0–1) |
| `Population_Density_Per_KM2` | float | persons/km² | WorldPop population density |
| `Habitat_Class_Code` | float | code | ESA WorldCover 2021 class |

### Sample record

```csv
Month,WardLabel,Municipali,latitude,longitude,LST_Surface_C,...
Jan 2025,LIM331_1,Greater Giyani Local Municipality,-23.369,30.357,27.62,...
```

---

## Municipalities covered

| Code prefix | Municipality |
|-------------|-------------|
| LIM331 | Greater Giyani Local Municipality |
| LIM332 | Greater Letaba Local Municipality |
| LIM333 | Greater Tzaneen Local Municipality |
| LIM334 | Ba-Phalaborwa Local Municipality |
| LIM335 | Maruleng Local Municipality |
| LIM341 | Musina Local Municipality |
| LIM342 | Mutale Local Municipality |
| LIM343 | Thulamela Local Municipality |
| LIM344 | Collins Chabane Local Municipality |

---

## Boundary datasets

| File | Content | Format | Source |
|------|---------|--------|--------|
| `africa-countries.geo.json` | African country polygons | GeoJSON | GADM v4 |
| `South_Africa_ADM1.geojson` | South Africa provincial boundaries | GeoJSON | GADM v4 |
| `South_Africa_ADM3.geojson` | South Africa municipality centroids | GeoJSON | GADM v4 |

---

## EO source collections (Google Earth Engine)

| GEE Collection ID | Satellite | Variables extracted |
|-------------------|-----------|-------------------|
| `COPERNICUS/S2_SR_HARMONIZED` | Sentinel-2 MSI | NDWI, NDVI, Habitat index |
| `MODIS/061/MOD11A2` | MODIS Terra | LST |
| `MODIS/061/MOD13A2` | MODIS Terra | NDVI |
| `NASA/USDA/HSL/SMAP10KM_soil_moisture` | SMAP | Soil moisture |
| `WORLDCLIM/V1/MONTHLY` | WorldClim | Air temperature |
| `ESA/WorldCover/v200` | ESA WorldCover | Habitat class code, agricultural % |
| `WorldPop/GP/100m/pop` | WorldPop | Population density |

---

## Data update frequency

| Dataset | Current | Target (Milestone 2) |
|---------|---------|---------------------|
| Malaria risk CSV | Monthly batch export | Automated GEE → API |
| NCD country scores | Static prototype | GEE-computed quarterly |
| Boundary files | Static | Static (no update needed) |

---

## Accessing the data

The datasets are stored in the platform's `/data/` directory and loaded at runtime by the frontend. For direct access or to run GEE extraction scripts, see [Google Earth Engine →](/docs/data/google-earth-engine).