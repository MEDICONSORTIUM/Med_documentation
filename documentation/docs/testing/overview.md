---
id: testing-overview
title: Test Plan Overview
sidebar_label: Overview
---

# Test Plan Overview

**Document version:** v1.0 · **Status:** Active — Milestone 2 (Prototype Development)  
**Authors:** Simamnkele Mlisana · Msesenyane Makhongela  
**Run date:** 23 April 2026 · **Report:** Playwright HTML report (attached)

---

At Milestone 2, the EOHA platform ships with **365 automated tests** across two independent technology stacks — a Playwright browser suite for the malaria risk dashboard, and a pytest suite for the EO data pipeline running behind it. Together they cover every component that is fully implemented and verified at this milestone.

## Test run summary — 23 April 2026

| Metric | Value |
|--------|-------|
| Total Playwright outcomes | **267** across 3 browsers |
| Playwright passing | **264** |
| Playwright failing | **3** (WebKit only — see below) |
| pytest passing | **98 / 98** |
| Total duration | ~504 s (Playwright) + ~0.82 s (pytest) |
| Playwright workers | 6 parallel |

## Playwright suite — spec file breakdown

| Spec file | Tests (per browser) | Chromium | Firefox | WebKit |
|-----------|-------------------|----------|---------|--------|
| `MalariaDashboard.spec.js` | 51 | ✅ 51 | ✅ 51 | ✅ 51 |
| `malaria-api.spec.js` | 21 | ✅ 21 | ✅ 21 | ✅ 21 |
| `malaria-visual.spec.js` | 14 | ✅ 14 | ✅ 14 | ⚠️ 11 / 3 fail |
| `example.spec.js` | 3 | ✅ 3 | ✅ 3 | ✅ 3 |
| **Total** | **89 × 3 browsers** | **89** | **89** | **86 / 3 fail** |

The 3 WebKit failures are all in `malaria-visual.spec.js` under the `Visual - High Risk Ward Selected` describe block. They are a browser-specific rendering difference, not logic bugs — the same 3 tests pass on both Chromium and Firefox. Full analysis is in [Dashboard Tests → Known WebKit Failures](/docs/testing/dashboard-tests#webkit-failures).

## pytest suite — breakdown

| Spec file | Tests | Status |
|-----------|------:|--------|
| `test_unit_gee.py` | 13 | ✅ 13/13 |
| `test_integration_transforms.py` | 27 | ✅ 27/27 |
| `test_integration_db.py` | 23 | ✅ 23/23 |
| `test_e2e_pipeline.py` | 35 | ✅ 35/35 |
| **Total** | **98** | **✅ All passing** |

## Running the suites

### Playwright

```bash
npm install
npx playwright install

# Run all three browsers
npx playwright test

# Chromium only
npx playwright test --project=chromium

# Visual regression only
npx playwright test malaria-visual

# Regenerate baselines after intentional UI changes
npx playwright test malaria-visual --update-snapshots

# View the HTML report
npx playwright show-report
```

### pytest

```bash
pip install pytest pytest-mock pandas psycopg2-binary

cd eoha_tests
pytest tests/ -v --tb=short

# Expected output
# ========================= 98 passed in 0.82s ==========================
```

## Test identifier scheme

| Prefix | Spec file | Framework |
|--------|-----------|-----------|
| `EOHA-DASH` | `MalariaDashboard.spec.js` | Playwright |
| `EOHA-API` | `malaria-api.spec.js` | Playwright |
| `EOHA-VIS` | `malaria-visual.spec.js` | Playwright |
| `EOHA-GEE` | `test_unit_gee.py` | pytest |
| `EOHA-TRF` | `test_integration_transforms.py` | pytest |
| `EOHA-DB` | `test_integration_db.py` | pytest |
| `EOHA-E2E` | `test_e2e_pipeline.py` | pytest |

## What is not yet covered

| Area | Planned module | Target milestone |
|------|----------------|-----------------|
| NCD Risk Dashboard | `EOHA-NCD-*` | M2 |
| XGBoost Forecasting pipeline | `EOHA-ML-*` | M2 |
| Cloud Run server-side scoring API | `EOHA-CLOUD-*` | M2 |
| User Risk Alert lifecycle | `EOHA-ALERT-*` | M2 |
| Containerised PostgreSQL integration | `EOHA-DB-*` extension | M2 |
| Live GEE acceptance tests | `EOHA-GEE-*` extension | M3 |
| Multi-country Zambia data flows | `EOHA-DASH-*` extension | M3 |
| Accessibility (WCAG) | axe-core | M3 |
| CI pipeline integration | GitHub Actions | M2 |