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
    {
      type: 'category',
      label: 'Project',
      items: [
        'milestones/overview',
        'milestones/milestone-1',
        'milestones/milestone-2',
        'project/partners',
      ],
    },
  ],
};

module.exports = sidebars;