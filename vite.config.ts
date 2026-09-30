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
    rollupOptions: {
      output: {
        // Keep Firebase and core UI vendors in cacheable chunks.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
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
