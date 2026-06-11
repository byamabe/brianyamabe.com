export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  nitro: {
    preset: 'cloudflare-pages',
  },
  typescript: {
    strict: true,
  },
  app: {
    head: {
      title: 'Brian Yamabe',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'The world of Brian Yamabe' },
      ],
    },
  },
})
