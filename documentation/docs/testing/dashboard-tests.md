---
id: dashboard-tests
title: Prototype Dashboard Tests
sidebar_label: Dashboard Tests
---

# Prototype Dashboard Tests

The current `eoha-prototype` repository contains lightweight checks for the static frontend, NCD
data helpers, and the proposed NCD record schema. It does not contain the previously documented
Playwright spec suite or a Node package manifest. The files below are the tests present in the
prototype repository; their presence does not imply that a recent run passed.

## Tests present

| File | What it covers | Run command (from `eoha-prototype`) |
|---|---|---|
| `tests/theme-browser.cjs` | Browser checks across the site routes, themes, viewport sizes, dashboard controls, and report interactions | `node tests/theme-browser.cjs` |
| `tests/test_ncd_data.cjs` | Missing and non-finite measurement handling, filtering, valid-value denominators, and empty selections | `node --test tests/test_ncd_data.cjs` |
| `tests/test_ncd_schema.py` | NCD schema/example validity, disabled scoring, measurement bounds, eligibility, forecast provenance, and population provenance | `python -m unittest discover -s tests -p 'test_ncd_schema.py'` |

The browser script uses Playwright and expects a locally served prototype. The README documents the
optional `EOHA_URL`, `BROWSER_EXECUTABLE`, and `EOHA_SCREENSHOTS` environment variables. There is no
`npm test` command in the prototype repository.

## What these tests do not establish

- A passing schema test does not validate the proposed NCD scoring method or the environmental
  inputs against disease outcomes.
- The malaria score remains a heuristic implemented in client-side JavaScript; the listed tests do
  not establish its epidemiological accuracy.
- **Validation data has not been acquired.** The available prototype observations are environmental
  measurements and population context, not observed disease cases or health outcomes.
- These frontend checks do not test a live integration with `eoha_backend` or the EO ingestion job;
  the dashboard reads its bundled CSV.

For the separate pipeline tests, see [Pipeline Tests](/docs/testing/pipeline-tests). For the data
limits, see [Datasets](/docs/data/datasets) and the [NCD Exposure Module](/docs/modules/ncd).
