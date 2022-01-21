import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';

export default defineUserConfig<DefaultThemeOptions>({
  title: 'Muban Todo MVC',
  description: 'A sample and tutorial on how to create the Todo MVC app in Muban',
  base: '/todo-mvc/',
  themeConfig: {
    navbar: [
      { text: 'Introduction', link: '/' },
      { text: 'Todo MVC Client', link: '/todo-mvc-client/' },
    ],
    repo: 'mubanjs/todo-mvc',
    docsDir: 'docs',
    // displayAllHeaders: true,
    sidebarDepth: 4,
    sidebar: {
      '/': ['README.md'],
      '/todo-mvc-client/': [
        'README.md',
        'todo-mvc-client-1',
        'todo-mvc-client-2',
        'todo-mvc-client-3',
      ],
    },
  },
  markdown: {
    extractHeaders: {
      level: [2, 3, 4],
    },
  },
});
