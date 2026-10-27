---
id: partners
title: Partners & Institutions
sidebar_label: Partners
---

# Partners & Institutions

The MED Consortium platform is developed and validated in collaboration with the following institutions.

---

## Funder & Incubator

| Institution | Role |
|-------------|------|
| **TuksNovation** | University of Pretoria innovation hub — project incubator and technical oversight |
| **NeoFrontiers** | Co-funder and commercialisation partner |

---

## Validation partners

| Institution | Acronym | Role |
|-------------|---------|------|
| University of Cape Town | **UCT** | Environmental health modelling validation; epidemiological accuracy review |
| Council for Scientific and Industrial Research | **CSIR** | Geospatial and EO data validation; spatial analysis methodology |
| National Institute for Communicable Diseases | **NICD** | Epidemiological data provision; malaria risk score validation |

---

## Government & data partners

| Institution | Acronym | Data contribution |
|-------------|---------|------------------|
| Department of Health | **DoH** | Disease registry; public health facility data |
| Department of Water and Sanitation | **DWS** | Water body status; water quality indices |
| South African Weather Service | **SAWS** | Meteorological data; air temperature; rainfall |

---

## Technology partners

:::caution Data-source row corrected against `eo-datapipeline` source
The live pipeline uses MODIS and ERA5-Land only — see
[Data → Google Earth Engine](/docs/data/google-earth-engine) for the verified, as-built collection
list. No Sentinel, Landsat, or SMAP data is queried by any script in any of the three repos today.
:::

| Platform | Role |
|----------|------|
| **Google Earth Engine** | Cloud-based EO processing and data extraction — as-built, uses MODIS (`MOD11A1`, `MOD13Q1`, `MOD09GA`) and ERA5-Land, not Sentinel/Landsat/SMAP |
| **AWS Amplify** | Platform hosting (deploy hookup not visible in-repo — see [System Architecture](/docs/architecture/system-architecture)) |
| **OpenStreetMap / CartoDB** | Base map tiles (Leaflet) |
| **WorldPop, ESA WorldCover** | Population density and land-cover data, via GEE |
| **geoBoundaries** | `South_Africa_ADM1.geojson`'s actual schema (province level only — no ADM3/municipality file exists) |

---

## Project director

| | |
|--|--|
| **Director** | Kagisho Montjane |
| **Organisation** | MED Consortium |
| **Project** | Use of Earth Observation data to monitor water-borne pathogens and NCD risk factors |