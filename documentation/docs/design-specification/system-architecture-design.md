---
id: system-architecture-design
title: System Architecture Diagram
sidebar_label: System Architecture
description: EOHA pipeline architecture — data sources, processing pipeline, analytics engine, and output layer.
---

# System Architecture Diagram

The following component diagram illustrates the full EOHA processing pipeline, from raw data source ingestion through the analytics engine to the output layer. It is drawn as a UML component diagram using the structured boundary-and-component notation.

---

## Pipeline architecture

![EOHA System Architecture — pipeline from data sources through analytics to dashboard output](/assets/design-spec/architecture.png)

### Layer breakdown

**Data Sources & Ingestion**
- **Ground Sensors** (Water Quality, DWS) — real-time physical sensor readings
- **Health Registries** (NICD, DoH) — national disease case reporting
- **EO Satellites** (Sentinel, Landsat) — multispectral imagery every 5–8 days

**Processing Pipeline**
- **Ingestion & QA** — atmospheric correction, cloud masking, schema validation
- **Feature Extraction** — computes NDWI, NDVI, SST (sea/surface temperature) from raw bands
- **Storage** — Cloud DB (PostgreSQL) + Data Lake (Google Drive / GEE Assets)

**Analytics Engine**
- **Spatial-Temporal Fusion** — joins raster outputs to administrative zone boundaries by GPS coordinate and date
- **Risk Modelling** — dual-stream pathogen (malaria) and NCD model producing probability scores

**Output Layer**
- **Alert System** — SMS/email notifications dispatched when `outbreak_probability_score > 0.80`
- **Surveillance Dashboard** — interactive Leaflet map with choropleth risk overlays

---

## Frontend system component diagram

The following diagram shows the internal component relationships within the frontend EOHA application — how the dashboard, module views, and data services interact.

![EOHA Frontend Component Diagram](/assets/design-spec/FrontEOHA.drawio1.png)

---

## Full design specification

The complete architecture is documented in the Design Specification Document v2.

<div style={{
  display: 'flex',
  gap: '12px',
  margin: '1.5rem 0'
}}>
  <a
    href="/Med_documentation/assets/design-spec/Design%20Specification%20Document%20v2.pdf"
    target="_blank"
    style={{
      display: 'inline-block',
      padding: '0.5rem 1.2rem',
      background: 'var(--ifm-color-primary)',
      color: '#fff',
      borderRadius: '6px',
      fontWeight: 600,
      fontSize: '14px',
      textDecoration: 'none'
    }}
  >
    Download PDF →
  </a>
</div>

### Embedded document viewer

<iframe
  src="/Med_documentation/assets/design-spec/Design%20Specification%20Document%20v2.pdf"
  width="100%"
  height="800px"
  style={{ border: '1px solid var(--ifm-toc-border-color)', borderRadius: '8px', marginTop: '1rem' }}
  title="EOHA Design Specification Document v2"
/>
