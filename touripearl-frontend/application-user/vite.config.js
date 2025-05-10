import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // Enable PWA during development
      },
      manifest: {
        name: 'TouriPearl',
        short_name: 'TouriPearl',
        description: 'Connect travelers with guides in Sri Lanka.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/logo.jpg',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo.jpg',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components/'),
      '@utils': resolve(__dirname, 'src/utils/'),
      '@layouts': resolve(__dirname, 'src/components/user-layouts/'),
      '@admin': resolve(__dirname, 'src/pages/admin/pages'),
      '@guide': resolve(__dirname, 'src/pages/guide/pages'),
      '@tourist': resolve(__dirname, 'src/pages/tourist/pages'),
      '@guest': resolve(__dirname, 'src/pages/guest/pages'),
    },
  },
  define: {
    global: "window", // Polyfill for global object
  },
})