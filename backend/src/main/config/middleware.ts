import { Express } from 'express'
import { bodyParser, encoding } from '../middleware'
import { setupHelmet } from '../middleware/helmet'
import cors from 'cors'

export const setupMiddleware = (app: Express): void => {
  setupHelmet(app)
  app.use(bodyParser)
  app.use(encoding)
  app.use(cors())
}
