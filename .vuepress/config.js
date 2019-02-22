module.exports = {
  title: 'Bot Builder Docs',
  description: 'Documentation for the Bot Builder TypeScript starter template',
  base: '/bot-builder-typescript-starter/',
  evergreen: true, // only build for modern browsers
  themeConfig: {
    sidebar: [
      ['/', 'Introduction'],
      '/docs/development',
      '/docs/architecture',
      '/docs/tests',
      '/docs/linting',
      '/docs/production',
    ],
  },
}
