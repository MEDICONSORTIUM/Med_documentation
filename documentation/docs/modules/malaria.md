---
id: malaria
title: Malaria Risk Module
sidebar_label: Malaria Risk
---

# Malaria Risk Module

The malaria risk module provides **ward-level monthly risk predictions** across Limpopo Province, South Africa, using satellite-derived environmental indicators.

:::tip Live module
Open the malaria dashboard: [https://main.d1jko0jkg4m7f.amplifyapp.com/](https://main.d1jko0jkg4m7f.amplifyapp.com/) → Malaria Risk Prediction
:::

---

## How risk is calculated

The malaria risk score is a composite of four environmental factors extracted from EO data:

| Factor | Condition | Points added |
|--------|-----------|-------------|
| **Soil Moisture** | > 0.35 | +40 |
| **Soil Moisture** | 0.25 – 0.35 | +20 |
| **Surface Temperature** | 25°C – 30°C | +30 |
| **NDWI (water presence)** | > −0.1 | +20 |
| **Population Density** | > 300 /km² | +10 |

**Maximum score: 100**

```javascript
function calculateDynamicRisk(d) {
  let score = 0;
  if (d.Soil_Moisture > 0.35)       score += 40;
  else if (d.Soil_Moisture > 0.25)  score += 20;
  if (d.LST_Surface_C >= 25 && d.LST_Surface_C <= 30) score += 30;
  if (d.NDWI_Water > -0.1)          score += 20;
  if (d.Population_Density_Per_KM2 > 300) score += 10;
  return score;
}
```

### Risk thresholds

| Score | Risk level | Map colour |
|-------|-----------|-----------|
| ≥ 50 | 🔴 **High** | `#d93025` |
| 25–49 | 🟡 **Moderate** | `#f9bb06` |
| 0–24 | 🟢 **Low** | `#34a853` |

---

## Dashboard features

### Region selector

Drill down from province → municipality → ward:

- **Province:** Currently fixed to Limpopo
- **Municipality:** 9 municipalities including Greater Giyani, Ba-Phalaborwa, Greater Letaba, Maruleng, and more
- **Ward:** All wards for the selected municipality in the selected month

Click **Apply** to fly the map to the selected ward and open its risk popup.

### Time slider

The slider spans **January 2025 to January 2026** (13 monthly snapshots). Moving the slider re-renders all map markers for the selected month.

```javascript
const MONTH_DATA = [
  { id: 'Jan 2025', month: 'January',  year: '2025' },
  { id: 'Feb 2025', month: 'February', year: '2025' },
  // ... through ...
  { id: 'Jan 2026', month: 'January',  year: '2026' }
];
```

### Risk level filter

Filter the map to show only **High Risk**, **Medium Risk**, or **Low Risk** wards.

### Environmental factors panel

When a ward is selected, the panel displays:

| Indicator | Source | Notes |
|-----------|--------|-------|
| **Habitat Type** | ESA WorldCover | Land cover class (tree cover, cropland, wetland, etc.) |
| **Population Density** | WorldPop | Persons per km² |
| **Agricultural Area** | ESA WorldCover Class 40 | % of ward under cultivation |
| **Surface Temperature** | Sentinel-3 / Landsat | LST in °C |
| **Soil Moisture** | MODIS / Sentinel-1 | m³/m³ index |

---

## Dataset

| Property | Value |
|----------|-------|
| **File** | `Limpopo_Risk_Jan25_Jan26_Safe.csv` |
| **Records** | 7,384 |
| **Months** | Jan 2025 – Jan 2026 (13 months) |
| **Coverage** | Limpopo Province, South Africa |
| **Municipalities** | 9 |
| **Source** | Google Earth Engine |

See [Datasets →](/docs/data/datasets) for full schema and download instructions.

---

## Habitat class codes

The `Habitat_Class_Code` field uses ESA WorldCover 2021 classes:

| Code | Description |
|------|-------------|
| 10 | Tree cover |
| 20 | Shrubland |
| 30 | Grassland |
| 40 | Cropland |
| 50 | Built-up |
| 60 | Bare / sparse vegetation |
| 80 | Permanent water bodies |
| 90 | Herbaceous wetland |

---

## Known limitations

- Risk model uses EO-derived proxies for mosquito habitat — it does not incorporate direct vector counts or entomological surveillance data
- Population density uses WorldPop estimates (not census-level ward data)
- Soil moisture is approximated from optical and SAR indices, not in-situ measurements
- The 25°C–30°C LST window is a simplified *Anopheles* optimum; actual transmission is influenced by many additional factors

---

## Roadmap

| Phase | Planned enhancement |
|-------|-------------------|
| Milestone 2 | Connect live GEE API for real-time monthly refresh |
| Milestone 2 | Add NICD case-count overlay |
| Milestone 3 | Validate risk scores against NICD malaria incidence data |
| Milestone 3 | Extend coverage to other high-burden provinces (KZN, Mpumalanga) |