import { Card } from "../../../domain/EntityModule";
import { AdditionalFieldsToLog, ILogger } from "../../contracts";
import { IUseCaseResponseHandlerStrategy } from "../LogUseCase";

type ExpectedResponse = { entities: Card[] };

export class ListEntitiesSuccessResponseHandler
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
      count: response.entities.length,
      ...additionalFieldsToLog,
    };

    logger.informationReport(logMessage, additionalFields);
  }
}
