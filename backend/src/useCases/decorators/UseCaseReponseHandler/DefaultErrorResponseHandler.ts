import { IApplicationError } from '../../../domain/errors'
import { AdditionalFieldsToLog, ILogger } from '../../contracts'
import { IUseCaseResponseHandlerStrategy } from '../LogUseCase'

type ExpectedResponse = IApplicationError

export class DefaultErrorResponseHandler
  implements IUseCaseResponseHandlerStrategy<ExpectedResponse>
{
  handle(props: {
    response: ExpectedResponse
    operationDescription: string
    logger: ILogger
    userId?: string
    additionalFieldsToLog: AdditionalFieldsToLog
  }): void {
    const { additionalFieldsToLog, response, operationDescription, logger, userId } = props

    const userRefInMessage = userId ? `user ${userId}` : 'some user'
    const reasonErrorMessage = response.reason.errorMessage(response.error)
    const logMessage =
      `Error when ${userRefInMessage} tried to ${operationDescription}: ` + reasonErrorMessage

    const additionalFields = {
      userId,
      ...additionalFieldsToLog
    }

    if (response.error.external) logger.errorReport(logMessage, additionalFields)
    else logger.warningReport(logMessage, additionalFields)

    logger.debugReport(JSON.stringify(response, undefined, 2), additionalFields)
  }
}
