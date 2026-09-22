import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import * as site from './src/data/site.js'
import * as projects from './src/data/projects.js'
import * as videos from './src/data/videos.js'
import { fallbackHtml, channelPage, sitemapXml, robotsTxt } from './scripts/seo-html.mjs'

/**
 * SITE URL
 * - On Vercel this is picked up automatically from VERCEL_PROJECT_PRODUCTION_URL.
 * - If you attach a custom domain, set VITE_SITE_URL in Vercel → Settings → Environment Variables
 *   (example: https://divyashakti.dev) and redeploy. Canonical, Open Graph, sitemap and JSON-LD all use it.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
const SITE_URL = (
  process.env.VITE_SITE_URL ||
  (vercelHost ? `https://${vercelHost}` : 'https://divyashakti.vercel.app')
).replace(/\/$/, '')

function seoFiles(env) {
  const data = { ...site, ...projects, ...videos }
  const verify = [
    env.VITE_GOOGLE_VERIFICATION && `<meta name="google-site-verification" content="${env.VITE_GOOGLE_VERIFICATION}" />`,
    env.VITE_BING_VERIFICATION && `<meta name="msvalidate.01" content="${env.VITE_BING_VERIFICATION}" />`,
  ]
    .filter(Boolean)
    .join('\n    ')
  return {
    name: 'seo-files',
    transformIndexHtml(html) {
      return html
        .replace('<!--SEO_FALLBACK-->', fallbackHtml(data, SITE_URL))
        .replace('<!--SEO_VERIFY-->', verify)
        .replaceAll('__SITE_URL__', SITE_URL)
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(SITE_URL) })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(SITE_URL) })
      this.emitFile({ type: 'asset', fileName: 'halchal-tej/index.html', source: channelPage(data, SITE_URL) })
    },
  }
}

/** `npm run dev` only: serves /api/contact with the same handler Vercel runs in production. */
function devApi(env) {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        let raw = ''
        req.on('data', (c) => (raw += c))
        req.on('end', async () => {
          try {
            Object.assign(process.env, env) // SMTP_* from .env (server-side only)
            req.body = raw ? JSON.parse(raw) : {}
            res.status = (code) => ((res.statusCode = code), res)
            res.json = (obj) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(obj))
            }
            const mod = await server.ssrLoadModule('/api/contact.js')
            await mod.default(req, res)
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, message: String(e.message || e) }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), seoFiles(loadEnv(mode, process.cwd(), '')), devApi(loadEnv(mode, process.cwd(), ''))],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
        },
      },
    },
  },
}))
