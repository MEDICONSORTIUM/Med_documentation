---
id: testing-overview
title: Test Plan Overview
sidebar_label: Overview
---

# Test Plan Overview

This page summarizes the automated checks documented across the EOHA repositories. The frontend,
ingestion pipeline, and backend tests are separate; a passing suite in one repository does not
validate the complete platform end to end.

## Coverage at a glance

| Component | Tests documented | Coverage |
|---|---|---|
| `eoha-prototype` | `tests/theme-browser.cjs`, `tests/test_ncd_data.cjs`, `tests/test_ncd_schema.py` | Browser behaviour, NCD data helpers, and NCD schema constraints; see [Dashboard Tests](/docs/testing/dashboard-tests) |
| `eo-datapipeline` | 98 pytest tests, as documented by the pipeline suite | Transform, database, and mocked integration behaviour; see [Pipeline Tests](/docs/testing/pipeline-tests) |
| `eoha_backend` | Backend suite documented in that repository | Separate API checks; not a dashboard-to-backend integration suite |

These are repository-level checks, not evidence that the entire data flow is connected. The
prototype dashboard reads a bundled CSV, while the EO pipeline writes to its database and the API
has no documented dashboard caller.

## Validation status

The prototype currently collects environmental variables only; **disease validation data has not
been acquired**. There are no linked observed malaria case counts or NCD health outcomes in the
prototype dataset. The malaria score is therefore an unvalidated rule-based environmental proxy.
NCD exposure scoring is disabled. Passing software tests checks implementation behaviour and data
contracts; it does not establish epidemiological validity.

## Running prototype checks

From the `eoha-prototype` directory:

```bash
node tests/theme-browser.cjs
node --test tests/test_ncd_data.cjs
python -m unittest discover -s tests -p 'test_ncd_schema.py'
```

The browser script requires the prototype to be served locally and Playwright to be available. See
[Dashboard Tests](/docs/testing/dashboard-tests) for details. Pipeline test commands are in
[Pipeline Tests](/docs/testing/pipeline-tests).
