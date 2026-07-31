import { left, right } from '../../../shared/Either'
import { ILogger } from '../../../useCases/contracts'
import { CreateCardUseCase } from '../../../useCases/CreateCardUseCase'
import { HttpRequest } from '../contracts'
import {
  HttpControllerOperationResponse,
  IHttpControllerOperation
} from '../contracts/IHttpControllerOperation'
import { success } from '../helpers/ResponseHandler'
import { ZodHttpValidator } from '../validators'
import { createCardRequestSchema, CreateCardRequestSchema } from '../validators/CardSchemas'
import { CardViewModel } from '../viewModels'
import { CardViewModelMapper } from '../viewModels/CardViewModelMapper'
import { validateRequest } from './decorators/ValidateRequest'

type CreateCardRequest = HttpRequest<CreateCardRequestSchema, any, any>
type CreateCardResponse = HttpControllerOperationResponse<CardViewModel>

export class CreateCardOperation implements IHttpControllerOperation<CreateCardRequest> {
  constructor(private createCardUseCase: CreateCardUseCase) {}

  @validateRequest(new ZodHttpValidator(createCardRequestSchema, undefined, undefined))
  async operate(request: CreateCardRequest, logger?: ILogger): CreateCardResponse {
    const createProps = request.body
    const additionalFieldsToLog = {
      method: request.method,
      url: request.url
    }

    const result = await this.createCardUseCase.execute(
      {
        createProps,
      },
      { logger, additionalFieldsToLog }
    )

    if (result.isLeft()) {
      return left(result.value.error)
    }

    const cardViewModel = CardViewModelMapper.toViewModel(result.value.card)
    return right(success(cardViewModel, 201))
  }
}
