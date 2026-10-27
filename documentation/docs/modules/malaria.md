---
id: malaria
title: Malaria Risk Module
sidebar_label: Malaria Risk
---

# Malaria Risk Module

The malaria dashboard displays ward-level monthly environmental observations and a rule-based
habitat suitability score. The dashboard runs in the browser and loads a CSV bundled in the
`eoha-prototype` repository.

:::tip Live module
Open the malaria dashboard: [https://www.eoha.co.za/](https://www.eoha.co.za/) → Malaria
:::

:::caution Validation data has not been acquired
The current disease-monitoring collection contains environmental variables only and no observed
malaria cases or other disease outcome labels. **Validation data has not been acquired**, so the
displayed score has not been validated against malaria incidence. It is a rule-based environmental
proxy for exploration, not a clinical prediction or a confirmed outbreak forecast.
:::

## How the score is calculated

The browser applies a fixed 0–100 point formula to each CSV row:

| Environmental or contextual input | Condition | Points |
|---|---|---:|
| Soil moisture | > 0.35 | +40 |
| Soil moisture | > 0.25 and ≤ 0.35 | +20 |
| Land surface temperature | 25°C through 30°C | +30 |
| NDWI water index | > −0.1 | +20 |
| Population density | > 300 people/km² | +10 |

The points are added and categorized as **High** (≥ 50), **Moderate** (25–49), or **Low** (below
25). This is a deterministic ruleset in the client-side code, not a trained or forecasting model.
Blank or nonnumeric inputs are converted to zero before threshold checks. This can change scores
when data is missing; for example, missing NDWI becomes zero and passes the `NDWI_Water > -0.1`
condition.

## Dashboard features

- Leaflet ward map, risk markers and heatmap, with ward popups.
- Municipality and ward selection, risk-level filtering, and a January 2025–January 2026 monthly
  timeline.
- Selected ward risk and municipality mean score panels.
- Environmental factor bars. The current UI labels (“Precipitation,” “Avg Temperature,” and
  “Humidity Level”) do not exactly match the values bound in code: agricultural land percentage,
  land surface temperature, and soil moisture, respectively. Interpret these bars with that mapping
  in mind.
- Responsive theme controls and map baselayer styling.

## Dataset and scope

The page loads `data/Limpopo_Risk_Jan25_Jan26_Safe.csv` from the prototype repository. Despite the
filename, the dashboard dataset spans all nine South African provinces. A separate file with a
similar name is not loaded by the dashboard. See [Datasets](/docs/data/datasets) for the file
details, fields, and its relationship to the independent EO pipeline.

The CSV is bundled frontend data; the dashboard does not obtain its rows from the pipeline database
or the backend API at runtime. The score is calculated from these preloaded observations in the
browser.

## Limitations

- No malaria case-count or other health outcome dataset has been acquired for model validation.
- Environmental suitability is not the same as observed transmission; the score omits case data,
  vector surveillance, intervention coverage, and other determinants.
- Risk thresholds and weights are heuristic and have not been calibrated against observed disease
  outcomes.
- CSV observations are static in this repository and are not refreshed by the separate monthly
  ingestion pipeline.

The environmental exposure variables used by this prototype support exploratory monitoring only.
Do not interpret the displayed score as a validated estimate of disease incidence.
