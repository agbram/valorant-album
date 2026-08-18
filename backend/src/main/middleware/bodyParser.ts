import { json, urlencoded } from 'express'

export const bodyParser = json({ limit: '50mb' })
export const encoding = urlencoded({ limit: '50mb', extended: true })
