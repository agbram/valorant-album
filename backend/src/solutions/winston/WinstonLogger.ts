import Logger from './logs/Winston'
import { AdditionalFieldsToLog, ILogger, OptionsLog } from '../../useCases/contracts'

export class WinstonLogger extends Logger implements ILogger {
  debugReport(message: string, additionalFields?: AdditionalFieldsToLog, optionsLog?: OptionsLog) {
    this.debug(message, additionalFields, optionsLog)
  }

  traceReport(message: string, additionalFields?: AdditionalFieldsToLog, optionsLog?: OptionsLog) {
    this.trace(message, additionalFields, optionsLog)
  }

  informationReport(
    message: string,
    additionalFields?: AdditionalFieldsToLog,
    optionsLog?: OptionsLog
  ) {
    this.info(message, additionalFields, optionsLog)
  }

  warningReport(
    message: string,
    additionalFields?: AdditionalFieldsToLog,
    optionsLog?: OptionsLog
  ) {
    this.warn(message, additionalFields, optionsLog)
  }

  errorReport(message: string, additionalFields?: AdditionalFieldsToLog, optionsLog?: OptionsLog) {
    this.error(message, additionalFields, optionsLog)
  }
}
