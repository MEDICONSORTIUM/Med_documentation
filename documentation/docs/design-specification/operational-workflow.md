---
id: operational-workflow
title: Operational Workflow
sidebar_label: Operational Workflow
description: As-built EOHA operational workflow — the real monthly ingestion job, verified against eo-datapipeline source, replacing the original Kubernetes/HPC/stakeholder-routing plan.
---

# Operational Workflow

:::caution As-built, not the original plan
The original workflow described a Kubernetes CronJob firing two parallel disease-profiling tracks
(NCD and Malaria), scaled on CSIR high-performance compute, routed to stakeholders (Ministries of
Health, commercial/academic partners) via a decision point, and exported through a commercial API
integration layer. **None of that exists.** The real workflow is a single GitHub Actions job that
ingests malaria-relevant environmental data only — there is no NCD track, no HPC infrastructure, no
stakeholder-routing logic, and no export/delivery step beyond the (currently unconsumed)
`eoha_backend` REST API.
:::

---

## As-built workflow

```text
GitHub Actions cron ('0 0 1 * *', monthly) or manual workflow_dispatch
        ↓
Authenticate with GCP service account (GEE + GCS scopes)
        ↓
Resolve processing month = previous calendar month
        ↓
Load shared assets: ward boundaries, WorldPop population, ESA WorldCover
        ↓
For each of 9 South African provinces (sequential loop):
    Build stacked environmental image (LST, NDVI, NDWI, ERA5 temp + soil moisture)
        ↓
    Submit GEE batch export task → Google Cloud Storage
        ↓
Poll all 9 tasks until COMPLETED (30s interval) — any failure aborts the run
        ↓
For each completed province:
    Download CSV from GCS → transform to zone + malaria_observation DataFrames
        ↓
    Upsert into PostgreSQL (idempotent — ON CONFLICT DO UPDATE)
        ↓
Job exits. eoha_backend can now serve the updated data via its read-only REST API
(no automated consumer currently calls it).
```

Separately, and with no code-level connection to the above: `eoha-prototype` is a static site that
reads a CSV bundled directly in its own repository. Nothing in this workflow updates that file.

---

## What actually triggers a run

There is exactly one trigger mechanism, defined in
[`.github/workflows/run_pipeline.yml`](https://github.com/MEDICONSORTIUM/eo-datapipeline/blob/main/.github/workflows/run_pipeline.yml):

```yaml
on:
  schedule:
    - cron: '0 0 1 * *'
  workflow_dispatch:
```

Not present: a Kubernetes `CronJob` resource, a "GEE Sync" service distinct from the pipeline itself,
and any parallel NCD track — the single script processes only the environmental indicators used by
the malaria risk formula.

---

## Business and domain rules — as they actually apply

The original plan's business/domain rules (BR-01 through BR-04, DR-01 through DR-04) presuppose
alerting and ML forecasting that don't exist. Restated against what's real:

| Rule | As-built status |
|------|-----------------|
| Minimum refresh cycle | The pipeline runs **monthly**, not on a 24-hour cycle — `cron: '0 0 1 * *'` is once per calendar month |
| Immutable audit log | Not implemented — the pipeline logs to stdout (captured in the GitHub Actions run log) but writes no persistent audit table |
| Automated Quality Test before ingest | Not implemented as a distinct gate — the only data-quality behaviour is `build_safe_band_image()`'s empty-collection guard and `pd.to_numeric(..., errors='coerce')` dropping malformed rows |
| Predictive disclaimer on outputs | Not applicable — there are no ML predictions to disclaim; the dashboard's risk score is a documented rule-based formula, not a model output |
| Raster/vector spatial-temporal alignment before PCA | Not applicable — no PCA or ML pipeline exists |

These rules remain relevant as targets for the ML/alerting work described in
[Milestone 2 →](/docs/milestones/milestone-2); they do not describe current system behaviour.
