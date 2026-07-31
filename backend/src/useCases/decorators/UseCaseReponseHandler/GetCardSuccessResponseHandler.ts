import { Card } from "../../../domain/EntityModule";
import { AdditionalFieldsToLog, ILogger } from "../../contracts";
import { IUseCaseResponseHandlerStrategy } from "../LogUseCase";

type ExpectedResponse = { entity: Card };

export class GetEntitySuccessResponseHandler
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
      entityId: response.entity.props.id,
      ...additionalFieldsToLog,
    };

    logger.informationReport(logMessage, additionalFields);
  }
}
