import { ILogger, AdditionalFieldsToLog } from '../../contracts'
import { IUseCaseResponseHandlerStrategy } from '../LogUseCase'

type ExpectedResponse = any

export class DefaultSuccessResponseHandler
  implements IUseCaseResponseHandlerStrategy<ExpectedResponse>
{
  handle(props: {
    response: ExpectedResponse
    operationDescription: string
    logger: ILogger
    userId?: string
    additionalFieldsToLog: AdditionalFieldsToLog
  }): void {
    const { operationDescription, logger, userId, additionalFieldsToLog } = props

    const userRefInMessage = userId ? `User ${userId}` : 'Some user'
    const logMessage = `${userRefInMessage} requested to ${operationDescription} successfully.`

    const additionalFields = {
      userId,
      ...additionalFieldsToLog
    }

    logger.informationReport(logMessage, additionalFields)
  }
}
