import { Router } from 'express'
import { getCardRoutes, getCardRoutesV1 } from './cardRoutes'

export const getServiceRoutes = (): Router => {
  const router = Router()

  router.use('/cards', getCardRoutes())
  router.use('/v1/cards', getCardRoutesV1())
  router.use('/health', (req, res) => {
      return res.status(200).json("Funcionando!");
  })

  return router
}
