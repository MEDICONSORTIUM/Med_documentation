---
id: use-cases
title: Use Case Diagrams & Descriptions
sidebar_label: Use Cases
description: As-built use cases for the EOHA platform — what the system actually supports today, with the original ML/alert/auth use cases marked as not implemented.
---

# Use Cases

:::caution As-built, not the original plan
The original use case set described interactions across four actors (End User, Data Contributor,
Administrator, System) including ML forecast generation, automated alerting, and user/role
management. None of those actors or use cases have any corresponding code today — there is no
authentication, no user table, and no ML pipeline in any of the three repos. This page describes
only the use cases the system actually supports. The original use case set is preserved in the
downloadable `.docx` on the [overview page](/docs/design-specification/overview).
:::

---

## As-built use cases

Only two real actors exist in the running system: an unauthenticated **API caller** (anyone who can
reach `eoha_backend`'s endpoints) and the **automated monthly pipeline job**. There is no concept of
a logged-in user anywhere.

| Actor | Use cases |
|-------|-----------|
| **Pipeline (automated, GitHub Actions)** | Ingest EO data monthly → upsert `zone` and `malaria_observation` rows |
| **API caller (anyone, unauthenticated)** | `GET /api/zones`, `GET /api/zones/{id}`, `GET /api/zones/province/{name}`, `GET /api/zones/municipality/{name}`, `GET /api/malaria-observations` (and its four filtered variants) |
| **Dashboard visitor (anyone, unauthenticated)** | Browse the malaria risk map and NCD demo map in `eoha-prototype`; filter by risk level, municipality, ward, and month |

---

## Use case descriptions

### Ingest monthly environmental data

| Attribute | Detail |
|-----------|--------|
| **Trigger** | GitHub Actions cron fires (`0 0 1 * *`, monthly) or a maintainer runs `workflow_dispatch` manually |
| **Actor(s)** | `eo-datapipeline`'s `etl_pipeline.py`, running on a GitHub-hosted runner |
| **Pre-conditions** | `GCP_SA_JSON`, `BUCKET_NAME`, `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` secrets configured in the repo |
| **Flow** | 1. Authenticate with GEE + GCS via service account → 2. For each of 9 provinces, build a stacked environmental image and export it to GCS → 3. Poll each export task every 30s until `COMPLETED` → 4. Download the CSV, split into `zone`/`malaria_observation` DataFrames → 5. Upsert both into PostgreSQL (`ON CONFLICT DO UPDATE`) |
| **Post-condition** | Rows in `zone` and `malaria_observation` reflect the previous calendar month's environmental readings for all 9 provinces. Re-running for an already-processed month updates rows in place — never duplicates them. |
| **Failure mode** | Any task reaching a non-`COMPLETED` terminal state, or any database exception, logs an error and exits non-zero (`sys.exit(1)`) — the whole run aborts rather than partially succeeding silently. |

### Read zone data via the API

| Attribute | Detail |
|-----------|--------|
| **Trigger** | An HTTP `GET` request to any `/api/zones*` route |
| **Actor(s)** | Any HTTP client — no authentication is checked |
| **Pre-conditions** | None |
| **Flow** | 1. Request hits `ZoneController` → 2. Delegates to `ZoneService` → 3. `ZoneRepository` (Spring Data JPA) issues the matching query → 4. Result wrapped in `ApiResponse.success(...)` and returned as JSON |
| **Post-condition** | Read-only — no database state changes. A missing single-zone lookup returns HTTP 404 (`RuntimeException` → `GlobalExceptionHandler`); a filtered list with no matches returns HTTP 200 with an empty array. |

### Read malaria observation data via the API

| Attribute | Detail |
|-----------|--------|
| **Trigger** | An HTTP `GET` request to any `/api/malaria-observations*` route |
| **Actor(s)** | Any HTTP client — no authentication is checked |
| **Pre-conditions** | Date path parameters must be ISO-8601 (`yyyy-MM-dd`) or the request returns HTTP 400 |
| **Flow** | Same pattern as zone reads: Controller → Service → Repository → `ApiResponse` envelope |
| **Post-condition** | Read-only. As with zones, missing-by-ID returns 404; empty filtered lists return 200 with `[]`. |

### View the malaria risk map

| Attribute | Detail |
|-----------|--------|
| **Trigger** | A visitor opens `pages/malaria-page.html` |
| **Actor(s)** | Any site visitor — no login |
| **Pre-conditions** | None |
| **Flow** | 1. Page loads → 2. PapaParse streams `data/Limpopo_Risk_Jan25_Jan26_Safe.csv` client-side → 3. Each row is scored by `calculateDynamicRisk()` (a fixed rule-based formula) → 4. Leaflet renders a coloured marker + heatmap point per ward for the selected month → 5. Visitor can filter by risk level, drill into a municipality/ward, and move the time slider |
| **Post-condition** | Read-only, entirely client-side. Nothing is sent to any server beyond the initial CSV/tile/library downloads. |

---

## Not implemented

The following use cases from the original plan have no corresponding code anywhere in the three
repos and are not currently achievable on the platform:

- Create/read `Malaria_Risk_Forecast` or `NCD_Risk_Forecast` (no ML pipeline exists)
- Create `User_Risk_Alert` / update alert status (no alerting code, no user table)
- Create/read/update `User` or `Role` (no authentication anywhere)
- Create/read `NCD_Observation` or `Ground_Observation` (no NCD data pipeline, no clinical case
  ingestion)
- Update `Zone` boundaries via the API (`eoha_backend` exposes `GET` endpoints only — no `POST`,
  `PUT`, `PATCH`, or `DELETE` mappings exist on either controller)
