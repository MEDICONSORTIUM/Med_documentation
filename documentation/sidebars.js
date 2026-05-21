// sidebars.js
// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',

    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/system-architecture',
        'architecture/eo-pipeline',
        'architecture/uml-diagrams',
      ],
    },

    {
      type: 'category',
      label: 'Design Specification',
      items: [
        'design-specification/overview',
        'design-specification/system-architecture-design',
        'design-specification/data-architecture',
        'design-specification/use-cases',
        'design-specification/wireframes',
        'design-specification/operational-workflow',
      ],
    },

    {
      type: 'category',
      label: 'Modules',
      items: [
        'modules/malaria',
        'modules/ncd',
      ],
    },

    {
      type: 'category',
      label: 'Data',
      items: [
        'data/datasets',
        'data/google-earth-engine',
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // TESTING — added Milestone 2 (May 2026)
    // 365 automated tests: 267 Playwright outcomes + 98 pytest
    // Run: 23 April 2026 · 264/267 Playwright passing · 98/98 pytest passing
    // ─────────────────────────────────────────────────────────────────────────
    {
      type: 'category',
      label: 'Testing',
      items: [
        'testing/dashboard-tests',
        'testing/testing-overview',
        'testing/pipeline-tests',
      ],
    },

    {
      type: 'category',
      label: 'Project',
      items: [
        'milestones/overview',
        
        'milestones/milestone-2',
        
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // WALKTHROUGH sidebar — standalone tab, not nested under docsSidebar
  // Add { type: 'docSidebar', sidebarId: 'walkthroughSidebar', label: 'Walkthrough' }
  // to the navbar items array in docusaurus.config.js
  // ─────────────────────────────────────────────────────────────────────────
  walkthroughSidebar: [
    'walkthrough/walkthrough',
  ],
};

module.exports = sidebars;
