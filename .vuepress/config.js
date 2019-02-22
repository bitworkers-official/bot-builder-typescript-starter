const isDev = process.env.NODE_ENV !== 'production'
module.exports = {
  title: 'Bot Builder Docs',
  description: 'Documentation for the Bot Builder TypeScript starter template',
  base: isDev ? '/' : '/bot-builder-typescript-starter/',
  evergreen: true, // only build for modern browsers
  themeConfig: {
    repo: 'bitworkers-official/bot-builder-typescript-starter',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',
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
