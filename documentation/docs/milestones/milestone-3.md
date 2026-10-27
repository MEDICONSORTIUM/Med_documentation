---
id: milestone-3
title: Milestone 3 — Prototype Validation & Testing
sidebar_label: Milestone 3 (Active)
description: EOHA Milestone 3 validation and testing plan, with current data and evidence gaps.
---

# Milestone 3 — Prototype Validation & Testing

**Period:** August – November 2026 &nbsp;|&nbsp; **Budget:** R 250,000 &nbsp;|&nbsp; **Status:** 🔵 Active

## Objective

Assess the EOHA prototype as it exists, make its evidence and limitations clear, and establish the
conditions needed for epidemiological validation. M3 does not imply that the design-specification
features or M2 targets have been implemented.

## Data acquisition and validation status

The prototype currently collects environmental variables only. **Disease validation data has not
been acquired.** No linked malaria case counts, NCD outcomes, or survey-derived prevalence labels
are available in the prototype dataset. The current environmental measurements cannot be used on
their own to calculate disease-model Accuracy, Precision, Recall, ROC/AUC, or calibration.

The malaria page currently computes a deterministic environmental suitability score in the browser;
the NCD page presents environmental observations and does not calculate an NCD risk score. Neither
page demonstrates validated disease prediction. See [Malaria](/docs/modules/malaria), [NCD
Exposure](/docs/modules/ncd), and [Datasets](/docs/data/datasets).

## Work plan

### 1. Verify implemented behaviour

- Review available dashboard and ingestion tests against the current source code.
- Check that user-visible values, data transformations, geographic selections, and error states
  behave as documented.
- Distinguish mocked/unit checks from live-source acceptance tests and end-to-end integration.
- Record results, test date, code revision, environment, and any open defects.

The documented test suites cover implementation behaviour and data contracts. A passing software
test does not validate disease outcomes. See [Test Plan Overview](/docs/testing/overview).

### 2. Verify data quality and provenance

- Record source, time period, geography, units, missingness, and transformation for each collected
  environmental variable.
- Check schema consistency, invalid values, spatial coverage, and temporal coverage.
- Keep validation status explicit in data and dashboard documentation.

### 3. Acquire validation data before model audit

Before comparing predictions with observed outcomes, obtain appropriate data under required access,
privacy, and governance approvals. Define the outcome, population, geography, time period, linkage
method, and train/test separation. Record acquisition and quality checks before using the dataset.

Until this dependency is met, the proposed SADHS validation and epidemiological performance audit
remain **not started / blocked on data acquisition**. Do not publish performance scores, ROC curves,
or claims of validated disease risk without suitable held-out outcome data.

### 4. Audit model performance when eligible

If a forecast model and eligible validation dataset become available, pre-specify the evaluation
method and report appropriate metrics (including Accuracy, Precision, Recall, ROC/AUC, and
calibration where suitable), uncertainty, subgroup/geographic coverage, and limitations. The
supplementary specification's Model Performance Audit dashboard is a proposed feature; its
description is not evidence of a functioning audit or model.

### 5. Track remaining prototype and non-functional gaps

Track accessibility, performance, geographic coverage, NCD data integration, server-side scoring,
forecasting, and alerts against implementation evidence. Features that remain design targets should
stay labelled as planned or unimplemented.

The live homepage currently states that the platform uses a Random Forest model with 91% accuracy
and offers 90-day forecasts. The reviewed prototype code does not substantiate a trained forecast
model, those performance results, or a 90-day model forecast. Treat these as public-copy items to
verify and correct unless reproducible model and validation evidence is supplied.

## Current M3 status

| Area | Current status |
|------|----------------|
| Environmental data collection | Available in the prototype; environmental variables only |
| Disease validation dataset | Not acquired |
| Dashboard and data-contract tests | Documented at component/repository level; not epidemiological validation |
| Malaria disease-model audit | Blocked on outcome data; current dashboard uses a heuristic environmental score |
| NCD disease-model audit | Not applicable to current page; NCD risk scoring is disabled |
| Proposed performance audit dashboard | Design/specification only; no audited metrics to populate it |
| Public platform | [www.eoha.co.za](https://www.eoha.co.za/) |

## Related pages

- [Milestones Overview](/docs/milestones/overview)
- [Milestone 2 implementation review](/docs/milestones/milestone-2)
- [Test Plan Overview](/docs/testing/overview)
- [Current prototype walkthrough](/docs/walkthrough/walkthrough)
