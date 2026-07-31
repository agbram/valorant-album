import { left, right } from '../../../shared/Either'
import { ILogger } from '../../../useCases/contracts'
import { UpdateCardUseCase } from '../../../useCases/UpdateCardUseCase'
import { HttpRequest } from '../contracts/Http'
import {
  HttpControllerOperationResponse,
  IHttpControllerOperation
} from '../contracts/IHttpControllerOperation'
import { success } from '../helpers/ResponseHandler'
import { ZodHttpValidator } from '../validators'
import {
  getCardParamsSchema,
  GetCardParamsSchema,
  updateCardRequestSchema,
  UpdateCardRequestSchema
} from '../validators/CardSchemas'
import { CardViewModel } from '../viewModels'
import { CardViewModelMapper } from '../viewModels/CardViewModelMapper'
import { validateRequest } from './decorators/ValidateRequest'

type UpdateCardRequest = HttpRequest<UpdateCardRequestSchema, any, GetCardParamsSchema>
type UpdateCardResponse = HttpControllerOperationResponse<CardViewModel>

export class UpdateCardOperation implements IHttpControllerOperation<UpdateCardRequest> {
  constructor(private updateCardUseCase: UpdateCardUseCase) {}

  @validateRequest(
    new ZodHttpValidator(updateCardRequestSchema, undefined, getCardParamsSchema)
  )
  async operate(request: UpdateCardRequest, logger?: ILogger): UpdateCardResponse {
    const cardId = request.params.id
    const updates = request.body
    const additionalFieldsToLog = {
      method: request.method,
      url: request.url
    }

    const result = await this.updateCardUseCase.execute(
      {
        cardId,
        updates
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
