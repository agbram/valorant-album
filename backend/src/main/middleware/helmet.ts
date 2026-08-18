import { Express } from 'express'
import helmet from 'helmet'

export const setupHelmet = (app: Express): void => {
  // Remove Express fingerprint
  app.disable('x-powered-by')
  app.set('etag', false)

  // Apply helmet with custom policies
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'none'"]
        }
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      xssFilter: true,
      noSniff: true,
      hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true
      }
    })
  )

  // Add missing headers manually
  app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    res.setHeader('Server', 'secure')
    next()
  })
}
