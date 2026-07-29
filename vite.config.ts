import { defineConfig } from 'vite'
import { geaPlugin } from '@geajs/vite-plugin'

export default defineConfig({
  plugins: [geaPlugin()],
  // Keep @geajs/core out of Vite's prebundle so the Gea plugin can resolve compiler-runtime.
  optimizeDeps: {
    exclude: ['@geajs/core'],
  },
  build: {
    modulePreload: { polyfill: false },
  },
})
