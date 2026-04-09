---
id: overview
title: Milestones Overview
sidebar_label: Overview
description: Project milestones for the MED Consortium EOHA platform — Nov 2025 to Nov 2026.
---

# Milestones Overview

The MED Consortium project runs from **November 2025 to October 2026** with a total budget of **R 1,000,000** across four milestones.

---

## Status summary

| # | Title | Period | Budget | Status |
|---|-------|--------|--------|--------|
| M0 | Compliance & onboarding | Oct 2025 | — | ✅ Complete |
| M1 | System design & data architecture | Nov 2025 – Mar 2026 | R 250,000 | ✅ Complete |
| **M2** | **Prototype development (PoC)** | **Mar – Aug 2026** | **R 500,000** | 🔵 **Active** |
| M3 | Prototype validation & testing | Aug – Nov 2026 | R 250,000 | ⏳ Upcoming |

---

## M0 — Compliance & Onboarding
**Period:** October 2025 | **Status:** ✅ Complete

Partner alignment completed. TuksNovation, NEOFrontiers EISF, SANSA, and NRF onboarded. Legal and IP agreements signed.

---

## M1 — System Design & Data Architecture
**Period:** November 2025 – March 2026 | **Status:** ✅ Complete

Full system design delivered:
- Cloud-network architecture (OpenShift/Kubernetes topology)
- Two ERDs: Observation Prediction and User Management
- Use case sets: Observation Prediction and User Management
- Detailed use case descriptions (Create Malaria_Observation, Create Malaria_Risk_Forecast, Update Alert Status, etc.)
- Domain model class diagrams
- ETL pipeline architecture for both Malaria and NCD data streams
- Wireframes for Home, Malaria, and NCD pages
- Design Specification Document v2

📄 [View M1 deliverables →](/Med_documentation/docs/milestones/milestone-1)

---

## M2 — Prototype Development (PoC)
**Period:** March – August 2026 | **Budget:** R 500,000 | **Status:** 🔵 Active

The prototype phase builds the live, running system against the M1 design specification.

### M2 targets

- **Automated GEE pipeline** — Python Cloud Function ingesting Sentinel-2 and MODIS imagery every 8 days, computing zonal statistics per ward, writing to the Ward Risk store
- **Server-side risk scoring** — `calculateDynamicRisk()` moves from browser to Cloud Run; enables real-time multi-municipality scoring
- **XGBoost ML forecasting** — First live Malaria Risk Forecast pipeline producing `outbreak_probability_score` per zone
- **NCD live data** — Copernicus/Sentinel atmospheric pipeline (NO2, SO2, aerosol, UV) replacing static baseline
- **Alert engine integration** — `User_Risk_Alert` auto-created when `outbreak_probability_score > 0.80`
- **Multi-country expansion** — SADHS ward geometries for Zimbabwe, Mozambique, and Zambia ingested

📄 [View M2 page →](/Med_documentation/docs/milestones/milestone-2)

---

## M3 — Prototype Validation & Testing
**Period:** August – November 2026 | **Budget:** R 250,000 | **Status:** ⏳ Upcoming

- Validation against SADHS survey-derived prevalence data
- Model performance audit (Accuracy, Precision, Recall, ROC curves)
- Business rules compliance testing (BR-01 through BR-04)
- Domain rules verification (DR-01 through DR-04)
- Final platform launch
