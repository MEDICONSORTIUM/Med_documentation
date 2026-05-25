<div align="center">

```
███████  ██████  ██   ██  █████
██      ██    ██ ██   ██ ██   ██
█████   ██    ██ ███████ ███████
██      ██    ██ ██   ██ ██   ██
███████  ██████  ██   ██ ██   ██
```

# Earth Observation Health Analytics

**Satellites watching. Algorithms thinking. Communities safer.**

[![Playwright Tests](https://img.shields.io/badge/playwright-264%2F267%20passing-4CAF50?style=flat-square&logo=playwright)](https://mediconsortium.github.io/Med_documentation/docs/testing/overview)
[![pytest](https://img.shields.io/badge/pytest-98%2F98%20passing-4CAF50?style=flat-square&logo=pytest)](https://mediconsortium.github.io/Med_documentation/docs/testing/pipeline-tests)
[![Milestone](https://img.shields.io/badge/milestone-M2%20active-1a82ff?style=flat-square)](https://mediconsortium.github.io/Med_documentation/docs/milestones/milestone-2)
[![Docs](https://img.shields.io/badge/docs-live-0070f3?style=flat-square)](https://mediconsortium.github.io/Med_documentation/)
[![Platform](https://img.shields.io/badge/platform-live-0070f3?style=flat-square)](https://main.d1jko0jkg4m7f.amplifyapp.com)
[![License](https://img.shields.io/badge/license-MIT-gray?style=flat-square)](./LICENSE)

[Live Platform](https://main.d1jko0jkg4m7f.amplifyapp.com) · [Documentation](https://mediconsortium.github.io/Med_documentation/) · [Milestone 2](https://mediconsortium.github.io/Med_documentation/docs/milestones/milestone-2) · [Report a Bug](https://github.com/mediconsortium/Med_documentation/issues)

</div>

---

## The problem we are solving

Every year, **malaria kills over 600 000 people** — the overwhelming majority of them in sub-Saharan Africa, and the overwhelming majority of them children under five. Meanwhile, non-communicable diseases — hypertension, cardiovascular disease, respiratory illness — are rising silently across the same communities, fuelled by urbanisation, air quality decline, and environmental stress that nobody is measuring at the ward level.

The data to fight both threats already exists. It falls from orbit every single day — from Sentinel-2 multispectral imagers, MODIS thermal sensors, ERA5 climate reanalysis grids, and Copernicus atmospheric monitors. Petabytes of it. Free. Publicly accessible. Almost completely unused by the people who need it most.

**EOHA closes that gap.**

We ingest satellite data, run it through an environmental risk pipeline, and surface the results as a ward-level risk score on a map that a public health official can open in a browser with no training, no GIS expertise, and no dedicated infrastructure. Select a ward. See the risk. Act.

---

## What is this repository

This repository is the **documentation site** for the EOHA platform — a [Docusaurus 3](https://docusaurus.io/) static site deployed to GitHub Pages. It documents:

- The system architecture and EO data pipeline
- The malaria and NCD risk modules
- The design specification and UML diagrams
- The full automated test suite (Playwright + pytest)
- A living walkthrough of the platform's current state
- Milestone progress and partner information

The **platform itself** lives at [main.d1jko0jkg4m7f.amplifyapp.com](https://main.d1jko0jkg4m7f.amplifyapp.com) and is deployed separately via AWS Amplify.

---

## Platform at a glance

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EOHA Platform                               │
│                                                                     │
│  ┌──────────────┐    ┌────────────────┐    ┌─────────────────────┐ │
│  │   Sentinel-2 │    │  MODIS / ERA5  │    │ Copernicus S5P / GFS│ │
│  │  (NDVI/NDWI) │    │  (LST / soil)  │    │   (NO₂ / aerosol)  │ │
│  └──────┬───────┘    └───────┬────────┘    └──────────┬──────────┘ │
│         └────────────────────┴─────────────────────────┘           │
│                              │                                      │
│                    Google Earth Engine                              │
│                    reduceRegions() @ 1km                            │
│                              │                                      │
│                   Cloud Run / Python pipeline                       │
│                   → GCS export → PostgreSQL                         │
│                              │                                      │
│          ┌───────────────────┴────────────────────┐                │
│          │           AWS Amplify frontend          │                │
│          │                                         │                │
│          │  ┌──────────────────────────────────┐  │                │
│          │  │  Leaflet map + heatmap overlay   │  │                │
│          │  │  Ward-level risk donuts          │  │                │
│          │  │  Cascading dropdowns             │  │                │
│          │  │  13-month timeline slider        │  │                │
│          │  └──────────────────────────────────┘  │                │
│          └─────────────────────────────────────────┘               │
│                                                                     │
│  Coverage: 9 municipalities · 7 384 ward-months · 13 EO bands      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## The two modules

### 🦟 Malaria Risk

Vector habitat suitability calculated from four environmental signals:

| Signal | Source | Threshold |
|--------|---------|-----------|
| Soil moisture | ERA5 | > 0.25 m³/m³ triggers; > 0.35 catches peak breeding |
| Land surface temperature | MODIS MOD11A1 | 25 – 30 °C is the Anopheles sweet spot |
| Water presence (NDWI) | Sentinel-2 | > −0.1 indicates standing water |
| Population density | WorldPop | > 300 persons/km² amplifies transmission risk |

The composite score runs 0 – 100 and is resolved at the ward level, every month, across all of Limpopo Province. Green wards are quiet. Red wards need attention. The heatmap makes the pattern undeniable.

### 🫀 NCD Risk

The 5th Wave Index — our framing for the non-communicable disease burden rising alongside infectious disease in the same communities. Environmental inputs include NO₂ column density (Copernicus S5P TROPOMI), aerosol index, UV radiation, land surface temperature, and ESA urban cover fraction. The NCD module is in active development at Milestone 2.

---

## Current status — Milestone 2

> **M2 is active.** March – August 2026.

| Deliverable | Status |
|-------------|--------|
| Malaria Risk Dashboard (map, heatmap, donuts, slider) | ✅ Live |
| Limpopo CSV dataset (7 384 records, 13 months) | ✅ Published |
| EO ingestion pipeline (GEE → GCS → PostgreSQL) | ✅ Built |
| Playwright test suite — 264 / 267 outcomes passing | ✅ Running |
| pytest pipeline suite — 98 / 98 passing | ✅ Running |
| Documentation site (Docusaurus) | ✅ Live |
| NCD Risk Dashboard | 🔵 In development |
| XGBoost Malaria Forecasting | 🔵 In development |
| Cloud Run server-side scoring API | 🔵 In development |
| User Risk Alert system | 🔵 In development |
| Multi-country expansion (Zambia) | ⏳ M3 |
| SADHS validation + model audit | ⏳ M3 |

Full sprint plan (S1–S5, March – August 2026) is in the [Milestone 2 doc](https://mediconsortium.github.io/Med_documentation/docs/milestones/milestone-2).

---

## Test results

We test everything that can be tested without credentials.

### Playwright — browser-level dashboard tests

```
Run date:  23 April 2026
Duration:  ~504 seconds · 6 parallel workers
Browsers:  Chromium · Firefox · WebKit

MalariaDashboard.spec.js    153 outcomes    ✅ All passing
malaria-api.spec.js          63 outcomes    ✅ All passing
malaria-visual.spec.js       42 outcomes    ⚠️ 39 passing · 3 failing (WebKit only)
example.spec.js               9 outcomes    ✅ All passing
────────────────────────────────────────────────────────
Total                        267            264 passing
```

The 3 failing tests are visual regression screenshots in WebKit. The same screenshots pass on Chromium and Firefox. The failures are a WebKit-specific compositing behaviour after Leaflet map animations — not a logic bug, not a data bug, not a UX bug. The UI is in the correct state in every case. [Full analysis in the docs](https://mediconsortium.github.io/Med_documentation/docs/testing/dashboard-tests#webkit-failures).

### pytest — server-side pipeline tests

```
Run date:  continuous
Duration:  0.82 seconds

test_unit_gee.py               13 / 13    ✅
test_integration_transforms.py  27 / 27   ✅
test_integration_db.py          23 / 23   ✅
test_e2e_pipeline.py            35 / 35   ✅
────────────────────────────────────────────
Total                           98 / 98   ✅
```

No GEE credentials. No GCS credentials. No database. Everything mocked at the correct boundary. The suite runs in under a second.

---

## Repository structure

```
Med_documentation/
│
├── docs/                          # All documentation pages
│   ├── intro.md                   # Platform overview
│   ├── architecture/              # System architecture, EO pipeline, UML
│   ├── design-specification/      # ERDs, use cases, wireframes, workflows
│   ├── modules/                   # Malaria and NCD module docs
│   ├── data/                      # Dataset schema, GEE reference
│   ├── testing/                   # Test plan, Playwright suite, pytest suite
│   ├── walkthrough/               # Living progress narrative (this milestone)
│   ├── milestones/                # M0–M3 status and deliverables
│   └── project/                   # Partners and funding
│
├── blog/                          # Engineering blog posts
│   ├── authors.yml
│   ├── 2025-11-20-extracting-gee-data.md
│   ├── 2025-12-10-milestone-1-progress.md
│   ├── 2026-01-15-ncd-southern-africa.md
│   └── 2026-04-01-milestone-2-kickoff.md
│
├── static/                        # Static assets served at /Med_documentation/
│   ├── img/                       # Logos, favicon, OG preview
│   └── assets/
│       ├── design-spec/           # PDFs, PNGs, .drawio, .docx files
│       └── walkthrough/           # Screenshots from the test report
│
├── src/
│   └── css/
│       └── custom.css             # Next.js-aesthetic design tokens
│
├── docusaurus.config.js           # Site config, navbar, footer, plugins
├── sidebars.js                    # Sidebar structure for docsSidebar + walkthroughSidebar
└── package.json
```

---

## Running the documentation site locally

You need Node.js 18+ and npm.

```bash
git clone https://github.com/mediconsortium/Med_documentation.git
cd Med_documentation

npm install
npm run start
```

The site opens at `http://localhost:3000/Med_documentation/`. Hot reload is on — edit any `.md` file and the browser updates immediately.

```bash
# Production build (what GitHub Actions runs)
npm run build

# Serve the production build locally
npm run serve
# → http://localhost:3000/Med_documentation/
```

---

## Running the tests

### Dashboard tests (Playwright)

```bash
# From the platform repo root
npm install
npx playwright install

# Full run — all browsers
npx playwright test

# Chromium only (fastest, used as the reference browser)
npx playwright test --project=chromium

# Visual regression tests only
npx playwright test malaria-visual

# Capture baselines for the first time (required before visual tests can pass)
npx playwright test malaria-visual --update-snapshots

# Open the HTML report after a run
npx playwright show-report
```

### Pipeline tests (pytest)

```bash
pip install pytest pytest-mock pandas psycopg2-binary

cd eoha_tests
pytest tests/ -v --tb=short

# Target a single layer if you need faster feedback
pytest tests/test_unit_gee.py -v
```

No environment variables. No `.env` file. No GCP project. The entire external surface — GEE, GCS, psycopg2 — is mocked at the correct module boundary. Clone and run.

---

## The EO data pipeline

The pipeline is a Cloud Run job that runs on the first of every month. It processes the previous month's satellite data across all 9 provinces of South Africa.

```
for each province in PROVINCES:
    1. Filter ward boundaries to province
    2. Load Sentinel-2 SR image (cloud masked, QA60 < 20%)
       → compute NDVI = (NIR - Red) / (NIR + Red)
       → compute NDWI = (Green - NIR) / (Green + NIR)
    3. Load MODIS MOD11A1 (LST, scale 0.02, offset −273.15 → Celsius)
    4. Load ERA5 (temperature_2m, soil_moisture_layer_1)
    5. Load WorldPop (population count → multiply × 100 → density/km²)
    6. Stack into multi-band image
    7. reduceRegions(wards, ee.Reducer.mean(), scale=1000)
    8. reduceRegions(wards, ee.Reducer.mode()) for land cover
    9. Export to GCS as pipeline_output/{province_slug}.csv
   10. Poll task.active() every 30 s; exit on FAILED
   11. load_csv_from_gcs() → build_zone_dataframe() → build_observation_dataframe()
   12. upsert_zone_rows(cursor, zone_df)        → ON CONFLICT (zone_id) DO UPDATE SET
       upsert_observation_rows(cursor, obs_df)  → ON CONFLICT (zone_id, date_recorded) DO UPDATE SET
```

The output feeds directly into the malaria risk CSV that the dashboard consumes. The chain from satellite to screen is fully automated.

---

## Dataset — `Limpopo_Risk_Jan25_Jan26_Safe.csv`

| Metric | Value |
|--------|-------|
| Records | 7 384 |
| Municipalities | 9 |
| Time range | January 2025 – January 2026 |
| Columns | 13 EO bands + administrative fields |
| Update mechanism | AWS Amplify console re-deploy on CSV replacement |

Key columns:

```
WardID              int     Unique ward identifier
WardLabel           string  Human-readable ward name
Municipali          string  Full municipality name (used as districtLookup key)
Month               string  "Jan 2025" format — matches MONTH_DATA[i].id in JS
latitude            float   Ward centroid latitude
longitude           float   Ward centroid longitude
LST_Surface_C       float   Land surface temperature in Celsius
NDVI                float   Normalised Difference Vegetation Index
NDWI_Water          float   Normalised Difference Water Index
Soil_Moisture       float   Volumetric soil moisture (m³/m³)
Agric_Percentage    float   Agricultural land fraction (%)
Population_Density_Per_KM2  float  Persons per km²
Land_Cover          int     ESA land cover class (mode)
```

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Documentation | Docusaurus 3, GitHub Pages |
| Frontend (platform) | Vanilla HTML/CSS/JS, Leaflet, leaflet.heat, PapaParse |
| Map tiles | CartoDB light (split: no-labels base + labels-only top pane) |
| Hosting (platform) | AWS Amplify |
| EO processing | Google Earth Engine Python API |
| Pipeline runtime | Cloud Run (Python) |
| Storage | Google Cloud Storage |
| Database | PostgreSQL (Cloud SQL) |
| Dashboard tests | Playwright (`@playwright/test`) |
| Pipeline tests | pytest, pytest-mock, pandas, psycopg2-binary |
| CI/CD | GitHub Actions |

---

## Team

| Person | Role |
|--------|------|
| **Kagisho Montjane** | Principal Investigator / Director |
| **Simamnkele Mlisana** | EO Data Engineer |
| **Msesenyane Makhongela** | Systems Engineer |

**Funded by:** TuksNovation · NeoFrontiers EISF  
**Partners:** SANSA · NRF

---

## Milestones

| Milestone | Period | Status |
|-----------|--------|--------|
| M0 — Compliance | Oct 2025 | ✅ Complete |
| M1 — System Design | Nov 2025 – Mar 2026 | ✅ Complete |
| **M2 — Prototype Development** | **Mar – Aug 2026** | 🔵 **Active** |
| M3 — Validation | Aug – Nov 2026 | ⏳ Upcoming |

M1 delivered: system architecture, ERDs, use case sets, domain model, ETL pipeline architecture for both disease tracks, wireframes, and the Design Specification Document v2.

M2 is delivering: the working malaria dashboard, the automated GEE ingest pipeline, the XGBoost forecasting model, the NCD Copernicus pipeline, the Cloud Run scoring API, and the User Risk Alert integration.

M3 will deliver: SADHS validation, model audit, multi-country expansion, and the full public platform launch.

---

## Contributing

This is an active research project. If you are a partner institution, collaborator, or prospective contributor:

1. Read the [documentation site](https://mediconsortium.github.io/Med_documentation/) — particularly the Architecture and Design Specification sections
2. Check open issues on the [GitHub repo](https://github.com/mediconsortium/Med_documentation/issues)
3. Reach out at [kmontjaneconsortium@gmail.com](mailto:kmontjaneconsortium@gmail.com) before opening a PR

For documentation contributions: edit the relevant `.md` file in `docs/`, commit to a branch, and open a PR against `main`. GitHub Actions will build and preview automatically.

---

## License

MIT © 2026 Medical Consortium of Africa  
Funded by TuksNovation / NeoFrontiers EISF

---

<div align="center">

*600 000 deaths a year is not inevitable.*  
*The data is already falling from orbit.*  
*We just have to use it.*

**[mediconsortium.github.io/Med_documentation](https://mediconsortium.github.io/Med_documentation/)**

</div>