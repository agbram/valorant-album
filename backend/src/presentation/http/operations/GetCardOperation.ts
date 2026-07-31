import { left, right } from '../../../shared/Either'
import { ILogger } from '../../../useCases/contracts'
import { GetCardUseCase } from '../../../useCases/GetCardUseCase'
import { HttpRequest } from '../contracts/Http'
import {
  HttpControllerOperationResponse,
  IHttpControllerOperation
} from '../contracts/IHttpControllerOperation'
import { success } from '../helpers/ResponseHandler'
import { ZodHttpValidator } from '../validators'
import { getCardParamsSchema, GetCardParamsSchema } from '../validators/CardSchemas'
import { CardViewModel } from '../viewModels'
import { CardViewModelMapper } from '../viewModels/CardViewModelMapper'
import { validateRequest } from './decorators/ValidateRequest'

type GetCardRequest = HttpRequest<any, any, GetCardParamsSchema>
type GetCardResponse = HttpControllerOperationResponse<CardViewModel>

export class GetCardOperation implements IHttpControllerOperation<GetCardRequest> {
  constructor(private getCardUseCase: GetCardUseCase) {}

  @validateRequest(new ZodHttpValidator(undefined, undefined, getCardParamsSchema))
  async operate(request: GetCardRequest, logger?: ILogger): GetCardResponse {
    const { id } = request.params
    const additionalFieldsToLog = {
      method: request.method,
      url: request.url
    }

    const result = await this.getCardUseCase.execute(
      {
        cardId: id,
      },
      { logger, additionalFieldsToLog }
    )

    if (result.isLeft()) {
      return left(result.value.error)
    }

    const cardViewModel = CardViewModelMapper.toViewModel(result.value.card)
    return right(success(cardViewModel))
  }
}
