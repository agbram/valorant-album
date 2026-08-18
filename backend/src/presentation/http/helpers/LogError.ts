import { DefaultErrorResponseHandler } from '../../../useCases/decorators/UseCaseReponseHandler'
import { IApplicationError } from '../../../domain/errors'
import { ILogger } from '../../../useCases/contracts'

export const logError = (error: IApplicationError, logger: ILogger) => {
  const errorHandler = new DefaultErrorResponseHandler()
  errorHandler.handle({
    response: error,
    logger,
    additionalFieldsToLog: {},
    operationDescription: ''
  })
}
