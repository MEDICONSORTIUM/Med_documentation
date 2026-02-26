import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/my-docs/blog',
    component: ComponentCreator('/my-docs/blog', '2b1'),
    exact: true
  },
  {
    path: '/my-docs/blog/archive',
    component: ComponentCreator('/my-docs/blog/archive', 'a83'),
    exact: true
  },
  {
    path: '/my-docs/blog/authors',
    component: ComponentCreator('/my-docs/blog/authors', '129'),
    exact: true
  },
  {
    path: '/my-docs/blog/authors/all-sebastien-lorber-articles',
    component: ComponentCreator('/my-docs/blog/authors/all-sebastien-lorber-articles', 'df9'),
    exact: true
  },
  {
    path: '/my-docs/blog/authors/yangshun',
    component: ComponentCreator('/my-docs/blog/authors/yangshun', 'e43'),
    exact: true
  },
  {
    path: '/my-docs/blog/first-blog-post',
    component: ComponentCreator('/my-docs/blog/first-blog-post', '879'),
    exact: true
  },
  {
    path: '/my-docs/blog/long-blog-post',
    component: ComponentCreator('/my-docs/blog/long-blog-post', '894'),
    exact: true
  },
  {
    path: '/my-docs/blog/mdx-blog-post',
    component: ComponentCreator('/my-docs/blog/mdx-blog-post', '43c'),
    exact: true
  },
  {
    path: '/my-docs/blog/tags',
    component: ComponentCreator('/my-docs/blog/tags', '6d7'),
    exact: true
  },
  {
    path: '/my-docs/blog/tags/docusaurus',
    component: ComponentCreator('/my-docs/blog/tags/docusaurus', '201'),
    exact: true
  },
  {
    path: '/my-docs/blog/tags/facebook',
    component: ComponentCreator('/my-docs/blog/tags/facebook', 'ab2'),
    exact: true
  },
  {
    path: '/my-docs/blog/tags/hello',
    component: ComponentCreator('/my-docs/blog/tags/hello', '508'),
    exact: true
  },
  {
    path: '/my-docs/blog/tags/hola',
    component: ComponentCreator('/my-docs/blog/tags/hola', 'bd5'),
    exact: true
  },
  {
    path: '/my-docs/blog/welcome',
    component: ComponentCreator('/my-docs/blog/welcome', 'e04'),
    exact: true
  },
  {
    path: '/my-docs/markdown-page',
    component: ComponentCreator('/my-docs/markdown-page', '630'),
    exact: true
  },
  {
    path: '/my-docs/docs',
    component: ComponentCreator('/my-docs/docs', '242'),
    routes: [
      {
        path: '/my-docs/docs',
        component: ComponentCreator('/my-docs/docs', '570'),
        routes: [
          {
            path: '/my-docs/docs',
            component: ComponentCreator('/my-docs/docs', '4c0'),
            routes: [
              {
                path: '/my-docs/docs/intro',
                component: ComponentCreator('/my-docs/docs/intro', '8e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-docs/docs/my-project',
                component: ComponentCreator('/my-docs/docs/my-project', 'da4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-docs/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/my-docs/docs/tutorial-basics/congratulations', 'a6e'),
                exact: true
              },
              {
                path: '/my-docs/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/my-docs/docs/tutorial-basics/create-a-blog-post', 'f5d'),
                exact: true
              },
              {
                path: '/my-docs/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/my-docs/docs/tutorial-basics/create-a-document', 'efd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-docs/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/my-docs/docs/tutorial-basics/create-a-page', 'd00'),
                exact: true
              },
              {
                path: '/my-docs/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/my-docs/docs/tutorial-basics/deploy-your-site', '3c7'),
                exact: true
              },
              {
                path: '/my-docs/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/my-docs/docs/tutorial-basics/markdown-features', '2ca'),
                exact: true
              },
              {
                path: '/my-docs/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/my-docs/docs/tutorial-extras/manage-docs-versions', '380'),
                exact: true
              },
              {
                path: '/my-docs/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/my-docs/docs/tutorial-extras/translate-your-site', '518'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/my-docs/',
    component: ComponentCreator('/my-docs/', 'b86'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
