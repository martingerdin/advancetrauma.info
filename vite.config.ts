import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import { geaPlugin } from '@geajs/vite-plugin'

function git(command: string): string {
  try {
    return execSync(`git ${command}`, { encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

const commitSha = git('rev-parse HEAD')
const commitShort = git('rev-parse --short HEAD')
const commitDate = git('log -1 --format=%cI')

export default defineConfig({
  plugins: [geaPlugin()],
  define: {
    __SITE_COMMIT_SHA__: JSON.stringify(commitSha),
    __SITE_COMMIT_SHORT__: JSON.stringify(commitShort),
    __SITE_COMMIT_DATE__: JSON.stringify(commitDate),
  },
  // Keep @geajs/core out of Vite's prebundle so the Gea plugin can resolve compiler-runtime.
  optimizeDeps: {
    exclude: ['@geajs/core'],
  },
  build: {
    modulePreload: { polyfill: false },
  },
})
