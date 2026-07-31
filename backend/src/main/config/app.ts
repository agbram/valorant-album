import express from 'express'
import { getServiceRoutes } from '../routes'

import { setupMiddleware } from './middleware'

const app = express()

setupMiddleware(app)

app.use(getServiceRoutes())

export { app }
