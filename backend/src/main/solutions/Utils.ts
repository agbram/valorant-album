import { WinstonLogger } from '../../solutions/winston'
import { containerName, enableDebug, hostName, logToFile, serviceName } from '../config/env'

export const logger = new WinstonLogger({
  serviceName,
  containerName,
  hostName,
  logToFile,
  logLevel: enableDebug ? 'TRACE' : 'INFO'
})
