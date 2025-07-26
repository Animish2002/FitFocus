// vite.config.js
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa' // Make sure to import VitePWA
import tailwindcss from "@tailwindcss/vite" // Your TailwindCSS plugin
import path from "path" // Import 'path' module for alias resolution

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), // TailwindCSS plugin
    VitePWA({ // VitePWA plugin configuration
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'FitFocus - Your Fitness Companion',
        short_name: 'FitFocus',
        description: 'Track your workouts, set goals, and stay motivated with FitFocus.',
        theme_color: '#1a1a1a', // Example dark theme color
        background_color: '#ffffff', // Example splash screen background color
        display: 'standalone',
        icons: [
          {
            src: 'https://res.cloudinary.com/dkv3bx51z/image/upload/v1753548580/FitFocus_o75x8a.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://res.cloudinary.com/dkv3bx51z/image/upload/v1753548580/FitFocus_o75x8a.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'https://res.cloudinary.com/dkv3bx51z/image/upload/v1753548580/FitFocus_o75x8a.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: { // Added workbox configuration for better asset matching
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json,webmanifest}'],
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})