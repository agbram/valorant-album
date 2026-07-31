import { app } from './config/app'
import { logger } from './solutions'

app.listen(3000, () => {
  logger.info('[app] service up')
})
