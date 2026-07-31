import { z } from 'zod'
import { HttpRequest, IHttpValidator } from '../contracts'
import { Either, left, right } from '../../../shared'
import { IPresentationError } from '../errors'
import { ValidationError } from '../errors/ValidationError'
import { ZodErrorHandler } from '../helpers/ZodErrorHandler'

export class ZodHttpValidator<RequestType extends HttpRequest>
  implements IHttpValidator<RequestType>
{
  constructor(
    private bodySchema?: z.ZodSchema<RequestType extends HttpRequest<infer Body> ? Body : never>,
    private querySchema?: z.ZodSchema<
      RequestType extends HttpRequest<any, infer Query> ? Query : never
    >,
    private paramsSchema?: z.ZodSchema<
      RequestType extends HttpRequest<any, any, infer Params> ? Params : never
    >
  ) {}

  validate(request: RequestType): Either<IPresentationError, RequestType> {
    try {
      const validatedRequest = { ...request }

      if (this.bodySchema) {
        const bodyResult = this.bodySchema.safeParse(request.body)
        if (!bodyResult.success) {
          return left(ZodErrorHandler.handleError(bodyResult.error, 'Request Body'))
        }
        validatedRequest.body = bodyResult.data
      }

      if (this.querySchema) {
        const queryResult = this.querySchema.safeParse(request.query)
        if (!queryResult.success) {
          return left(ZodErrorHandler.handleError(queryResult.error, 'Query Parameters'))
        }
        validatedRequest.query = queryResult.data
      }

      if (this.paramsSchema) {
        const paramsResult = this.paramsSchema.safeParse(request.params)
        if (!paramsResult.success) {
          return left(ZodErrorHandler.handleError(paramsResult.error, 'Path Parameters'))
        }
        validatedRequest.params = paramsResult.data
      }

      return right(validatedRequest)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Validation failed'
      return left(new ValidationError('Request Validation', 'validation', errorMessage))
    }
  }
}
