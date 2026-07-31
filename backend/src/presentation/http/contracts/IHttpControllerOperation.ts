import { ILogger } from '../../../useCases/contracts'
import { Either } from '../../../shared'
import { ApplicationError } from '../../../shared/errors/types'
import { HttpResponse, HttpRequest } from './Http'

export type HttpControllerOperationResponse<SuccessBody = any> = Promise<
  Either<ApplicationError, HttpResponse<SuccessBody>>
>

export interface IHttpControllerOperation<RequestType extends HttpRequest = HttpRequest> {
  operate: (request: RequestType, logger?: ILogger) => HttpControllerOperationResponse
}
