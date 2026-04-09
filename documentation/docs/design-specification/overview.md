---
id: overview
title: Design Specification
sidebar_label: Overview
description: EOHA Design Specification Document v2 — all diagrams, ERDs, use cases, wireframes, and pipeline architecture for the MED Consortium platform.
---

# Design Specification

**Document:** EOHA Design Specification v2 &nbsp;|&nbsp; **Prepared by:** Simamnkele Mlisana & Msesenyane Makhongela  
**Organisation:** Medical Consortium of Africa (Pty) Ltd, University of Pretoria / TuksNovation

---

This section contains all design artefacts produced during **Milestone 1**. Each page renders the diagrams inline and provides download links for original files.

## Document sections

| Section | Contents |
|---------|----------|
| [System Architecture →](/Med_documentation/docs/design-specification/system-architecture) | Pipeline architecture, data flow, component diagram |
| [Data Architecture →](/Med_documentation/docs/design-specification/data-architecture) | ERDs — Observation Prediction and User Management |
| [Use Cases →](/Med_documentation/docs/design-specification/use-cases) | Use case diagrams, use case descriptions, actor roles |
| [Wireframes →](/Med_documentation/docs/design-specification/wireframes) | Home, Malaria, and NCD page wireframes |
| [Operational Workflow →](/Med_documentation/docs/design-specification/operational-workflow) | End-to-end operational workflow (UML activity diagram) |

---

## Download original files

| File | Format | Link |
|------|--------|------|
| Design Specification Document v2 | PDF | [Download →](/Med_documentation/assets/design-spec/Design_Specification_Document_v2.pdf) |
| Initial UML (Draw.io) | `.drawio` | [Download →](/Med_documentation/assets/design-spec/Med_Consort_Initial_UML.drawio) |
| Use Case Set | Word `.docx` | [Download →](/Med_documentation/assets/design-spec/Use_Case_Set.docx) |

---

## System description

The EOHA platform encompasses the full lifecycle from environmental satellite data ingestion through to actionable disease forecast delivery. It includes:

- **Data Ingestion** — automated retrieval and mapping of EO satellite data and clinical ground-truth observations to spatial zones
- **Predictive ML** — XGBoost algorithms producing `Malaria_Risk_Forecast` and `NCD_Risk_Forecast` scores per zone
- **Geo Dashboard** — interactive Leaflet map with colour-coded risk zones, historical health data, and AI predictions
- **Alert System** — monitors forecasts against predefined thresholds and dispatches targeted warnings to authorised health officials

## Actors

| Actor | Primary responsibilities |
|-------|------------------------|
| End User | Browse risk maps, view AI forecasts, track and acknowledge alerts |
| Data Contributor | Log ground-truth observation data, report case counts per zone |
| Administrator | Manage user roles, configure zone boundaries, oversee system access |
| System (automated) | Ingest EO data, run ML predictions, render geospatial outputs, dispatch alerts |
