---
id: wireframes
title: Wireframes
sidebar_label: Wireframes
description: Low-fidelity wireframes for the EOHA platform — Home Page, Malaria Prediction Page, and NCD Prediction Page.
---

# Wireframes

The following low-fidelity wireframes define the three primary views of the EOHA platform. They establish layout structure, navigation hierarchy, and component placement without prescribing visual design.

:::info Implementation status, verified against `eoha-prototype`
The **Home** and **Malaria Prediction** pages match this wireframe and are built on real, live data.
The **NCD Prediction** page matches the layout but displays **fabricated demonstration numbers**, not
EO-derived data, and its province drill-down is currently broken (see the NCD Prediction section
below). Neither page includes a "Risk Prediction" panel backed by a trained model — the Malaria page's
score comes from a fixed rule-based formula (`calculateDynamicRisk()`), and the separate Forecasting
page's chart is `Math.random()`-generated on every load.
:::

---

## Three-page layout overview

The wireframe below shows all three pages and the navigation flow between them:

**Home Page → Malaria Prediction Page → NCD Prediction Page**

![EOHA Wireframes — Home, Malaria, and NCD pages with navigation flow](/assets/design-spec/wireframe.png)

---

## Page breakdown

### Home Page

| Component | Purpose |
|-----------|---------|
| Navigation bar | Links to Contact Us, Malaria Predict, NCD Predict |
| Globe visualisation | Entry-point visual — clickable world/Africa map |
| Section links | About, Malaria Prediction, NCD Prediction, Partners |

The home page acts as an entry point and orientation hub. Users navigate to the risk prediction modules via the nav buttons or the section link list.

---

### Malaria Prediction Page

| Component | Position | Purpose |
|-----------|----------|---------|
| Page title | Top | "Malaria Risk Prediction" |
| Region Selector | Left panel, top | Dropdown / search for municipality/ward |
| Environmental Factors | Left panel, bottom | Toggles for NDWI, LST, soil moisture, NDVI overlays |
| Interactive Map | Centre | Leaflet choropleth — main risk visualisation |
| Risk Prediction | Right panel | Score display, confidence interval, forecast date |
| Legend | Right panel, bottom | Colour key: High / Moderate / Low |

---

### NCD Prediction Page

| Component | Position | Purpose |
|-----------|----------|---------|
| Page title | Top | "NCD Risk Prediction" |
| Region Selector | Left panel, top | Country → Province → Municipality (municipality tier is present in the UI but non-functional — no municipality-level GeoJSON exists) |
| NCD Focus | Left panel, bottom | Category filter buttons (Diabetes, Hypertension, CVD, Respiratory, Obesity) |
| Interactive Map | Centre | Leaflet choropleth for NCD risk |
| Risk Score | Right panel | NCD risk score and factor breakdown |
| Country Stats | Right panel, bottom | Population, life expectancy, NCD mortality share |

:::caution Verified against `pages/ncd-page.html`
Every number shown by this page — country scores, province scores, all four "Risk Factors" bars, and
all "Country Stats" — comes from a hardcoded JavaScript object baked into the page
(`ncdData`/`provinceNcdRisk`), not from any GeoJSON property, CSV, or API call. The province
drill-down is currently broken: the code reads `feature.properties.NAME_1`, but the loaded
`South_Africa_ADM1.geojson` file uses the `shapeName` property instead — every province click
currently renders an `undefined` name with a `0%` score. The "Municipality" dropdown always shows
"— Not available —" because no municipality-level boundary file exists in the repo.
:::

---

:::note Layout continuity
The Malaria and NCD pages share an identical layout structure to minimise context-switching for users monitoring both disease streams simultaneously. Shared components (Region Selector, Interactive Map, Legend) use the same interaction patterns across both pages.
:::
