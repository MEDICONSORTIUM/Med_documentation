---
slug: ncd-module-southern-africa
title: "Mapping NCD risk across Southern Africa with satellite data"
authors: [simamnkele]
tags: [ncd, air-quality, southern-africa, leaflet]
date: 2026-01-15
---

Non-communicable diseases kill more people in Southern Africa than any infectious disease. Here's how we're using EO data to map the environmental risk factors that drive them.

<!-- truncate -->

Malaria gets the satellite imagery attention. But cardiovascular disease, diabetes, and chronic respiratory conditions kill far more people annually across Southern Africa — and their environmental drivers (air quality, heat stress, urban sprawl, lack of green space) are all measurable from orbit.

## What we're tracking

The NCD risk module currently maps four countries: South Africa, Botswana, Zimbabwe, and Lesotho. The variables we pull from GEE are:

**Air quality** — We use Sentinel-5P TROPOMI's tropospheric NO₂ column as a proxy for ambient air pollution. In the Gauteng region and Bulawayo corridor, concentrations are consistently elevated compared to rural areas.

**Urban heat stress** — Land surface temperature deviation from the seasonal baseline. Cities absorb and retain heat; high chronic heat exposure correlates with hypertensive and cardiovascular outcomes.

**Green space access** — Sentinel-2 NDVI as a proxy for access to parks and vegetated areas. Low NDVI in high-density urban areas signals limited green space — a risk factor for sedentary lifestyle and mental health outcomes.

**Built-up density** — ESA WorldCover Class 50 (built-up) as a proportion of the ward area. This directly maps urban sprawl and the shift toward car-dependent, sedentary lifestyles.

## The challenge: scale

Malaria risk is meaningful at ward level. For NCDs, the relevant unit of analysis shifts depending on what you're measuring. Air quality needs a city-region level because pollution disperses. Healthcare access is highly local — a single clinic can serve a community of 10,000 within 5 km but nothing beyond. Obesity prevalence comes from surveys, not satellites.

Our current prototype solves this by working at the country → province → municipality hierarchy, with the understanding that finer-grained NCD data will be layered in as Milestone 2 progresses.

## What the prototype shows

The four-country choropleth already reveals some expected patterns. Zimbabwe's composite NCD risk score (63%) is driven largely by air quality issues in Harare and Bulawayo combined with limited formal healthcare infrastructure. South Africa's 58% reflects high urban density and lifestyle risk in metros offset by relatively stronger healthcare access. Lesotho and Botswana both sit in the moderate range.

These are rough starting values for the prototype. They'll be replaced by computed, ward-level scores in Milestone 2.

## The interactive map

The NCD dashboard lets you click into South Africa, select a province, and zoom to municipality level. The current data shown in the environmental panel (population density, AQI, healthcare access, obesity prevalence) is illustrative — static values while we wait for the full GEE extraction pipeline to be wired up.

But the infrastructure is working: the GADM ADM1 and ADM3 GeoJSON files are loading, the Leaflet layers are toggling correctly, and the dropdown sync is functioning.

## What's coming in Milestone 2

- Live GEE-computed NCD scores at ward level for all four countries
- Sentinel-5P TROPOMI NO₂ layer visualised directly on the map
- Time slider for NCD trend analysis (2023–2026)
- Validation layer showing SADHS survey-derived prevalence data alongside the EO-derived risk scores

The goal is a tool that a provincial health department can actually use to prioritise where to deploy NCD screening programmes — not just another nice map.