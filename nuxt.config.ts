export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxtjs/google-fonts', '@nuxtjs/i18n'],
  css: ['@/assets/css/main.css', '@/assets/css/fonts.css'],
  googleFonts: {
    families: {
      Raleway: [400, 500, 600, 700, 800],
      Onest: [400, 500, 600, 700, 800]
    },
    display: 'swap',
  },
  i18n: {
    langDir: 'locales',
    locales: [
      { code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'ru',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'ru'
    },
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8000"
    }
  },
})
