import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(() => {
  const basePath = process.env.BASE_PATH ?? '/'

  return {
    base: basePath,
    plugins: [
      vue(),
      vuetify({ autoImport: true }),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        includeAssets: ['icons/app-icon.svg'],
        manifest: {
          name: 'Golf Matchplay',
          short_name: 'Matchplay',
          theme_color: '#002F6C',
          background_color: '#0B1020',
          display: 'standalone',
          start_url: basePath,
          scope: basePath,
          orientation: 'portrait',
          icons: [
            {
              src: 'icons/app-icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
    ssr: {
      noExternal: ['vuetify'],
    },
  }
})
