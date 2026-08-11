import { z } from 'zod'
import { left, right } from '../../../shared/Either'
import { ListCardsUseCase } from '../../../useCases/ListCardsUseCase'
import { HttpRequest } from '../contracts/Http'
import {
  HttpControllerOperationResponse,
  IHttpControllerOperation
} from '../contracts/IHttpControllerOperation'
import { success } from '../helpers/ResponseHandler'
import { ListCardsQuerySchema, ZodHttpValidator } from '../validators'
import { CardViewModel } from '../viewModels'
import { CardViewModelMapper } from '../viewModels/CardViewModelMapper'
import { validateRequest } from './decorators/ValidateRequest'

type ListCardsResponse = HttpControllerOperationResponse<CardViewModel[]>
type ListCardsRequest = HttpRequest<any, z.infer<typeof ListCardsQuerySchema>, any>

export class ListCardsOperation implements IHttpControllerOperation<ListCardsRequest> {
  constructor(private listCardsUseCase: ListCardsUseCase) {}

@validateRequest(new ZodHttpValidator(undefined, ListCardsQuerySchema, undefined))
  async operate(request: ListCardsRequest): ListCardsResponse {
    const additionalFieldsToLog = {
      method: request.method,
      url: request.url
    }

    const result = await this.listCardsUseCase.execute(
      {filters: request.query},
      {additionalFieldsToLog }
    )

    if (result.isLeft()) {
      return left(result.value.error)
    }

    return right(
      success(result.value.cards.map(card => CardViewModelMapper.toViewModel(card)))
    )
  }
}
