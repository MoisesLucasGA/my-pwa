import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    https: {
      key: fs.readFileSync('./192.168.0.6+1-key.pem'),
      cert: fs.readFileSync('./192.168.0.6+1.pem'),
    }
  },
  plugins: [tailwindcss(), react(), VitePWA({
    strategies: 'generateSW',
    registerType: "autoUpdate",
    manifest: {
      name: 'my-pwa',
      short_name: 'my-pwa',
      description: 'primeiro pwa',
      theme_color: '#ff0000',
      background_color: '#00ff00',
      orientation: 'portrait',
      start_url: '/',
      display: 'standalone',
      "icons": [
        {
          "src": "pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ]
    },

    workbox: {
      globPatterns: ['**/*.{tsx,ts,js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
    },
    includeAssets: ['src/assets/react.svg',],
    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})