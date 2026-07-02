/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wyw from '@wyw-in-js/vite'
import path from 'path'

// https://vite.dev/config/
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    wyw({
      include: ['**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript'],
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // The `three` core library is a single ~720 kB module graph that cannot be
    // sub-split via chunking; every other vendor is broken out below and sits
    // well under the default limit. Set the threshold just above three's
    // irreducible size so genuine regressions still surface.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split heavy third-party libraries into their own chunks so the
        // main bundle stays small and vendors can be cached independently.
        // Function form so shared deps (scheduler, react-reconciler, fiber
        // internals) land with their consumers instead of dragging lazy
        // chunks into the entry's static import graph.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (
            id.includes('@react-three') ||
            id.includes('postprocessing') ||
            id.includes('leva') ||
            id.includes('react-reconciler') ||
            id.includes('its-fine') ||
            id.includes('zustand') ||
            id.includes('suspend-react')
          ) {
            return 'three-helpers'
          }
          if (id.includes('/three/') || id.includes('three-stdlib')) {
            return 'three-core'
          }
          if (id.includes('firebase') || id.includes('@firebase')) {
            if (id.includes('firestore')) return 'firebase-firestore'
            if (id.includes('auth')) return 'firebase-auth'
            if (id.includes('storage')) return 'firebase-storage'
            return 'firebase-core'
          }
          if (id.includes('react-router')) return 'router-vendor'
          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor'
          }
          return undefined
        },
      },
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
})
