import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const FEATURES = [
  {
    icon: '🛰️',
    title: 'Earth Observation Data',
    desc: 'Sentinel-2/3, Landsat 8/9 and MODIS imagery processed via Google Earth Engine to extract health-relevant environmental indices.',
  },
  {
    icon: '🦟',
    title: 'Malaria Risk Prediction',
    desc: 'Ward-level malaria risk scoring across Limpopo province using soil moisture, LST, NDWI and population density — updated monthly.',
  },
  {
    icon: '🫀',
    title: 'NCD Risk Monitoring',
    desc: 'Non-communicable disease risk factors mapped across Southern Africa using air quality, heat stress and land-cover indicators.',
  },
  {
    icon: '🗺️',
    title: 'Interactive Dashboard',
    desc: 'Real-time Leaflet-based maps with region drill-down, risk filters, time sliders and auto-generated stakeholder reports.',
  },
  {
    icon: '📡',
    title: 'Google Earth Engine Pipeline',
    desc: 'Automated six-stage data pipeline: acquisition → pre-processing → feature extraction → fusion → risk modelling → output.',
  },
  {
    icon: '🏥',
    title: 'Partner Validated',
    desc: 'Platform validated through pilot testing with UCT, CSIR and NICD. Outputs designed for direct use by DoH and public health teams.',
  },
];

const STATS = [
  { value: '7,384', label: 'Ward records (Limpopo)' },
  { value: '13', label: 'Months of data (Jan 25 – Jan 26)' },
  { value: '4', label: 'Southern African countries' },
  { value: 'R 1M', label: 'Total project budget' },
];

const MILESTONES = [
  {
    num: 'Milestone 0',
    title: 'Compliance & Contracting',
    date: 'Oct 2025',
    amount: null,
    active: false,
    done: true,
  },
  {
    num: 'Milestone 1',
    title: 'System Design & Data Architecture',
    date: 'Nov 2025 – Mar 2026',
    amount: 'R 250,000',
    active: true,
    done: false,
  },
  {
    num: 'Milestone 2',
    title: 'Prototype Development (PoC)',
    date: 'Mar – Aug 2026',
    amount: 'R 500,000',
    active: false,
    done: false,
  },
  {
    num: 'Milestone 3',
    title: 'Prototype Validation & Testing',
    date: 'Aug – Nov 2026',
    amount: 'R 250,000',
    active: false,
    done: false,
  },
];

const PARTNERS = ['UCT', 'CSIR', 'NICD', 'TuksNovation', 'NeoFrontiers', 'DoH', 'DWS', 'SAWS'];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="EO Health Surveillance Platform"
      description="Earth Observation-based water-borne pathogen and NCD risk monitoring platform for Southern Africa."
    >
      {/* ── Hero ── */}
      <div className="hero--med">
        <div className="container">
          {/* Eyebrow */}
          <div className="badge--teal" style={{ marginBottom: '1.5rem' }}>
            🛰️ Milestone 1 in progress — Nov 2025 to Mar 2026
          </div>

          <h1 className="hero__title">
            Earth Observation<br />for Public Health
          </h1>

          <p className="hero__subtitle">
            Monitoring water-borne pathogen risks and non-communicable disease factors
            across Southern Africa using satellite imagery and epidemiological data.
          </p>

          <div className="hero-cta-group">
            <Link to="/docs/intro" className="btn-primary">
              Read the docs
            </Link>
            <a
              href="https://main.d1jko0jkg4m7f.amplifyapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Open live platform ↗
            </a>
          </div>

          {/* Stats */}
          <div className="stats-row" style={{ marginTop: '4rem' }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-item__value">{s.value}</span>
                <span className="stat-item__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Platform capabilities
        </h2>
        <p style={{ marginBottom: '3rem' }}>
          Six core capabilities powering the EO health surveillance system.
        </p>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <span className="feature-card__icon">{f.icon}</span>
              <div className="feature-card__title">{f.title}</div>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Milestones ── */}
      <div
        className="container"
        style={{
          paddingTop: '4rem',
          paddingBottom: '6rem',
          borderTop: '1px solid var(--ifm-toc-border-color)',
        }}
      >
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          Project milestones
        </h2>
        <p style={{ marginBottom: '2rem' }}>
          Implementation period: 1 November 2025 – 31 October 2026 · Total budget: R 1,000,000
        </p>

        <div className="milestone-strip">
          {MILESTONES.map((m, i) => (
            <div
              key={i}
              className={`milestone-card${m.active ? ' milestone-card--active' : ''}`}
            >
              <div className="milestone-card__number">
                {m.done ? '✓ ' : ''}{m.num}
              </div>
              <div className="milestone-card__title">{m.title}</div>
              <div className="milestone-card__date">{m.date}</div>
              {m.amount && (
                <div className="milestone-card__amount">{m.amount}</div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '2.5rem',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/docs/milestones/milestone-1" className="btn-primary" style={{ fontSize: '0.875rem', padding: '10px 20px' }}>
            View Milestone 1 details
          </Link>
          <Link to="/docs/architecture/system-architecture" className="btn-outline" style={{ fontSize: '0.875rem', padding: '9px 20px' }}>
            System architecture →
          </Link>
        </div>
      </div>

      {/* ── Partners ── */}
      <div
        style={{
          background: 'var(--ifm-background-surface-color)',
          borderTop: '1px solid var(--ifm-toc-border-color)',
          borderBottom: '1px solid var(--ifm-toc-border-color)',
          padding: '4rem 0',
        }}
      >
        <div className="container">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ifm-color-content-secondary)',
              marginBottom: '1.5rem',
            }}
          >
            Partners &amp; institutions
          </p>
          <div className="partners-row" style={{ borderTop: 'none', paddingTop: 0 }}>
            {PARTNERS.map((p, i) => (
              <span key={i} className="partner-pill">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="container" style={{ padding: '6rem 0' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>
          Quick access
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {[
            { emoji: '📋', label: 'Platform intro', to: '/docs/intro' },
            { emoji: '🏗️', label: 'System architecture', to: '/docs/architecture/system-architecture' },
            { emoji: '🔬', label: 'EO data pipeline', to: '/docs/architecture/eo-pipeline' },
            { emoji: '🦟', label: 'Malaria risk module', to: '/docs/modules/malaria' },
            { emoji: '🫀', label: 'NCD risk module', to: '/docs/modules/ncd' },
            { emoji: '📊', label: 'Datasets', to: '/docs/data/datasets' },
          ].map((link, i) => (
            <Link
              key={i}
              to={link.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '1.25rem 1.5rem',
                background: 'var(--ifm-background-surface-color)',
                border: '1px solid var(--ifm-toc-border-color)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--ifm-color-content)',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--ifm-color-content-secondary)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--ifm-toc-border-color)';
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{link.emoji}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}