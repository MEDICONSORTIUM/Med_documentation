---
slug: extracting-malaria-risk-data-gee
title: "How we extracted malaria risk variables from Google Earth Engine"
authors: [med_team]
tags: [google-earth-engine, python, tutorial, malaria, remote-sensing]
date: 2025-11-20
---

A practical walkthrough of how we pull NDWI, LST, soil moisture and land cover from GEE and aggregate it to ward level for the Limpopo malaria risk model.

<!-- truncate -->

Google Earth Engine gives you petabyte-scale access to satellite imagery. The challenge isn't getting the data — it's getting the *right* data at the right spatial and temporal resolution, then wrangling it into something a health surveillance dashboard can actually use.

Here's exactly what we did.

## Setting up the boundary

Everything aggregates up to GADM ADM3 ward polygons. We load Limpopo's wards directly from the FAO GAUL dataset in GEE:

```python
import ee
ee.Initialize(project='your-project-id')

limpopo = (ee.FeatureCollection('FAO/GAUL/2015/level2')
    .filter(ee.Filter.eq('ADM1_NAME', 'Limpopo')))
```

This gives you ~567 ward polygons. We add a `WardLabel` property by concatenating the ADM2 code with a sequential ward number — that becomes the primary key throughout the dataset.

## NDWI from Sentinel-2

The Normalised Difference Water Index picks up surface water and waterlogged soils:

```python
def add_ndwi(image):
    ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI')
    return image.addBands(ndwi)

s2 = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate('2025-01-01', '2025-01-31')
    .filterBounds(limpopo.geometry())
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(add_ndwi))

ndwi_monthly = s2.select('NDWI').median()
```

Values above −0.1 suggest meaningful surface water presence — a key condition for *Anopheles* breeding habitat.

## Land surface temperature from MODIS

MODIS MOD11A2 gives us 8-day composites at 1 km. We take the monthly mean and convert from the raw DN to Celsius:

```python
lst = (ee.ImageCollection('MODIS/061/MOD11A2')
    .filterDate('2025-01-01', '2025-01-31')
    .select('LST_Day_1km')
    .mean()
    .multiply(0.02)
    .subtract(273.15)
    .rename('LST_Surface_C'))
```

The 25–30°C window is where *Anopheles gambiae* and *A. arabiensis* thrive. LST values outside that range contribute 0 to the risk score.

## Soil moisture from SMAP

The SMAP 10 km product gives us a direct volumetric soil moisture estimate:

```python
smap = (ee.ImageCollection('NASA/USDA/HSL/SMAP10KM_soil_moisture')
    .filterDate('2025-01-01', '2025-01-31')
    .select('ssm')
    .mean()
    .rename('Soil_Moisture'))
```

Soil moisture above 0.35 m³/m³ is our high-risk threshold (+40 points in the risk model). This is the single highest-weighted variable because saturated soils are where larvae actually develop.

## Aggregating to ward level

Once we have all the band composites, we stack them and run `reduceRegions`:

```python
composite = ndwi_monthly.addBands(lst).addBands(smap)

ward_stats = composite.reduceRegions(
    collection=limpopo,
    reducer=ee.Reducer.mean(),
    scale=1000  # matches MODIS resolution
)
```

Then export to Drive:

```python
task = ee.batch.Export.table.toDrive(
    collection=ward_stats,
    description='limpopo_jan2025',
    fileFormat='CSV',
    selectors=['WardLabel', 'ADM2_NAME', 'NDWI', 'LST_Surface_C', 'Soil_Moisture']
)
task.start()
```

## One thing that tripped us up

The `scale` parameter in `reduceRegions` matters a lot. If you're mixing Sentinel-2 (10 m) and MODIS (1 km) bands in the same composite, GEE will resample everything to your chosen scale. We use 1000 m because SMAP is coarse — running at 10 m scale would be false precision and would time out on the export anyway.

For the ESA WorldCover land cover layer (10 m native), we run a separate reduction at scale=10 and join it in afterward.

## What we do with the output

The exported CSV gets light post-processing in Python (fixing column names, computing `Agric_Percentage` as the fraction of Class 40 pixels, clipping any implausible LST values) and then lands in the platform's `/data/` directory as `Limpopo_Risk_Jan25_Jan26_Safe.csv`.

PapaParse loads it at runtime in the browser. No backend required — at least for the prototype.

In Milestone 2, this export → post-process → upload cycle will be replaced by a Cloud Function that runs automatically when a new month's worth of GEE data is ready.