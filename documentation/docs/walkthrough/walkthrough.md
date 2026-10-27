---
id: walkthrough
title: Platform Walkthrough
sidebar_label: Walkthrough
---

# Platform Walkthrough

This page summarizes the current `eoha-prototype` application from its HTML, JavaScript, styles,
data, and test files. It distinguishes the interactive prototype from the separate EO ingestion and
API components described in [System Architecture](/docs/architecture/system-architecture).

## Platform pages

The prototype is a static HTML, CSS, and vanilla JavaScript site. It has no application build step
or server-side processing. Leaflet provides maps; Chart.js renders the malaria forecasting chart;
PapaParse reads CSV data in the browser.

| Page | Current behaviour |
|---|---|
| Landing page (`index.html`) | EOHA overview and links to the platform modules |
| Malaria dashboard (`pages/malaria-page.html`) | Leaflet map, ward markers and heatmap, client-side rule-based score, region controls, and monthly timeline |
| Malaria forecasting (`pages/malaria-forecasting.html`) | Chart and summary cards populated with illustrative seeded/demo values; no trained model or forecast service is connected |
| Malaria reports (`pages/malaria-reports.html`) | Filters, sorts, and paginates rows from the bundled CSV; exports matching records as CSV |
| Resource center (`pages/resource-center.html`) | Static links to selected malaria research, data, methods, and tools |
| NCD exposure (`pages/ncd-page.html`) | Country/province boundaries and monthly South African ward observations from the shared CSV; no NCD score is calculated |
| NCD resource center (`pages/ncd-resource-center.html`) | Links to the NCD scoring draft, schema, synthetic example, boundary file, and dashboard |
| Contact page (`pages/contact-page.html`) | Static contact information and map |

All pages include system, light, and dark theme controls. The selected preference is shared through
browser storage; the page styles also account for reduced-motion preferences and keyboard focus.

## Data behind the dashboards

The malaria, reports, and NCD pages read `data/Limpopo_Risk_Jan25_Jan26_Safe.csv`, a monthly CSV
bundled in the prototype repository. Its filename is misleading: it covers all nine South African
provinces. The malaria dashboard calculates its heuristic score in browser JavaScript. The NCD page
uses the CSV for measurement summaries and ward marker locations, while keeping its score fields
disabled. See [Datasets](/docs/data/datasets) for the file details.

The browser dashboard does not read data directly from `eo-datapipeline` or `eoha_backend`. The
separate ingestion job writes to PostgreSQL, and the backend exposes read-only endpoints; no live
connection from the dashboard is present in the prototype source.

:::caution No disease validation data acquired
The prototype data includes environmental variables and population density, but not observed
malaria cases, NCD outcomes, or health-survey labels. **Validation data has not been acquired.** The
malaria score is an environmental proxy that has not been validated against disease incidence. NCD
environmental scoring remains disabled. Neither module should be described as a validated disease
prediction system.
:::

## Testing present in the prototype

The current repository includes `tests/theme-browser.cjs`, `tests/test_ncd_data.cjs`, and
`tests/test_ncd_schema.py`. These cover selected browser interactions, NCD data helper behaviour,
and schema constraints. They are not evidence of epidemiological validation or a live integration
with the separate backend and ingestion job. See [Dashboard Tests](/docs/testing/dashboard-tests)
for commands and scope. Pipeline checks are summarized in [Pipeline Tests](/docs/testing/pipeline-tests).
