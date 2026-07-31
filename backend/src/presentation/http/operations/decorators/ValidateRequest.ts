import { ILogger } from '../../../../useCases/contracts'
import { left } from '../../../../shared'
import { HttpRequest, IHttpControllerOperation, IHttpValidator } from '../../contracts'
import { logError } from '../../helpers/index'

export const validateRequest = <RequestType extends HttpRequest>(
  ...validators: IHttpValidator<RequestType>[]
) => {
  return (
    _target: IHttpControllerOperation<RequestType>,
    _propertyKey: 'operate',
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value

    descriptor.value = function (request: RequestType, logger?: ILogger) {
      for (const validator of validators) {
        const validationResponse = validator.validate(request)
        if (validationResponse.isLeft()) {
          if (logger) logError(validationResponse.value, logger)
          return left(validationResponse.value.error)
        }
        request = validationResponse.value
      }

      return originalMethod.apply(this, [request, logger])
    }

    return descriptor
  }
}
