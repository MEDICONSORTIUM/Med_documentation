---
id: pipeline-tests
title: EO Data Pipeline Tests
sidebar_label: Pipeline Tests
---

# EO Data Pipeline Tests

**Spec files:** `test_unit.py` · `test_integration_transforms.py` · `test_integration_db.py` · `test_e2e_pipeline.py`
**Framework:** pytest · **Result, verified this session by actually running the suite:** ✅ 98 / 98 passing (≈ 1.1 s)

---

## What is being tested

The `etl_pipeline.py` script is the monthly satellite ingestion job that produces all EO-derived
environmental data in the EOHA platform. It runs as a **GitHub Actions job** (cron `'0 0 1 * *'`,
monthly, plus manual `workflow_dispatch`) — not a Cloud Run job, as earlier drafts of this page
described. It executes eight steps in sequence:

| # | Step | Description |
|---|------|-------------|
| 0 | Authentication | Service account JSON loaded from `GCP_SA_JSON`; GEE and GCS clients initialised |
| 1 | Month resolution | Previous calendar month derived as the processing window |
| 2 | Asset loading | SA ward boundaries, WorldPop population, and ESA WorldCover images loaded from GEE |
| 3 | Image composition | Per-province: LST, NDVI, NDWI, ERA5 temperature and soil moisture stacked into one multi-band image |
| 4 | Region reduction | Mean and mode reducers applied at 1,000 m scale over ward polygons |
| 5 | Export | One GEE batch export task per province; output CSV written to GCS |
| 6 | Task polling | Active tasks polled every 30 seconds; pipeline exits on any `FAILED`-equivalent state |
| 7 | Transform | GCS CSV parsed; zone and observation DataFrames constructed and cleaned |
| 8 | DB upsert | Both tables upserted to PostgreSQL using `ON CONFLICT DO UPDATE` |

Because GEE uses a deferred computation model and the pipeline calls out to Google Cloud, the entire
external surface is mocked in tests. No credentials, network calls, or real database connections are
needed to run the suite — confirmed by actually running it with none configured.

## Test environment

| Parameter | Value |
|-----------|-------|
| Required packages | `pytest pytest-mock pandas psycopg2-binary` |
| GEE credentials | Not required — `ee` module fully replaced by `MagicMock` |
| GCS credentials | Not required — storage client injected as `MagicMock` |
| PostgreSQL connection | Not required — `execute_batch` patched at module level |
| Run time | ≈ 1.1 s (verified this session) |
| Runtime environment | Python 3.11.9 in CI (the repo's own README/badges say 3.12 — CI is the source of truth) |

## Running the suite

```bash
pip install pytest pytest-mock pandas psycopg2-binary

cd eo-datapipeline
pytest tests/ -v --tb=short

# Or target individual layers
pytest tests/test_unit.py -v
pytest tests/test_integration_transforms.py -v
pytest tests/test_integration_db.py -v
pytest tests/test_e2e_pipeline.py -v

# Expected output
# ========================= 98 passed in ~1s ==========================
```

---

## EOHA-GEE — GEE Image Composition Unit Tests · 13 tests · ✅ passing, but see caveat

Source: `tests/test_unit.py` (its own internal docstring header still reads `test_unit_gee.py` — a
leftover from before a rename; the file on disk is `test_unit.py`).

:::caution Does not exercise production code
This file imports neither `ee`, `etl_pipeline`, nor `tests/eo_datapipeline.py`. It hand-reimplements
`build_safe_band_image()`'s branching logic inline (its own `_run()` helper, explicitly commented as
an "inline re-implementation so we can test the logic without importing the script-level module")
against a bare `MagicMock()` `ee` namespace, and `TestProcessProvince` asserts on raw mock call
patterns rather than calling any real function. **These 13 tests provide no regression protection for
the actual GEE composition code in `etl_pipeline.py`** — they would keep passing unchanged even if
`build_safe_band_image()`/`process_province()` were broken or deleted.
:::

### TestBuildSafeBandImage — 7 tests

| ID | Test | What is checked |
|----|------|----------------|
| EOHA-GEE-001 | `test_returns_with_data_branch` | Return value is not `None` when collection is non-empty |
| EOHA-GEE-002 | `test_select_called_with_correct_band` | `.select()` receives the correct band name string |
| EOHA-GEE-003 | `test_mean_is_called_on_filtered_collection` | `.mean()` is chained after `.select()` |
| EOHA-GEE-004 | `test_scale_factor_applied` | `.multiply(scale)` called with the correct constant |
| EOHA-GEE-005 | `test_offset_applied` | `.add(offset)` called after `.multiply()` |
| EOHA-GEE-006 | `test_output_band_renamed` | `.rename(output_name)` called with the correct column name |
| EOHA-GEE-007 | `test_fallback_branch_uses_selfmask` | When collection is empty, `selfMask()` is called exactly once |

### TestProcessProvince — 6 tests

| ID | Test | What is checked |
|----|------|----------------|
| EOHA-GEE-008 | `test_filter_called_with_province_name` | `ee.Filter.eq('Province', name)` used to subset wards |
| EOHA-GEE-009 | `test_reduce_regions_uses_mean_reducer` | `reduceRegions()` called with `ee.Reducer.mean()` |
| EOHA-GEE-010 | `test_reduce_regions_scale_is_1000` | `scale=1000` passed exactly |
| EOHA-GEE-011 | `test_habitat_mode_reducer_fires` | A separate `reduceRegions()` call exists with `ee.Reducer.mode()` |
| EOHA-GEE-012 | `test_population_density_multiplied_by_100` | `.multiply(100)` called on the WorldPop image |
| EOHA-GEE-013 | `test_month_label_set_on_features` | `feature.set('Month', label)` applied via `.map()` |

---

## EOHA-TRF — GCS and DataFrame Transform Tests · 27 tests · ✅

Source: `tests/test_integration_transforms.py`. Real pandas operations run on in-memory DataFrames,
importing real functions from `tests/eo_datapipeline.py`.

### TestBuildZoneDataframe — 15 tests

| Concern | Assertions |
|---------|-----------|
| Schema | Correct column set; no extra columns; `zone_type = 'Ward'` for all rows |
| Type safety | `zone_id` → `int64`; `latitude`/`longitude` → `float64`; `base_population` → `int64`; `external_zone_id` → `object` |
| Null handling | Null `Population_Count` defaults to `0` via `fillna(0)`; NaN float columns pass through as SQL `NULL` |
| Data integrity | Province and municipality names pass through unchanged |
| Deduplication | Duplicate `WardID` rows are reduced to one |
| Dropping | Non-numeric `WardID` rows are silently dropped |
| Scale | Clean 2-row input → exactly 2 output rows |

### TestBuildObservationDataframe — 11 tests

| Concern | Assertions |
|---------|-----------|
| Schema | Eight required columns: `date_recorded`, `zone_id`, `lst_surface_temp_c`, `air_temp_c`, `soil_moisture_pct`, `ndvi_vegetation_index`, `ndwi_water_index`, `agric_percentage` |
| Date logic | `date_recorded` is `datetime64[ns]`; year and month match the label; day is always `1` |
| Value correctness | `lst_surface_temp_c` and `ndvi_vegetation_index` match the fixture to `pytest.approx` precision |
| Null handling | Null LST input → NaN or None in output (SQL `NULL` safe) |
| Scale | 9-province concatenation (9 × 2-row fixtures) → exactly 18 rows |

### TestLoadCsvFromGcs — 8 tests

| Concern | Assertions |
|---------|-----------|
| Return type | Returns a `pd.DataFrame` |
| GCS API contract | `bucket(name)` and `blob('pipeline_output/{filename}.csv')` called with exact strings |
| Content | Correct columns and row count matching the mock fixture |
| Empty CSV | Header-only CSV → empty DataFrame, no exception |
| Province slugs | All 9 slugified province filenames are distinct and contain no spaces |
| API call count | `download_as_text()` called exactly once per invocation |

---

## EOHA-DB — PostgreSQL Upsert Integration Tests · 23 tests · ✅

Source: `tests/test_integration_db.py`. `execute_batch` is patched at the module boundary. Tests
inspect the SQL string, the row tuple structure, and the keyword arguments passed to the mock cursor.

### TestUpsertZoneRows — 10 tests

| Concern | Key assertion |
|---------|--------------|
| SQL correctness | `INSERT INTO zone` and `ON CONFLICT (zone_id) DO UPDATE SET` both present |
| Row structure | Each row is a `tuple` with exactly 11 fields; first field is `int` (`zone_id`) |
| API contract | `execute_batch` called exactly once; cursor passed as first argument |
| Return value | Return value equals `len(input_df)` |
| Empty DataFrame | Returns `0` without raising |

### TestUpsertObservationRows — 10 tests

| Concern | Key assertion |
|---------|--------------|
| SQL correctness | `INSERT INTO malaria_observation`; conflict key is `(zone_id, date_recorded)`; all six EO columns in the update clause |
| Row structure | Each row is a `tuple` with exactly 8 fields |
| Performance | `page_size=1000` keyword argument passed to `execute_batch` |
| Empty DataFrame | Returns `0` without error |

### TestDbErrorHandling — 3 tests

`psycopg2.OperationalError`, `psycopg2.ProgrammingError`, and `psycopg2.IntegrityError` raised inside
`execute_batch` all propagate unmodified to the pipeline caller. `etl_pipeline.py`'s own loop is
responsible for calling `connection.rollback()` and `sys.exit(1)` on any such exception.

---

## EOHA-E2E — Full Pipeline Flow Tests · 35 tests · ✅

Source: `tests/test_e2e_pipeline.py`. Wires all components together using the complete set of mocked
external surfaces. Verifies end-to-end correctness: GCS read → transform → DB write.

### TestPollTaskUntilComplete — 7 tests

| Scenario | Expected outcome |
|----------|-----------------|
| Task completes immediately | Returns `True` |
| Task fails (`FAILED` state) | Returns `False`; no exception |
| Task active for two polls | `active()` called 3× ; `sleep()` called 2× |
| Poll interval respected | `time.sleep()` called with the configured interval |
| Status check after inactive | `task.status()` invoked exactly once |
| `CANCELLED` state | Returns `False` |
| `UNSUBMITTED` state | Returns `False` |

### TestPipelineHappyPath — 9 tests

Full chain: `load_csv_from_gcs → build_zone_dataframe → build_observation_dataframe →
upsert_zone_rows → upsert_observation_rows`. Both zone and observation row counts equal 2 (matching
the fixture); `zone_id` values are identical across both DataFrames; GCS bucket and blob paths are
called with exact string arguments; `date_recorded` is the first day of the correct month; no null
`zone_id` values appear in either output.

### TestAllProvincesProcessed — 6 tests

`PROVINCES` contains exactly 9 entries including `Limpopo` and `Gauteng`. All slugified province
filenames are distinct and contain no spaces. Sequential GCS reads for all 9 provinces each return a
valid, non-empty `pd.DataFrame`.

### TestGcsFailurePath — 2 tests

GCS 403 Forbidden and `NotFound` both propagate unmodified to the pipeline caller.

### TestTaskFailurePath — 3 tests

`FAILED`, `CANCELLED`, and `UNSUBMITTED` task states all cause `poll_task_until_complete` to return
`False` without raising.

### TestDatabaseRoundtrip — 8 tests

After zone and observation upserts are called, `execute_batch` call arguments are inspected to verify
that zone IDs cross-reference correctly between the two tables, that all 9 provinces' rows are written
in the correct order, and that the return-value sum across all province calls equals the total fixture
row count.

---

## Design decisions (from the repo's own `Agent.md`)

**No live GEE calls.** GEE's deferred computation model means unit tests cannot verify pixel values —
only that the correct API methods are called with the correct arguments.

**No live psycopg2 connection.** SQL correctness is verified by string inspection, not against a real
database.

**Two files, one piece of logic.** `etl_pipeline.py` (production, has top-level side effects, cannot
be imported by tests) and `tests/eo_datapipeline.py` (a hand-duplicated, pure-function-only copy that
tests actually import) are kept in sync today by convention only — nothing enforces it at import
time. See [`eo-datapipeline/SUMMARY.md`](https://github.com/MEDICONSORTIUM/eo-datapipeline/blob/main/SUMMARY.md#2-architecture--design)
for the full detail on this risk.
