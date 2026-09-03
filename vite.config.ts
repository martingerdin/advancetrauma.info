import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import type { Connect, Plugin, PreviewServer, ViteDevServer } from 'vite'
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

/**
 * Serve public/presentations/<slug>/index.html for directory-style URLs.
 * Without this, Vite’s SPA fallback returns the main site for those paths.
 */
function presentationsFolderIndex(): Plugin {
  const attach = (server: ViteDevServer | PreviewServer) => {
    const root = server.config.root
    const outDir = path.resolve(root, server.config.build.outDir)

    const middleware: Connect.NextHandleFunction = (req, res, next) => {
      const pathname = (req.url ?? '').split('?')[0]
      const match = pathname.match(/^\/presentations\/([^/]+)(\/?)$/)
      if (!match) {
        next()
        return
      }

      const slug = match[1]
      const candidates = [
        path.join(root, 'public', 'presentations', slug, 'index.html'),
        path.join(outDir, 'presentations', slug, 'index.html'),
      ]
      const indexFile = candidates.find((candidate) => fs.existsSync(candidate))
      if (!indexFile) {
        next()
        return
      }

      // Relative asset URLs in the deck need a trailing slash.
      if (!match[2]) {
        const query = (req.url ?? '').includes('?') ? '?' + (req.url ?? '').split('?')[1] : ''
        res.statusCode = 301
        res.setHeader('Location', `/presentations/${slug}/${query}`)
        res.end()
        return
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      fs.createReadStream(indexFile).pipe(res)
    }

    server.middlewares.use(middleware)
  }

  return {
    name: 'presentations-folder-index',
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

export default defineConfig({
  plugins: [geaPlugin(), presentationsFolderIndex()],
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
