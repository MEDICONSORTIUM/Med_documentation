---
id: wireframes
title: Wireframes
sidebar_label: Wireframes
description: Low-fidelity wireframes for the EOHA platform — Home Page, Malaria Prediction Page, and NCD Prediction Page.
---

# Wireframes

The following low-fidelity wireframes define the three primary views of the EOHA platform. They establish layout structure, navigation hierarchy, and component placement without prescribing visual design.

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
| Region Selector | Left panel, top | Same zone selector as Malaria page |
| Environmental Factors | Left panel, bottom | Toggles for NO2, SO2, aerosol, UV, LST overlays |
| Interactive Map | Centre | Leaflet choropleth for NCD risk |
| Risk Prediction | Right panel | NCD exposure score, primary category |
| Legend | Right panel, bottom | Colour key |

---

:::note Layout continuity
The Malaria and NCD pages share an identical layout structure to minimise context-switching for users monitoring both disease streams simultaneously. Shared components (Region Selector, Interactive Map, Legend) use the same interaction patterns across both pages.
:::
