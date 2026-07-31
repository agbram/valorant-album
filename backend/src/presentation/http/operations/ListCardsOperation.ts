import { left, right } from '../../../shared/Either'
import { ListCardsUseCase } from '../../../useCases/ListCardsUseCase'
import { HttpRequest } from '../contracts/Http'
import {
  HttpControllerOperationResponse,
  IHttpControllerOperation
} from '../contracts/IHttpControllerOperation'
import { success } from '../helpers/ResponseHandler'
import { ZodHttpValidator } from '../validators'
import { CardViewModel } from '../viewModels'
import { CardViewModelMapper } from '../viewModels/CardViewModelMapper'
import { validateRequest } from './decorators/ValidateRequest'

type ListCardsRequest = HttpRequest<any, any, any>
type ListCardsResponse = HttpControllerOperationResponse<CardViewModel[]>

export class ListCardsOperation implements IHttpControllerOperation<ListCardsRequest> {
  constructor(private listCardsUseCase: ListCardsUseCase) {}

  @validateRequest(new ZodHttpValidator(undefined, undefined, undefined))
  async operate(request: ListCardsRequest): ListCardsResponse {
    const additionalFieldsToLog = {
      method: request.method,
      url: request.url
    }

    const result = await this.listCardsUseCase.execute(
      {},
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
