// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Medical Consortium Documentation',
  tagline: 'Earth Observation for Public Health Surveillance',
  favicon: 'img/M.jpg',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap',
      },
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://MEDICONSORTIUM.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/Med_documentation/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'MEDICONSORTIUM', // Usually your GitHub org/user name.
  projectName: 'Med_documentation', // Usually your repo name.

  deploymentBranch: 'gh-pages',

  trailingSlash: false,

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,

          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          blogTitle: 'MED Consortium Blog',
          blogDescription: 'Updates, research notes and field reports from the EO health surveillance platform team.',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All posts',
          postsPerPage: 6,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/M.jpg',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
        disableSwitch: false,
      },
      navbar: {
        hideOnScroll: true,
        title: 'MED Consortium',
        logo: {
          alt: 'MED Consortium Logo',
          src: 'img/M.jpg',
          // srcDark: 'img/logo-dark.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/docs/data/datasets',
            label: 'Datasets',
            position: 'left',
          },
          {
            to: '/docs/milestones/overview',
            label: 'Milestones',
            position: 'left',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left'
          },
          {
            href: 'https://main.d1jko0jkg4m7f.amplifyapp.com/',
            label: 'Live Platform',
            position: 'right',
          },
          {
            href: 'https://github.com/mediconsortium/Med_documentation',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Platform',
            items: [
              { label: 'Malaria Risk Module', to: '/docs/modules/malaria' },
              { label: 'NCD Risk Module', to: '/docs/modules/ncd' },
              { label: 'Live Dashboard', href: 'https://main.d1jko0jkg4m7f.amplifyapp.com/' },
            ],
          },
          {
            title: 'Architecture',
            items: [
              { label: 'System Architecture', to: '/docs/architecture/system-architecture' },
              { label: 'EO Data Pipeline', to: '/docs/architecture/eo-pipeline' },
              { label: 'Data Sources', to: '/docs/data/datasets' },
            ],
          },
          {
            title: 'Project',
            items: [
              { label: 'Milestone 1', to: '/docs/milestones/milestone-1' },
              { label: 'Partners', to: '/docs/project/partners' },
              { label: 'GitHub', href: 'https://github.com/mediconsortium/Med_documentation' },
            ],
          },
          {
            title: 'Latest',
            items: [
              { label: 'Blog', to: '/blog' },
              { label: 'Milestone 1', to: '/docs/milestones/milestone-1' },
              { label: 'Partners', to: '/docs/project/partners' },
              {
                label: 'GitHub', href: 'https://github.com/mediconsortium/Med_documentation'
              },
            ],
          },

        ],
        copyright: `Copyright © ${new Date().getFullYear()} MED Consortium. Funded by TuksNovation / NeoFrontiers. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['python', 'bash', 'javascript', 'json', 'java'],
      },
      announcementBar: {
        id: 'milestone_1_live',
        content: '🛰️ <strong>Milestone 1</strong> is underway — System Design & Data Architecture (Nov 2025 – Mar 2026). <a href="/Med_documentation/docs/milestones/milestone-1">View progress →</a>',
        backgroundColor: '#0070f3',
        textColor: '#ffffff',
        isCloseable: true,
      },
      metadata: [
        { name: 'keywords', content: 'earth observation, malaria, NCD, health surveillance, Limpopo, South Africa, remote sensing, GEE' },
        { name: 'description', content: 'EO-based water-borne pathogen and non-communicable disease risk monitoring platform for Southern Africa.' },
      ],
    }),
};

export default config;
