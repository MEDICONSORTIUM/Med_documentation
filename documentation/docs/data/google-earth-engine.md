---
id: google-earth-engine
title: Google Earth Engine
sidebar_label: Google Earth Engine
---

# Google Earth Engine

All Earth Observation data used by this platform is sourced and processed using **Google Earth Engine (GEE)** — a cloud-based geospatial analysis platform that provides petabyte-scale access to satellite imagery.

:::info Access required
A GEE account is required to run the extraction scripts. Register at [earthengine.google.com](https://earthengine.google.com).
:::

---

## How GEE is used in this project

| Stage | GEE role |
|-------|----------|
| Ingestion | Filter satellite collections by date, area and cloud cover |
| Pre-processing | Apply atmospheric correction, cloud masking, compositing |
| Feature extraction | Compute NDWI, NDVI, LST, soil moisture, land cover indices |
| Export | Export per-ward monthly statistics to Google Drive / CSV |

---

## Core extraction script

The following Python script extracts the monthly ward-level statistics used to build the `Limpopo_Risk_Jan25_Jan26_Safe.csv` dataset.

```python
import ee
import pandas as pd

ee.Initialize(project='your-gee-project-id')

# ── Geometry ──────────────────────────────────────────────────
limpopo = ee.FeatureCollection('FAO/GAUL/2015/level2') \
    .filter(ee.Filter.eq('ADM1_NAME', 'Limpopo'))

# ── Date range ────────────────────────────────────────────────
months = pd.date_range('2025-01-01', '2026-01-01', freq='MS')

results = []

for start in months:
    end = start + pd.offsets.MonthEnd(1)
    label = start.strftime('%b %Y')

    # ── Sentinel-2: NDWI ──────────────────────────────────────
    s2 = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
        .filterDate(str(start.date()), str(end.date()))
        .filterBounds(limpopo.geometry())
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
        .map(lambda img: img.normalizedDifference(['B3', 'B8'])
             .rename('NDWI').copyProperties(img)))
    ndwi = s2.median().select('NDWI')

    # ── MODIS LST ─────────────────────────────────────────────
    lst = (ee.ImageCollection('MODIS/061/MOD11A2')
        .filterDate(str(start.date()), str(end.date()))
        .select('LST_Day_1km')
        .mean()
        .multiply(0.02).subtract(273.15)  # Kelvin → Celsius
        .rename('LST_Surface_C'))

    # ── SMAP Soil Moisture ────────────────────────────────────
    soil = (ee.ImageCollection('NASA/USDA/HSL/SMAP10KM_soil_moisture')
        .filterDate(str(start.date()), str(end.date()))
        .select('ssm')
        .mean()
        .rename('Soil_Moisture'))

    # ── Combine ───────────────────────────────────────────────
    composite = ndwi.addBands(lst).addBands(soil)

    # ── Reduce per ward ───────────────────────────────────────
    stats = composite.reduceRegions(
        collection=limpopo,
        reducer=ee.Reducer.mean(),
        scale=1000
    )

    # ── Export ────────────────────────────────────────────────
    task = ee.batch.Export.table.toDrive(
        collection=stats,
        description=f'limpopo_risk_{label.replace(" ", "_")}',
        fileFormat='CSV'
    )
    task.start()
    print(f'Exported: {label}')
```

---

## ESA WorldCover — Land cover

```python
worldcover = ee.ImageCollection('ESA/WorldCover/v200').first()

# Agricultural area (class 40) per ward
agric = worldcover.eq(40).rename('Agric')

agric_stats = agric.reduceRegions(
    collection=limpopo,
    reducer=ee.Reducer.mean().setOutputs(['Agric_Percentage']),
    scale=10
)
```

---

## WorldPop — Population density

```python
worldpop = (ee.ImageCollection('WorldPop/GP/100m/pop')
    .filter(ee.Filter.eq('country', 'ZAF'))
    .filter(ee.Filter.eq('year', 2020))
    .first())

pop_stats = worldpop.reduceRegions(
    collection=limpopo,
    reducer=ee.Reducer.mean().setOutputs(['Population_Density_Per_KM2']),
    scale=100
)
```

---

## Tips for GEE extraction

1. **Use `filterBounds` early** — reduces the collection size significantly before any `.map()` call
2. **Monthly median composites** are preferred over single dates for cloud-prone regions
3. **Scale parameter** in `reduceRegions` must match the native resolution of the image (MODIS = 1000 m, Sentinel-2 = 10 m, WorldPop = 100 m)
4. **Export to Drive** for large collections — avoid `getInfo()` which times out on large datasets
5. **Check CLOUDY_PIXEL_PERCENTAGE** — use < 20 % for Limpopo; during rainy season (Nov–Mar) you may need to loosen to < 40 %

---

## Connecting GEE to the live platform (Milestone 2)

In Milestone 2, the manual CSV export will be replaced by an automated pipeline:

```
GEE Batch Export (monthly cron)
    → Google Cloud Storage bucket
    → Cloud Function trigger
    → Platform /data/ directory update
    → Dashboard auto-refreshes
```

This will eliminate the current manual step of exporting CSVs from GEE and uploading them to the Amplify `/data/` folder.