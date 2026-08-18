import { HttpRequest } from '.'
import { Either } from '../../../shared'
import { IPresentationError } from '../errors/IPresentationError'

export interface IHttpValidator<RequestType extends HttpRequest = HttpRequest> {
  validate(request: RequestType): Either<IPresentationError, RequestType>
}
