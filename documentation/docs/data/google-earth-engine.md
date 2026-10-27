---
id: google-earth-engine
title: Google Earth Engine
sidebar_label: Google Earth Engine
---

# Google Earth Engine

All Earth Observation data used by the live `eo-datapipeline` pipeline is sourced and processed using **Google Earth Engine (GEE)** — a cloud-based geospatial analysis platform that provides petabyte-scale access to satellite imagery.

:::caution This page now reflects the real pipeline
Earlier drafts of this page showed an illustrative script that doesn't match any code in any of the
three EOHA repositories — different GEE collections, a Drive export instead of the real GCS export,
and Limpopo-only scope instead of the real 9-province loop. It has been replaced below with the
actual logic from `eo-datapipeline/etl_pipeline.py`, verified line-by-line against source.
:::

:::info Access required
A GEE account (with a linked Cloud project and a service-account JSON key) is required to run the
real extraction script. Register at [earthengine.google.com](https://earthengine.google.com).
:::

---

## How GEE is used in this project

| Stage | GEE role |
|-------|----------|
| Asset loading | Ward boundaries, WorldPop population, ESA WorldCover land cover loaded as `FeatureCollection`/`Image` |
| Feature extraction | `build_safe_band_image()` computes LST, NDVI, a manually-derived NDWI, ERA5 air temp/soil moisture per province |
| Export | `ee.batch.Export.table.toCloudStorage()` — **not** `toDrive()` — one task per province, CSV to a GCS bucket |

There is no separate "pre-processing" or cloud-masking stage — each band is instead wrapped in a
guard (`build_safe_band_image()`) that substitutes a blank masked image if the month's collection is
empty, so a sparse month doesn't crash the run.

---

## The real extraction logic

This is the actual production code, from
[`eo-datapipeline/etl_pipeline.py`](https://github.com/MEDICONSORTIUM/eo-datapipeline/blob/main/etl_pipeline.py)
(step 3–4 of the pipeline; see [Pipeline Tests →](/docs/testing/pipeline-tests) for how it's tested):

```python
def build_safe_band_image(image_collection, band_name, scale_factor, offset, output_name):
    """Averages the collection for the band; falls back to a blank masked
    image if no scenes exist for the processing window."""
    filtered = image_collection.select(band_name)
    has_data = filtered.size().gt(0)
    image_with_data    = filtered.mean().multiply(scale_factor).add(offset).rename(output_name)
    image_without_data = ee.Image().rename(output_name).selfMask()
    return ee.Image(ee.Algorithms.If(has_data, image_with_data, image_without_data))


def process_province(province_name):
    province_wards = wards.filter(ee.Filter.eq('Province', province_name))

    # Land Surface Temperature (MODIS MOD11A1)
    lst_collection = ee.ImageCollection('MODIS/061/MOD11A1').filterDate(start_date, end_date)
    lst_image = build_safe_band_image(lst_collection, 'LST_Day_1km', 0.02, -273.15, 'LST_Surface_Temp_C')

    # Vegetation Index (MODIS MOD13Q1)
    ndvi_collection = ee.ImageCollection('MODIS/061/MOD13Q1').filterDate(start_date, end_date)
    ndvi_image = build_safe_band_image(ndvi_collection, 'NDVI', 0.0001, 0, 'NDVI_Vegetation_Index')

    # Water Index — manually computed normalized difference (MODIS MOD09GA)
    ndwi_collection = ee.ImageCollection('MODIS/061/MOD09GA').filterDate(start_date, end_date)
    ndwi_image = ndwi_collection.map(
        lambda img: img.normalizedDifference(['sur_refl_b04', 'sur_refl_b02'])
    ).mean().rename('NDWI_Water')

    # Air Temperature and Soil Moisture (ERA5-Land)
    era5_collection = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY").filterDate(start_date, end_date)
    era5_image = (
        era5_collection
        .select(['temperature_2m', 'volumetric_soil_water_layer_1'])
        .mean()
        .subtract(ee.Image([273.15, 0]))
        .rename(['Air_Temp_C', 'Soil_Moisture'])
    )

    full_stack = lst_image.addBands([ndvi_image, ndwi_image, era5_image, population_image, cropland_image])

    ward_means = full_stack.reduceRegions(
        collection=province_wards, reducer=ee.Reducer.mean(), scale=1000
    ).map(lambda feature: feature.set('Month', month_label))

    return ward_means  # simplified — the real function also joins habitat mode + lat/lon
```

(This is a simplified excerpt for readability — see the full script for the empty-collection guards
on NDWI/ERA5, the habitat-mode join, and the centroid/population-density enrichment step.)

---

## Shared assets (loaded once, outside the per-province loop)

```python
wards = ee.FeatureCollection("projects/modis-temperature-data/assets/MDB_Wards_2020")

population_image = (
    ee.ImageCollection("WorldPop/GP/100m/pop")
    .filterDate('2020-01-01', '2021-01-01')
    .mean()
    .rename('Population_Count')
)

landcover_image = ee.ImageCollection("ESA/WorldCover/v100").first()
cropland_image  = landcover_image.eq(40).rename('Agric_Percentage')   # binary cropland mask
habitat_image   = landcover_image.select('Map').rename('Habitat_Code')
```

---

## Export — to Cloud Storage, not Drive

```python
task = ee.batch.Export.table.toCloudStorage(
    collection=ward_data,
    description=f"Export_{filename}",
    bucket=BUCKET_NAME,
    fileNamePrefix=f"pipeline_output/{filename}",
    fileFormat='CSV',
    selectors=export_columns
)
task.start()
```

One task is submitted per province (9 total), all started before polling begins. This is the
production export path — no script anywhere in any of the three repos exports to Google Drive.

---

## Tips for GEE extraction (still accurate)

1. **Use `filterBounds`/province filters early** — reduces collection size before any `.map()` call.
2. **`scale=1000` in `reduceRegions`** matches this pipeline's chosen reduction scale — coarser than
   the native resolution of most of the source bands, which trades detail for run time across 9
   provinces every month.
3. **Wrap sparse collections in a guard** (`build_safe_band_image()`) rather than letting a
   zero-image month crash the run.
4. **Export to Cloud Storage** for large collections — avoid `getInfo()`, which times out on large
   datasets.

---

## Connecting this pipeline to the live dashboard — not yet done

The pipeline's output lands in PostgreSQL (`zone`, `malaria_observation`), reachable only through
`eoha_backend`'s read-only REST API. **`eoha-prototype`'s dashboard does not call that API** — it
reads a static CSV bundled in its own repo instead (see [Datasets →](/docs/data/datasets) and
[System Architecture →](/docs/architecture/system-architecture)). Wiring the two together — either by
having the dashboard call `eoha_backend`, or by adding an export step from this pipeline into the
dashboard's data file — is unbuilt work, not a manual step being eliminated by a future milestone.
