// Reminder: Install express with `npm install express`
import { Router } from 'express'
import { adaptRoute } from './adapters'
import { cardContainer } from '../container/CardContainer'

// Get all operations from the DI container
const operations = cardContainer.getOperations()

export const getCardRoutes = (): Router => {
  const router = Router()

  router.get('/', 
    adaptRoute(operations.listCard)
  )
  router.post('/', 
    adaptRoute(operations.createCard)
  )
  router.get('/:id', 
    adaptRoute(operations.getCard)
  )
  router.put('/:id', 
    adaptRoute(operations.updateCard)
  )
  router.delete('/:id', 
    adaptRoute(operations.deleteCard)
  )
  router.patch('/changeQuantity/:id',
    adaptRoute(operations.patchQuantity)
  )

  return router
}

export const getCardRoutesV1 = (): Router => {
  const router = Router()

  router.get('/', 
    adaptRoute(operations.listCard)
  )
  router.post('/', 
    adaptRoute(operations.createCard)
  )
  router.get('/:id', 
    adaptRoute(operations.getCard)
  )
  router.put('/:id', 
    adaptRoute(operations.updateCard)
  )
  router.delete('/:id', 
    adaptRoute(operations.deleteCard)
  )
    router.patch('/changeQuantity/:id',
    adaptRoute(operations.patchQuantity)
  )

  return router
}

