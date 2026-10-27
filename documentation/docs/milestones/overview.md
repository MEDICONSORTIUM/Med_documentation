---
id: overview
title: Milestones Overview
sidebar_label: Overview
description: Current milestone status for the MED Consortium EOHA platform.
---

# Milestones Overview

The project is now in **Milestone 3 (Prototype Validation & Testing)**. Milestone 2's planned
development period has ended. Its codebase review found that several forecast and integration
targets remain unimplemented, so M3 records those as open work rather than treating the M2 plan as
delivered functionality.

## Status summary

| # | Title | Period | Budget | Status |
|---|-------|--------|--------|--------|
| M0 | Compliance & onboarding | Oct 2025 | — | ✅ Complete |
| M1 | System design & data architecture | Nov 2025 – Mar 2026 | R 250,000 | ✅ Complete |
| M2 | Prototype development (PoC) | Mar – Aug 2026 | R 500,000 | ✅ Period complete; open targets carried forward |
| **M3** | **Prototype validation & testing** | **Aug – Nov 2026** | **R 250,000** | 🔵 **Active** |

## M0 — Compliance & Onboarding

**Period:** October 2025 | **Status:** Complete

Partner alignment and onboarding were recorded in the project plan. See [partners and roles](/docs/project/partners).

## M1 — System Design & Data Architecture

**Period:** November 2025 – March 2026 | **Status:** Complete

M1 produced the architecture, observation and user-management ERDs, use-case sets, domain model,
pipeline designs, wireframes, and Design Specification Document v2. These are design artefacts;
their inclusion does not establish that every designed service or data table exists in the running
prototype. See [M1 deliverables](/docs/milestones/milestone-1).

## M2 — Prototype Development

**Period:** March – August 2026 | **Status:** Period complete; unfinished targets remain open

The M2 implementation review found a monthly GEE ingestion job, but it did not find the planned
XGBoost forecasting pipeline, NCD atmospheric data pipeline, Cloud Run risk-scoring service, alert
engine, or multi-country ingestion. The public prototype is a separate dashboard that reads its
own bundled environmental-observation CSV. See the [M2 implementation review](/docs/milestones/milestone-2).

## M3 — Prototype Validation & Testing

**Period:** August – November 2026 | **Budget:** R 250,000 | **Status:** Active

M3 is focused on checking what is implemented, documenting limitations, and preparing a defensible
validation process. The [Milestone 3 plan](/docs/milestones/milestone-3) tracks evidence and open
dependencies.

### Current data and validation position

The current prototype data collection contains **environmental variables only**. Disease validation
data has **not been acquired**. The current dataset therefore cannot support epidemiological model
performance metrics or claims that the displayed environmental indicators predict disease outcomes.
Software and pipeline tests can verify implementation behaviour and data handling, but they are not
a substitute for outcome validation.

### M3 work areas

- Verify current dashboard behaviour, data handling, and pipeline contracts against the code that
  exists.
- Record defects, test results, data provenance, and known coverage gaps.
- Plan accessibility, performance, and geographic coverage checks where the applicable feature and
  data are available.
- Acquire an approved, governed health-outcome or survey dataset and define the outcome, geography,
  period, and linkage before attempting epidemiological validation.
- Run a model performance audit only after a forecast model and suitable validation outcomes are
  available; report Accuracy, Precision, Recall, and ROC/AUC only when they can be computed from
  appropriate held-out data.
- Keep predictive or clinical claims out of public-facing copy until the validation evidence has
  been reviewed and approved.

The planned SADHS comparison and model audit remain **blocked on outcome-data acquisition**. The
model-performance dashboard described in the supplementary specification is a proposed reporting
capability, not evidence that an audited model or validation dataset currently exists.
