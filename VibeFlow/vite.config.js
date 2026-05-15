import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Mounts our /api/* handlers as middleware in dev so the same code
// that runs as a Vercel serverless function also runs locally with
// `npm run dev`. Keeps the HF token strictly server-side.
function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      const apiHandlers = [
        { path: '/api/generate-image', file: '/api/generate-image.js' },
        { path: '/api/submit-request', file: '/api/submit-request.js' },
      ]

      for (const { path, file } of apiHandlers) {
        server.middlewares.use(path, async (req, res, next) => {
          try {
            const { default: handler } = await server.ssrLoadModule(file)
            await handler(req, res)
          } catch (err) {
            console.error(`[${path}] dev middleware error:`, err)
            if (!res.headersSent) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ code: 'DEV_HANDLER_ERROR', message: err.message }))
            } else {
              next(err)
            }
          }
        })
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load .env files so HF_TOKEN becomes available via process.env in the
  // dev middleware. Only server-scoped vars (no VITE_ prefix) are loaded
  // into process.env here.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of Object.keys(env)) {
    if (!key.startsWith('VITE_')) {
      process.env[key] = process.env[key] || env[key]
    }
  }

  return {
    plugins: [react(), apiDevMiddleware()],
    server: {
      port: 5173,
    },
  }
})
