---
slug: milestone-1-progress
title: "Milestone 1 update: system design and our first 7,000 ward records"
authors: [msesenyane]
tags: [milestone, earth-observation, limpopo, data]
date: 2025-12-10
---

We're now six weeks into Milestone 1 of the MED Consortium project, and we have something concrete to show: **7,384 ward-level records** covering Limpopo Province from January 2025 to January 2026, extracted entirely from Google Earth Engine.

<!-- truncate -->

## What we built

The core of Milestone 1 is proving that a satellite-to-dashboard pipeline actually works — not in theory, but with real data, real boundaries, and real health-relevant indices. Here's what we have:

- Monthly snapshots for every ward in Limpopo's 9 municipalities
- 13 variables per ward per month: surface temperature, soil moisture, NDWI, NDVI, agricultural coverage, population density, and habitat class
- A live Leaflet dashboard that lets you drill down from province → municipality → ward and see a composite malaria risk score

The risk engine is straightforward but grounded in the epidemiology: *Anopheles* mosquitoes need moisture, warm temperatures (25–30°C), and standing water. If a ward has all three, it gets flagged high. If the soil is dry, it stays green.

## The GEE extraction process

The honest version: the first extraction attempt produced a dataset with mismatched column names, coordinate precision issues, and a few municipalities where the ward centroids fell slightly outside the boundary polygons. We fixed all of that before the data hit the dashboard.

The key decisions we made:

1. **Monthly median composites** — single dates are too noisy in Limpopo's rainy season. Medians of all cloud-free scenes per month are much more stable.
2. **ADM3-level aggregation** — we're using GADM ward polygons as the unit of analysis. This keeps the data at a resolution that's meaningful for district health offices.
3. **Safe CSV export** — we named the file `_Safe` for a reason. We removed any columns that could indirectly identify individuals when combined with external data.

## What the data shows

Even at this early stage, some patterns are clear. January and February 2025 show markedly higher soil moisture across Greater Giyani and Thulamela wards — which matches the historical malaria burden in those areas. Surface temperatures peak in October–November 2025, right on schedule.

We're not making causal claims yet. The validation work happens in Milestone 3. But the EO signals are picking up the right seasonal patterns, which is encouraging.

## What's next

Before Milestone 1 closes in March 2026, we need to:

- Finalise the architecture documents (Annexure A and B) for submission to TuksNovation
- Complete a wireframe review session with the NICD team
- Begin scoping the live GEE → API pipeline for Milestone 2

The NCD module is also taking shape — the Southern Africa choropleth is working and the province drill-down for South Africa is functional. Expanding to real ward-level NCD data is a Milestone 2 task.

If you're working with EO data for health applications in Southern Africa and want to compare notes, [open an issue on GitHub](https://github.com/mediconsortium/Med_documentation) or reach out directly.