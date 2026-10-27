---
id: data-architecture
title: Data Architecture & ERDs
sidebar_label: Data Architecture
description: As-built entity relationship diagram for the EOHA platform — only Zone and Malaria_Observation exist in the database today.
---

# Data Architecture & Entity Relationship Diagrams

:::caution As-built, not the original plan
The original Milestone 1 data architecture defined six entities across two ERDs — an "Observation
Prediction" model (`Zone`, `Malaria_Observation`, `NCD_Observation`, `Ground_Observation`,
`Malaria_Risk_Forecast`, `NCD_Risk_Forecast`) and a "User Management" model (`User`, `Role`,
`User_Risk_Alert`). **Only two of those six entities exist in the database today**, verified against
both `eo-datapipeline`'s upsert logic and `eoha_backend`'s JPA entities. The other four, and the
entire User Management model, have no table, no code, and no migration anywhere in any of the three
repos. This page describes only what's real; the original six-entity ERD is preserved in the
downloadable planning PDF on the [overview page](/docs/design-specification/overview).
:::

---

## As-built entity relationship diagram

```text
┌──────────────────────────────────┐         ┌───────────────────────────────────────┐
│  zone                             │         │  malaria_observation                    │
│──────────────────────────────────│  1    ∞  │─────────────────────────────────────────│
│  zone_id            PK (Integer)  │─────────▶│  env_record_id       PK (Integer, auto)  │
│  parent_zone_id         Integer   │          │  zone_id             FK → zone.zone_id   │
│  zone_name               String   │          │  date_recorded              LocalDate    │
│  boundary_polygon        String   │          │  lst_surface_temp_c            Float     │
│  base_population        Integer   │          │  soil_moisture_pct             Float     │
│  dominant_habitat_code   String   │          │  ndvi_vegetation_index         Float     │
│  external_zone_id        String   │          │  ndwi_water_index              Float     │
│  zone_type                String  │          │  air_temp_c                    Float     │
│  latitude                  Float  │          │  agric_percentage              Float     │
│  longitude                 Float  │          └───────────────────────────────────────┘
│  population_density_per_km2 Float │
│  municipality_name        String  │
│  province_name             String │
└──────────────────────────────────┘
```

Source: [`eoha_backend/src/main/java/.../model/Zone.java`](https://github.com/MEDICONSORTIUM/eoha_backend/blob/main/src/main/java/com/eoha/eoha_backend/model/Zone.java) and
[`MalariaObservation.java`](https://github.com/MEDICONSORTIUM/eoha_backend/blob/main/src/main/java/com/eoha/eoha_backend/model/MalariaObservation.java),
cross-checked against `eo-datapipeline`'s upsert column lists — every column the pipeline writes
matches the entity exactly.

### Entity summary

| Entity | PK | Written by | Read by |
|--------|----|-----------|---------|
| `zone` | `zone_id` | `eo-datapipeline` (`upsert_zone_rows`) | `eoha_backend` (`GET /api/zones/*`) |
| `malaria_observation` | `env_record_id` (auto), unique on `(zone_id, date_recorded)` | `eo-datapipeline` (`upsert_observation_rows`) | `eoha_backend` (`GET /api/malaria-observations/*`) |

`parent_zone_id` and `boundary_polygon` exist as columns on `zone` but are never populated by
`eo-datapipeline` — no code anywhere sets them. The relationship between the two tables is a plain
`zone_id` integer column; there is no JPA `@ManyToOne`/`@OneToMany` association, and no ORM-level
cascade behaviour.

### Not implemented

None of the following have a table, a migration, or a single line of persistence code in any of the
three repos:

| Entity from the original plan | Status |
|---|---|
| `NCD_Observation` | ❌ No table, no pipeline. `eo-datapipeline` extracts only malaria-relevant environmental variables (LST, NDVI, NDWI, soil moisture, agric %) — no NO2/SO2/aerosol/UV extraction exists anywhere. The NCD dashboard page in `eoha-prototype` shows hardcoded numbers, not queried data. |
| `Ground_Observation` | ❌ No table, no ingestion path for clinical case counts |
| `Malaria_Risk_Forecast` | ❌ No table, no ML pipeline, no XGBoost code anywhere |
| `NCD_Risk_Forecast` | ❌ No table, no ML pipeline |
| `User` | ❌ No table, no authentication code anywhere |
| `Role` | ❌ No table |
| `User_Risk_Alert` | ❌ No table, no alerting code, no email/SMS dispatch anywhere |

---

## Reconciling `zone_id` types across the pipeline

Both repos treat `zone_id` as an `Integer`. `eo-datapipeline` derives it via
`pd.to_numeric(df['WardID'], errors='coerce')`, drops rows where it's non-numeric, and casts to
`int` before upsert — so any ward whose source `WardID` isn't purely numeric is silently excluded
from both tables.

## Unverified assumption

`eo-datapipeline`'s `malaria_observation` upsert relies on `ON CONFLICT (zone_id, date_recorded)`,
which requires a unique constraint on that column pair in the live schema. Neither repo contains a
migration or DDL file defining it (`eoha_backend` runs with
`spring.jpa.hibernate.ddl-auto=none`) — the constraint must exist directly on the RDS instance,
outside version control, and could not be verified from source alone.
