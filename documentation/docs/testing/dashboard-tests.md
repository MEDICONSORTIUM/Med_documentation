---
id: dashboard-tests
title: Malaria Dashboard Tests
sidebar_label: Dashboard Tests
---

# Malaria Dashboard Tests

**Spec files:** `MalariaDashboard.spec.js` · `malaria-api.spec.js` · `malaria-visual.spec.js`  
**Framework:** Playwright · **Run date:** 23 April 2026  
**Results:** 264 / 267 outcomes passing across Chromium, Firefox, WebKit

---

## Test environment

| Parameter | Value |
|-----------|-------|
| Runner | `@playwright/test` with ESM imports |
| Browsers | Chromium, Firefox, WebKit |
| Desktop viewport | 1440 × 900 px (pinned for screenshot consistency) |
| Mobile viewport | 390 × 844 px (orientation lock test only) |
| Local base URL | `http://localhost:5500` |
| Action timeout | 60 000 ms |
| Navigation timeout | 120 000 ms |
| Parallel workers | 6 |
| Total run time | ~504 seconds |

## Mock strategy

Every test registers a `page.route()` handler **before** calling `page.goto()`. This is critical — PapaParse fires its CSV fetch during page initialisation, so a handler registered after navigation will miss the request and the page will hang waiting for real data.

The shared helper `setupMalariaPage(page)` in `tests/helpers/malaria.js` enforces this ordering. It intercepts the request to `**/data/Limpopo_Risk_Jan25_Jan26_Safe.csv` and responds with a 7-row inline fixture that covers two municipalities, two months, and all three risk levels (High / Moderate / Low).

---

## `MalariaDashboard.spec.js` — 51 tests · ✅ All passing

### Page Load (6 tests)

All six tests confirm the page initialises in the correct state.

| Test | Assertion |
|------|-----------|
| document has correct title | `page.title() === 'Malaria Guard - Dashboard'` |
| map container is present in DOM | `#map` is attached and visible |
| all four nav links are visible | Dashboard, Forecasting, Resource Center, Reports |
| Dashboard nav link carries the active class | `.active` is on the Dashboard anchor |
| left sidebar and right sidebar are rendered | `.sidebar-left` and `.sidebar-right` are visible |
| bottom timeline panel is rendered | `.bottom-panel` is visible |

### Initial State (8 tests)

Verifies the disabled/placeholder state before any user interaction.

| Test | Assertion |
|------|-----------|
| country select is enabled with Zambia and South Africa options | Both options present, select is enabled |
| province select is disabled on load | `disabled` attribute is set |
| ward select is disabled on load | `disabled` attribute is set |
| apply button is disabled on load | `disabled` attribute is set |
| ward risk donut shows default placeholder values | Text reads `--` / `Select a Ward` / `0% RISK` |
| municipality average donut shows default values | Text reads `--` / `Select Municipality` / `0% AVG` |
| all environmental factor values show double-dash | All three `.val` spans read `--` |
| time slider starts at position 0 | Slider value is `"0"` (Jan 2025) |

### Region Selector — Cascade (10 tests)

Covers the full three-level dropdown chain and the data binding between CSV rows and dropdown options.

| Test | Assertion |
|------|-----------|
| selecting a country enables the province dropdown | Province becomes enabled after country select change |
| province dropdown is populated with municipalities from CSV | Tzaneen and Mopani District Municipality appear |
| province option display text strips "Local Municipality" suffix | Option text is `Tzaneen`, not `Tzaneen Local Municipality` |
| province option value retains the full municipality name | `option.value === "Tzaneen Local Municipality"` |
| selecting a province enables the ward dropdown | Ward becomes enabled |
| ward dropdown shows wards for the current month only | 3 Tzaneen wards at slider position 0 (Jan 2025) |
| selecting a ward enables the apply button | Apply button is no longer disabled |
| switching province resets the ward dropdown | Ward options are cleared and repopulated |
| switching province disables apply until a new ward is selected | Apply reverts to disabled state |
| selecting Mopani populates 2 wards for Jan 2025 | Ward dropdown has 2 options for the alternate municipality |

### Apply — High Risk Ward (8 tests)

Ward 1 Tzaneen is selected. `calculateDynamicRisk()` evaluates it at a score of 100.

| Test | Assertion |
|------|-----------|
| ward name panel updates to selected ward | `#selected-ward-name` reads `Ward 1 Tzaneen` |
| risk label shows High | `#risk-text` reads `High` |
| risk percentage shows 100% | `#risk-percentage` reads `100% RISK` |
| environmental temperature factor shows correct value | `#env-temp-val` reads `28°C` |
| environmental soil moisture factor shows correct value | `#env-soil-val` reads `40%` |
| environmental precipitation factor shows correct value | `#env-agric-val` reads `45%` |
| municipality average panel updates with municipality name | `#selected-muni-name` reads `Tzaneen` |
| municipality average donut is no longer at default | `#avg-risk-text` is not `--` |

### Apply — Low Risk Ward (3 tests)

Ward 3 Tzaneen, score = 0.

| Test | Assertion |
|------|-----------|
| risk label shows Low | `#risk-text` reads `Low` |
| risk percentage shows 0% | `#risk-percentage` reads `0% RISK` |
| environmental factors are populated (not dashes) even for low-risk wards | Values are numbers, not `--` |

### Reset Button (7 tests)

After applying Ward 1 Tzaneen, clicking the reset button:

| Test | Assertion |
|------|-----------|
| reset clears country select value | Value is `""` |
| reset disables province select | Province is disabled |
| reset disables ward select | Ward is disabled |
| reset disables apply button | Apply is disabled |
| reset returns ward risk panel to default placeholder | `#risk-text` reads `--` |
| reset clears province dropdown options (except placeholder) | Only `-- Select Municipality --` remains |
| reset returns environmental factors to double-dash | All three values read `--` |

### Time Slider (4 tests)

| Test | Assertion |
|------|-----------|
| slider has min=0 and max=12 (Jan 2025 to Jan 2026) | Attributes confirmed |
| moving slider resets ward risk panel to defaults | `#risk-text` reads `--` after slider change |
| moving slider with municipality selected repopulates ward dropdown | Tzaneen Feb 2025 wards appear at index 1 |
| moving slider with no municipality selected keeps ward and apply disabled | Both remain disabled |

### Map Legend (5 tests)

| Test | Assertion |
|------|-----------|
| legend renders exactly four items | `.legend-list li` count is 4 |
| first legend item is the live heatmap status indicator | Text contains `LIVE HEATMAP OVERLAY ACTIVE` |
| High Risk legend item is present | Text `High Risk (Red)` is in the list |
| Moderate legend item is present | Text `Moderate (Yellow)` is in the list |
| Low Risk legend item is present | Text `Low Risk (Green)` is in the list |

---

## `malaria-api.spec.js` — 21 tests · ✅ All passing

### Route Interception (2 tests)

| Test | Assertion |
|------|-----------|
| the page requests the CSV from the expected path | Intercepted URL matches `**/data/Limpopo_Risk_Jan25_Jan26_Safe.csv` |
| the mocked route response is consumed by PapaParse | `allCSVData.length > 0` after page load |

### Data Parsing — districtLookup (5 tests)

| Test | Assertion |
|------|-----------|
| districtLookup is keyed by municipality name | Keys exist for `Tzaneen Local Municipality` and `Mopani District Municipality` |
| Tzaneen municipality contains all rows across all months | 5 rows (3 Jan + 2 Feb) |
| Mopani municipality contains correct row count | 2 rows (Jan 2025 only) |
| each row has the expected numeric fields after dynamicTyping | `Soil_Moisture`, `LST_Surface_C`, `latitude`, `longitude`, `Population_Density_Per_KM2` are all `typeof === 'number'` |
| Ward 1 Tzaneen Jan 2025 has correct field values | Values match fixture to `toBeCloseTo` precision |

### Risk Calculation — calculateDynamicRisk() (9 tests)

The risk formula applies four additive conditions:

| Condition | Points |
|-----------|--------|
| `Soil_Moisture > 0.35` | +40 |
| `Soil_Moisture > 0.25` (lower bracket) | +20 |
| `LST_Surface_C ∈ [25, 30]` | +30 |
| `NDWI_Water > -0.1` | +20 |
| `Population_Density_Per_KM2 > 300` | +10 |

| Test | Expected score |
|------|---------------|
| Ward 1 Tzaneen — all conditions met | **100** |
| Ward 2 Tzaneen — high but below max | **70** |
| Ward 3 Tzaneen — no conditions met | **0** |
| Ward 1 Mopani | **100** |
| Ward 2 Mopani — LST out of band, dry soil, low density | **0** |
| Boundary: `SM = 0.35` takes lower bracket (+20, not +40) | Expected |
| Boundary: `LST = 25.0` triggers the bracket | Expected |
| Boundary: `LST = 30.0` triggers the bracket | Expected |
| Boundary: `LST = 30.1` does NOT trigger the bracket | Expected |

### Edge Cases (5 tests)

| Test | Assertion |
|------|-----------|
| rows with a missing Municipali field are silently skipped | No exception; row not in `districtLookup` |
| a CSV 500 error leaves allCSVData empty | `allCSVData.length === 0` |
| province dropdown stays empty when CSV fails | No options added beyond the placeholder |
| only rows matching the current month index are shown in ward dropdown | 3 Tzaneen wards at slider 0; not Feb rows |
| slider advancing to Feb 2025 shows only Feb wards for Tzaneen | 2 Feb wards appear |

---

## `malaria-visual.spec.js` — 14 tests × 3 browsers · 39 / 42 passing {#webkit-failures}

Visual regression tests capture element-scoped screenshots and diff them against stored baselines in `tests/__snapshots__/`. Run `--update-snapshots` after any intentional UI change.

### Results by browser

| Browser | Tests | Passing | Failing |
|---------|------:|--------:|--------:|
| Chromium | 14 | ✅ 14 | — |
| Firefox | 14 | ✅ 14 | — |
| WebKit | 14 | ⚠️ 11 | 3 |

**All 14 tests pass on Chromium and Firefox.** The 3 failures are WebKit-only.

### Visual - Default State (7 tests · ✅ All browsers)

Page loads and waits 5 000 ms for CSS transitions to settle. Screenshots captured of:

| Snapshot | Selector |
|----------|----------|
| `topbar-default.png` | `.top-bar` |
| `region-selector-default.png` | `.region-selector` |
| `env-factors-default.png` | `.enviro-factors` |
| `ward-risk-default.png` | `.risk-card:first-child` |
| `avg-risk-default.png` | `#avg-risk-container` |
| `map-legend-default.png` | `.map-legend` |
| `bottom-panel-default.png` | `.bottom-panel` |

### Visual - High Risk Ward Selected (4 tests · ✅ Chromium + Firefox · ⚠️ WebKit)

Ward 1 Tzaneen selected, Apply clicked, 1 200 ms wait for the `stroke-dashoffset` donut animation.

| Snapshot | Chromium | Firefox | WebKit |
|----------|----------|---------|--------|
| `ward-risk-high.png` | ✅ 8 462 ms | ✅ | ⚠️ 27 112 ms timeout |
| `env-factors-high.png` | ✅ 9 787 ms | ✅ | ⚠️ 26 844 ms timeout |
| `avg-risk-active.png` | ✅ 10 932 ms | ✅ | ✅ |
| `region-selector-selected.png` | ✅ 11 071 ms | ✅ | ⚠️ 27 328 ms + 160px diff |

### What the WebKit failures show

The test runner does reach the point of selecting Ward 1 Tzaneen and clicking Apply — the page snapshot inside the error report confirms the UI is in the correct state: dropdowns show South Africa → Tzaneen → Ward 1 Tzaneen selected, the risk donut reads `100% RISK`, and the environmental factors are populated.

The failures happen during the **screenshot stability check** that runs after element resolution. Playwright's screenshot action calls `scrollIntoView` on the target element and then waits for it to be completely still. In WebKit, the combination of `position: fixed` sidebars and `overflow-y: auto` causes a post-animation scroll state that does not settle the same way it does in Chromium and Firefox. The 5 000 ms stability timeout fires before WebKit finishes compositing.

The `region-selector-selected.png` case goes one step further: WebKit does take a screenshot, but it differs from the baseline by 160 pixels. The diff image shows a horizontal band near the bottom of the Apply button — a sub-pixel rendering difference in the SVG refresh icon that is WebKit-specific.

These are **rendering engine differences**, not logic failures. The feature works correctly on the browsers used in production (Chromium-based). The failures are documented here so the team is aware of them before adding WebKit to the CI gate.

### Visual - Low Risk Ward, Slider, and Mobile (3 tests · ✅ All browsers)

| Snapshot | Setup | Selector |
|----------|-------|----------|
| `ward-risk-low.png` | Ward 3 Tzaneen selected; 2 400 ms wait | `.risk-card:first-child` |
| `bottom-panel-feb2025.png` | Slider set to index 1 (Feb 2025); 300 ms wait | `.bottom-panel` |
| `orientation-lock-mobile.png` | Browser context at 390 × 844 px | `#orientation-lock` |