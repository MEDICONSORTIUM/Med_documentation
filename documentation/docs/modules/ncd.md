---
id: ncd
title: NCD Exposure Module
sidebar_label: NCD Exposure
---

# NCD Exposure Module

The current NCD page is an **environmental observation prototype**. It presents measurements from
the shared monthly CSV and geographic boundaries; it does not calculate or display an NCD disease
score.

:::tip Live module
Open the NCD dashboard: [https://www.eoha.co.za/](https://www.eoha.co.za/) → NCD Exposure
:::

:::caution Validation data has not been acquired
The current disease-monitoring collection uses environmental variables only. It does not contain
observed disease cases, health outcomes, or a validation dataset.
The environmental measurements have therefore **not been validated against disease incidence**.
The dashboard labels exposure scores as unavailable, and the scoring specification keeps scoring
disabled. These observations must not be interpreted as individual disease probabilities or as
validated NCD risk estimates.
:::

## Current data and coverage

The page loads `data/Limpopo_Risk_Jan25_Jan26_Safe.csv` from the prototype repository. Despite its
filename, the file contains monthly records across all nine South African provinces. It is a static
file bundled with the frontend; the NCD page does not call the EO pipeline or backend API.

| Input | Use in the page |
|---|---|
| `Air_Temp_C` | Show the mean of valid ward observations for the selected region and month |
| `LST_Surface_C` | Show the mean of valid ward observations for the selected region and month |
| `Population_Density_Per_KM2` | Show the mean of valid ward observations for the selected region and month |
| `Month`, `Province`, `Municipali`, `WardID`, `WardLabel`, coordinates | Filter observations and place ward markers on the map |

The three summary bars show the proportion of selected rows with a valid measurement. Regional
values are unweighted means, not population-weighted exposure. Blank or invalid values remain
unavailable rather than being converted to zero.

## Dashboard features

- Leaflet map with African country outlines and South African province boundaries.
- Country, province, municipality, ward, and month selectors. CSV-backed ward observations are
  available for South Africa; choosing another country does not produce CSV observations.
- Ward observation markers and a historical monthly timeline. Markers represent observation
  locations, not disease risk.
- Environmental measurement summaries for air temperature, land surface temperature, and
  population density.
- Theme selection for system, light, and dark appearance.
- No NCD score, risk category, forecast, alert, or disease outcome layer is currently calculated.

## Why environmental exposure scoring is disabled

The proposed exposure method is documented in the prototype repository's
[`docs/ncd-risk-scoring.md`](https://github.com/MEDICONSORTIUM/eoha-prototype/blob/main/docs/ncd-risk-scoring.md).
The downloadable schema is available from the live
[NCD Resource Center](https://eoha.co.za/pages/ncd-resource-center.html). The current monthly CSV does not provide all inputs or provenance
required by that proposal, including daily PM2.5 and heat/cold measures. It also has no acquired
health outcome data for validation. The schema therefore requires scoring to remain disabled and
scores to remain null until input requirements, reference methods, and validation data are reviewed.

## Data limitations and next steps

- Acquire and govern suitable disease outcome or health-survey data before claiming model
  validation; define the outcome, geography, period, and linkage method.
- Confirm environmental data sources, units, completeness, and provenance for each indicator.
- Agree and freeze scoring reference periods and methods before enabling scores.
- Keep exposure summaries separate from disease probability and clinical advice.

For the underlying file and its relationship to the separate data pipeline, see
[Datasets](/docs/data/datasets) and [System Architecture](/docs/architecture/system-architecture).
