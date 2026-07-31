import { AdditionalFieldsToLog, ILogger } from '../../contracts'
import { IUseCaseResponseHandlerStrategy } from '../LogUseCase'

type ExpectedResponse = { cardId: string }

export class DeleteCardSuccessResponseHandler
  implements IUseCaseResponseHandlerStrategy<ExpectedResponse>
{
  handle(props: {
    response: ExpectedResponse
    operationDescription: string
    logger: ILogger
    userId?: string
    additionalFieldsToLog: AdditionalFieldsToLog
  }): void {
    const { response, operationDescription, logger, userId, additionalFieldsToLog } = props

    const userRefInMessage = userId ? `User ${userId}` : 'Some user'
    const logMessage = `${userRefInMessage} requested to ${operationDescription} successfully.`

    const additionalFields = {
      userId,
      cardId: response.cardId,
      ...additionalFieldsToLog
    }

    logger.informationReport(logMessage, additionalFields)
  }
}
