import { left, right } from '../../../shared/Either'
import { ILogger } from '../../../useCases/contracts'
import { PatchQuantityUseCase } from '../../../useCases/PatchQuantityUseCase'
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
  PatchQuantitySchema
} from '../validators/CardSchemas'
import { CardViewModel } from '../viewModels'
import { CardViewModelMapper } from '../viewModels/CardViewModelMapper'
import { validateRequest } from './decorators/ValidateRequest'

type PatchQuantityRequest = HttpRequest<PatchQuantitySchema, any, GetCardParamsSchema>
type PatchQuantityResponse = HttpControllerOperationResponse<CardViewModel>

export class PatchQuantityOperation implements IHttpControllerOperation<PatchQuantityRequest> {
  constructor(private patchQuantityUseCase: PatchQuantityUseCase) {}

  @validateRequest(
    new ZodHttpValidator(PatchQuantitySchema, undefined, getCardParamsSchema)
  )
  async operate(request: PatchQuantityRequest, logger?: ILogger): PatchQuantityResponse {
    const cardId = request.params.id
    const updates = {quantidade: request.body.quantidade}
    const additionalFieldsToLog = {
      method: request.method,
      url: request.url
    }

    const result = await this.patchQuantityUseCase.execute(
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
