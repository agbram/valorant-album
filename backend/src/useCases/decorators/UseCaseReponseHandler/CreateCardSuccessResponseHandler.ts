import { Card } from "../../../domain/EntityModule";
import { ILogger, AdditionalFieldsToLog } from "../../contracts";
import { IUseCaseResponseHandlerStrategy } from "../LogUseCase";

type ExpectedResponse = { card: Card };

export class CreateCardSuccessResponseHandler
  implements IUseCaseResponseHandlerStrategy<ExpectedResponse>
{
  handle(props: {
    response: ExpectedResponse;
    operationDescription: string;
    logger: ILogger;
    userId?: string;
    additionalFieldsToLog: AdditionalFieldsToLog;
  }): void {
    const {
      response,
      operationDescription,
      logger,
      userId,
      additionalFieldsToLog,
    } = props;

    const userRefInMessage = userId ? `User ${userId}` : "Some user";
    const logMessage = `${userRefInMessage} requested to ${operationDescription} successfully.`;

    const additionalFields = {
      userId,
      cardId: response.card.props.id,
      ...additionalFieldsToLog,
    };

    logger.informationReport(logMessage, additionalFields);
    logger.debugReport(
      JSON.stringify(response.card.props, null, 2),
      additionalFields
    );
  }
}
