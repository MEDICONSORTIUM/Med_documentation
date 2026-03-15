---
id: ncd
title: NCD Risk Module
sidebar_label: NCD Risk
---

# NCD Risk Module

The NCD (Non-Communicable Disease) risk module maps environmental and lifestyle risk factors for conditions such as cardiovascular disease, diabetes, respiratory disease and obesity across **Southern Africa**.

:::tip Live module
Open the NCD dashboard: [https://main.d1jko0jkg4m7f.amplifyapp.com/](https://main.d1jko0jkg4m7f.amplifyapp.com/) → NCD Risk Prediction
:::

---

## Scope

| Property | Detail |
|----------|--------|
| **Geography** | South Africa · Botswana · Zimbabwe · Lesotho |
| **Granularity** | Country → Province → Municipality |
| **Boundary data** | GADM ADM1 (provinces) + ADM3 (municipalities) |

---

## Risk factors tracked

| Factor | EO / Data source | Indicator |
|--------|-----------------|-----------|
| **Air quality** | Sentinel-5P TROPOMI | NO₂, PM₂.₅ proxy, AQI |
| **Urban heat stress** | Landsat LST | LST deviation from baseline |
| **Vegetation / green space** | Sentinel-2 NDVI | Green space access proxy |
| **Built-up density** | ESA WorldCover Class 50 | Urban sprawl indicator |
| **Access to healthcare** | Facility point data | Distance-to-clinic index |
| **Lifestyle proxy** | WorldPop + land cover | Urban / sedentary classification |
| **Obesity prevalence** | Survey-derived | % prevalence by province |

---

## Country-level NCD risk scores (prototype)

The prototype assigns baseline country-level NCD risk scores used for choropleth mapping:

| Country | Risk score | Level |
|---------|-----------|-------|
| Zimbabwe | 63% | 🟠 Moderate-High |
| South Africa | 58% | 🟡 Moderate |
| Lesotho | 52% | 🟡 Moderate |
| Botswana | 45% | 🟢 Moderate-Low |

```javascript
const countryNcdRisk = {
  "South Africa": 58,
  "Botswana":     45,
  "Zimbabwe":     63,
  "Lesotho":      52
};
```

These values will be replaced by EO-derived, ward-level computed scores in Milestone 2.

---

## Dashboard features

### Country choropleth

On load, all four countries are rendered as coloured polygons using GADM Africa GeoJSON. Colour scale:

| Risk | Fill colour |
|------|------------|
| ≥ 70% | `#d73027` (red) |
| 55–69% | `#fc8d59` (orange) |
| 40–54% | `#fee08b` (yellow) |
| < 40% | `#91cf60` (green) |

### Province drill-down (South Africa)

Clicking South Africa (or selecting it in the dropdown) loads provincial boundaries from `South_Africa_ADM1.geojson`. Each province is selectable and zooms the map.

### Municipality layer

Selecting a province loads municipality centroids from `South_Africa_ADM3.geojson` as circle markers, populating the municipality dropdown.

### Environmental & lifestyle panel

Displays for the selected region:

- Lifestyle type (urban / sedentary classification)
- Population density (persons/km²)
- Access to healthcare (% index)
- Air Quality Index
- Obesity prevalence

---

## Data sources

| Dataset | Description | Provider |
|---------|-------------|----------|
| `africa-countries.geo.json` | Country polygons | GADM |
| `South_Africa_ADM1.geojson` | SA provincial boundaries | GADM |
| `South_Africa_ADM3.geojson` | SA municipality centroids | GADM |
| Sentinel-5P TROPOMI | Air quality (NO₂, CO) | ESA / GEE |
| WorldPop | Population density | WorldPop |
| ESA WorldCover | Land cover classification | ESA / GEE |

---

## Roadmap

| Phase | Planned enhancement |
|-------|-------------------|
| Milestone 2 | Replace static NCD scores with GEE-computed, ward-level values |
| Milestone 2 | Add Sentinel-5P TROPOMI AQI layer to map |
| Milestone 2 | Extend to Mozambique and Namibia |
| Milestone 3 | Validate against SADHS health survey data |
| Milestone 3 | Add time slider for NCD trend analysis (matching malaria module) |