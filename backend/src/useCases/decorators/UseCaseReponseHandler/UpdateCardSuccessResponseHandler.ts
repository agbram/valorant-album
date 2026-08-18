import { Card, CardProps } from "../../../domain/EntityModule";
import { Diff } from "../../../shared";
import { ILogger, AdditionalFieldsToLog } from "../../contracts";
import { IUseCaseResponseHandlerStrategy } from "../LogUseCase";

type ExpectedResponse = { card: Card; diff: Diff<CardProps> };

export class UpdateCardSuccessResponseHandler
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
      JSON.stringify(response.diff, null, 2),
      additionalFields
    );
  }
}
