/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '🌍 Platform overview',
    },
    {
      type: 'category',
      label: 'Architecture',
      collapsed: false,
      items: [
        'architecture/system-architecture',
        'architecture/eo-pipeline',
      ],
    },
    {
      type: 'category',
      label: 'Modules',
      collapsed: false,
      items: [
        'modules/malaria',
        'modules/ncd',
      ],
    },
    {
      type: 'category',
      label: 'Data',
      collapsed: false,
      items: [
        'data/datasets',
        'data/google-earth-engine',
      ],
    },
    {
      type: 'category',
      label: 'Project',
      collapsed: false,
      items: [
        'milestones/overview',
        'milestones/milestone-1',
        'project/partners',
      ],
    },
  ],
};

export default sidebars;