import { left, right } from '../../../shared/Either'
import { ILogger } from '../../../useCases/contracts'
import { DeleteCardUseCase } from '../../../useCases/DeleteCardUseCase'
import { HttpRequest } from '../contracts/Http'
import {
  HttpControllerOperationResponse,
  IHttpControllerOperation
} from '../contracts/IHttpControllerOperation'
import { noContent } from '../helpers/ResponseHandler'
import { ZodHttpValidator } from '../validators'
import { getCardParamsSchema, GetCardParamsSchema } from '../validators/CardSchemas'
import { validateRequest } from './decorators/ValidateRequest'

type DeleteCardRequest = HttpRequest<any, any, GetCardParamsSchema>
type DeleteCardResponse = HttpControllerOperationResponse<null>

export class DeleteCardOperation implements IHttpControllerOperation<DeleteCardRequest> {
  constructor(private deleteCardUseCase: DeleteCardUseCase) {}

  @validateRequest(new ZodHttpValidator(undefined, undefined, getCardParamsSchema))
  async operate(request: DeleteCardRequest, logger?: ILogger): DeleteCardResponse {
    const { id } = request.params
    const additionalFieldsToLog = {
      method: request.method,
      url: request.url
    }

    const result = await this.deleteCardUseCase.execute(
      {
        cardId: id,
      },
      { logger, additionalFieldsToLog }
    )

    if (result.isLeft()) {
      return left(result.value.error)
    }

    return right(noContent())
  }
}
