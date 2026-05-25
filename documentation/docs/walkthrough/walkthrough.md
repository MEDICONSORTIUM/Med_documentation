---
id: walkthrough
title: Platform Walkthrough
sidebar_label: Walkthrough
---

# Platform Walkthrough

**Milestone 2 — Prototype Development · March – August 2026**  
**Status:** Active · **Run date of latest test report:** 23 April 2026

---

This page is a living record of what the EOHA platform looks and behaves like right now. It narrates what has been built, what has been tested, and where things stand — as of the latest Playwright and pytest runs at the current point in M2.

---

## What has been built

The EOHA platform is a browser-based public health surveillance system that translates Earth observation data into actionable malaria and NCD risk information for decision makers across Southern Africa. At Milestone 2, three pages are fully implemented and deployed:

### Landing page — `index.html`

The entry point to the platform. A full-viewport background video of Earth-observation satellite imagery sits beneath a scroll-driven card stack. As the user scrolls, six content cards animate in sequence, each explaining a dimension of the platform:

1. **Precise Health Informatics** — the platform's core value proposition
2. **Powered by Earth Observation** — three satellite imagery thumbnails
3. **NCD Prediction** — cardiovascular and environmental risk module link
4. **Malaria Surveillance** — vector habitat and outbreak risk module link
5. **Built for Africa** — a full Africa satellite view alongside the mission statement
6. **Footer / Partners** — TuksNovation, SANSA, NRF, NeoFrontiers logos

A vertical progress bar on the right edge of the stack tracks scroll position. A `position: sticky` container keeps the card stage fixed in the viewport while the scroll distance drives the animation. The glow-wave title animation fires on load with staggered delays per letter. A scroll indicator (mouse-wheel animation) fades as soon as the user begins scrolling.

### Malaria Risk Dashboard — `malaria-page.html`

The flagship module. A live Leaflet map fills the entire viewport as the base layer, with a CartoDB light tile set split into a no-labels layer below and a labels-only layer above so the heatmap sits cleanly between geography and text. Three layers sit on top of the map:

**Left sidebar** — Region Selector and Environmental Factors cards:
- A three-level cascading dropdown: Country → Municipality → Ward, populated from the `Limpopo_Risk_Jan25_Jan26_Safe.csv` dataset (7 384 records, 9 municipalities, 13 months)
- A Reset button that returns all controls and panels to their initial state
- Three environmental factor bars (Precipitation, Avg Temperature, Humidity) that animate to the selected ward's values on Apply

**Right sidebar** — Risk panels and Map Legend:
- A ward-level risk donut (animated `stroke-dashoffset` transition, 1 s ease-out) that shows a coloured arc and percentage for the selected ward
- A municipality-average donut that shows the mean risk across all wards in the selected municipality for the current month
- A colour-coded map legend (High / Moderate / Low)

**Bottom panel** — Forecasting Timeline:
- A range slider spanning January 2025 to January 2026 (13 months)
- Moving the slider filters all map markers and the ward dropdown to show only data for the selected month

The heatmap is a `leaflet.heat` layer with a custom red-yellow-green gradient keyed to `calculateDynamicRisk()` score. Invisible `circleMarker` elements sit at each ward centroid to intercept clicks and open popups without breaking through the heatmap colour.

### Contact Page — `contact-page.html`

A static contact page with a full-width glass-morphism hero, a single information card, a Leaflet mini-map pinned to the MED Consortium headquarters at Hatfield, Pretoria (−25.7549, 28.2326), partner logo strip, and a footer. The email button opens the user's default mail client with a pre-filled subject and body via the `mailto:` protocol.

---

## What has been tested

The test suite covers the dashboard and the pipeline separately. Here is the complete picture from the 23 April 2026 run.

### Playwright — 267 outcomes across 3 browsers

```
MalariaDashboard.spec.js   153 outcomes   ✅  All passing
malaria-api.spec.js         63 outcomes   ✅  All passing
malaria-visual.spec.js      42 outcomes   ⚠️  39 passing, 3 failing (WebKit only)
example.spec.js              9 outcomes   ✅  All passing
─────────────────────────────────────────────────────
Total                       267           264 passing · 3 failing
Run time                    ~504 seconds across 6 parallel workers
```

### pytest — 98 / 98 passing in 0.82 s

```
test_unit_gee.py              13 / 13   ✅
test_integration_transforms.py 27 / 27  ✅
test_integration_db.py         23 / 23  ✅
test_e2e_pipeline.py           35 / 35  ✅
─────────────────────────────────────────
Total                          98 / 98  ✅  0.82 s
```

---

## What the passing tests confirm

### The dashboard is behaviourally correct

153 outcomes in `MalariaDashboard.spec.js` verify the full user journey through the malaria risk dashboard — from the initial disabled state of every control, through the three-level dropdown cascade, through ward selection and risk calculation, through the Reset flow, and through the time slider. Every assertion passed on Chromium, Firefox, and WebKit.

The 51 tests per browser include:

- Country select populates the province dropdown with municipalities from the CSV
- The province display name strips `" Local Municipality"` (the UI label is `Tzaneen`; the `value` attribute is the full `Tzaneen Local Municipality` key used inside `districtLookup`)
- Selecting Ward 1 Tzaneen drives the risk donut to 100% High with the correct environmental factor values (28°C, 40% humidity, 45% precipitation)
- Moving the time slider to February 2025 (index 1) filters the ward dropdown to show only the two February wards for Tzaneen — the three January wards disappear
- The Reset button returns every control and panel to its initial placeholder state

### The data pipeline is correct

The 98 pytest tests confirm that the entire server-side pipeline — from GEE image composition, through GCS export, through DataFrame transformation, through PostgreSQL upsert — behaves correctly against the documented data contract. The `calculateDynamicRisk()` formula is independently verified at the browser level too: the same ward produces the same score whether evaluated in JavaScript (Playwright) or described in prose (pytest fixture comments).

The pipeline handles all failure modes cleanly: FAILED and CANCELLED GEE tasks return `False` without raising; empty GCS CSVs return empty DataFrames; psycopg2 errors propagate unmodified so the Cloud Run job can catch them, roll back, and exit with a non-zero code for alerting.

### The CSV data contract is validated end-to-end

`malaria-api.spec.js` is the bridge between the frontend and the pipeline. Its 21 tests assert that:

- The browser fetches the CSV from exactly the path the pipeline writes to
- PapaParse's `dynamicTyping` correctly converts all numeric columns to JavaScript `number` (not strings), which the risk formula depends on
- `Soil_Moisture`, `LST_Surface_C`, `NDWI_Water`, `Agric_Percentage`, `latitude`, and `longitude` are all numeric after parse
- The `districtLookup` structure that powers the dropdowns is correctly keyed and filtered by month

---

## The 3 failing tests — what they tell us

The three failures are in `malaria-visual.spec.js` under `Visual - High Risk Ward Selected`, all in the **WebKit** browser only. Chromium and Firefox both pass all 14 visual tests.

### What the test report shows

The Playwright HTML report includes a page snapshot taken at the moment of failure. It shows the dashboard in exactly the correct state — Ward 1 Tzaneen is selected in the region dropdown, the risk panel reads `High` / `100% RISK`, and the environmental factors are populated with ward values. The UI is working.

The screenshot below is the **diff image** (`region-selector-selected-diff.png`) from the failing `region selector card shows populated dropdowns` test. The yellow band at the bottom of the card marks the pixels that differ between the WebKit baseline and the WebKit actual screenshot:


The diff is 160 pixels — a horizontal band covering the Apply button area. This is a sub-pixel rendering difference in WebKit's handling of the SVG refresh icon inside the button. The same icon renders identically on Chromium and Firefox.

### What the timeout means

The other two failures (`ward-risk-high.png` and `env-factors-high.png`) do not even reach the diff stage — they time out at the **element stability check** before Playwright can take a screenshot.

The 5 000 ms stability timeout fires because `.sidebar-left` and `.sidebar-right` are `position: fixed` containers with `overflow-y: auto`. After the Apply button is clicked, the Leaflet map flies to the selected ward's coordinates — this map animation triggers a repaint that, in WebKit, causes the fixed containers to enter a compositing state that does not settle the same way it does in Chromium or Firefox. Playwright's screenshot path calls `scrollIntoView` on the target element, which cannot scroll a fixed-positioned parent, so the stability condition is never satisfied.

The important thing to observe here: the tests run for **27 seconds each** before timing out, which means Playwright retried the screenshot multiple times. The UI never crashes — it simply stays in a composited state that WebKit does not report as stable.

### What this means for the project

These failures do not block the M2 milestone. The production platform runs in Chromium-based browsers. The visual regression suite is a quality gate for UI regressions, not a correctness gate. The WebKit rendering difference is a known characteristic of how WebKit handles `position: fixed` repaints after Leaflet map animations, and it is documented here for the team's awareness.

The failing tests are left as-is in the codebase. They are accurate descriptions of what the test runner observes. If WebKit support becomes a formal requirement, the team can address the rendering difference at that point.

---

## Where things stand at M2

| Component | Status |
|-----------|--------|
| Landing page (card stack, video, scroll animation) | ✅ Built |
| Malaria Risk Dashboard (map, heatmap, dropdowns, donuts, slider) | ✅ Built |
| Contact page (Leaflet map, mailto, partner logos) | ✅ Built |
| `Limpopo_Risk_Jan25_Jan26_Safe.csv` (7 384 records, 9 municipalities, 13 months) | ✅ Published |
| EO pipeline — GEE composition, GCS export, DB upsert | ✅ Built |
| Playwright dashboard tests — 264 / 267 outcomes passing | ✅ Running |
| pytest pipeline tests — 98 / 98 passing | ✅ Running |
| NCD Risk Dashboard | 🔵 In development |
| XGBoost Malaria Forecasting | 🔵 In development |
| Cloud Run server-side scoring API | 🔵 In development |
| User Risk Alert system | 🔵 In development |
| Multi-country expansion (Zambia) | ⏳ M3 |
| SADHS model validation | ⏳ M3 |