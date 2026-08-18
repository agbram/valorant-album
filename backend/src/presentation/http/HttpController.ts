import { ILogger } from '../../useCases/contracts'
import { HttpRequest, HttpResponse, IHttpControllerOperation } from './contracts'
import { ServerError } from './errors'
import { handleError, logError } from './helpers'

export class HttpController<RequestType extends HttpRequest = HttpRequest> {
  constructor(private controllerOp: IHttpControllerOperation<RequestType>) {}

  async handle(request: RequestType, logger?: ILogger): Promise<HttpResponse> {
    try {
      const responseOrError = await this.controllerOp.operate(request, logger)
      if (responseOrError.isRight()) return responseOrError.value
      return handleError(responseOrError.value)
    } catch (e) {
      const error = e as Error
      const serverError = new ServerError(error.message)
      if (logger) logError(serverError, logger)
      return handleError(serverError.error)
    }
  }
}
