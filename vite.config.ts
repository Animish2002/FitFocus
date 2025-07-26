// vite.config.js
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      // Ensure these assets exist in your 'public' folder or equivalent
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'FitFocus - Your Fitness Companion', // More descriptive name
        short_name: 'FitFocus', // Concise name for home screen
        description: 'Track your workouts, set goals for CAT Exam, and stay motivated with FitFocus.', // Clearer description
        // A common theme color for fitness apps is often a dark tone, or a vibrant accent.
        // Let's use a dark grey/black for a sleek look, and you can adjust to your brand's primary color.
        theme_color: '#1a1a1a', // Dark theme color (adjust to your app's main color)
        background_color: '#ffffff', // A common background for the splash screen
        display: 'standalone', // Makes the PWA feel more like a native app
        icons: [
          // Standard sizes for various devices and contexts
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
            // This is crucial for "maskable icons" on Android to adapt to various shapes
            src: 'https://res.cloudinary.com/dkv3bx51z/image/upload/v1753548580/FitFocus_o75x8a.png', // Often the same 512x512 icon is used for maskable
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          // You might want to include more icon sizes for broader compatibility and better appearance
          // on different platforms (e.g., Apple touch icons, smaller icons for notifications).
          // Examples (you'd need to generate these images):
          // {
          //   src: 'pwa-144x144.png',
          //   sizes: '144x144',
          //   type: 'image/png'
          // },
          // {
          //   src: 'pwa-72x72.png',
          //   sizes: '72x72',
          //   type: 'image/png'
          // },
          // {
          //   src: 'apple-touch-icon.png', // Typically 180x180
          //   sizes: '180x180',
          //   type: 'image/png',
          //   purpose: 'apple touch icon'
          // }
        ]
      }
    })
  ]
})