import { HttpErrorHandler } from '../../../shared/errors/http'
import { ApplicationError } from '../../../shared/errors/types'
import { HttpResponse } from '../contracts'
import { ServerError } from '../errors'
import { ErrorViewModel } from '../viewModels'

export const success = <T = unknown>(data: T, statusCode = 200): HttpResponse<T> => ({
  statusCode,
  body: data
})

export const noContent = (): HttpResponse<null> => success(null, 204)

export const handleError = (error: ApplicationError): HttpResponse<ErrorViewModel> => {
  // @ts-ignore
  return HttpErrorHandler.handleHttpErrorResponse[error.baseError](error)
}

export const serverError = (message?: string) => handleError(new ServerError(message).error)
