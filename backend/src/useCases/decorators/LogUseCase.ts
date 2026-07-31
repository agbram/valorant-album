import { ErrorProneResponse } from '../../domain/contracts'
import { IApplicationError } from '../../domain/errors'
import { ILogger, AdditionalFieldsToLog, IUseCase, UseCaseUtils } from '../contracts'
import {
  DefaultErrorResponseHandler,
  DefaultSuccessResponseHandler
} from './UseCaseReponseHandler'

export interface IUseCaseResponseHandlerStrategy<ResponseType = any> {
  handle: (props: {
    response: ResponseType
    operationDescription: string
    logger: ILogger
    userId: string
    additionalFieldsToLog: AdditionalFieldsToLog
  }) => void
}

export const logUseCase = <SuccessResponse = any>(responseHandlers?: {
  success?: IUseCaseResponseHandlerStrategy<SuccessResponse>
  error?: IUseCaseResponseHandlerStrategy<IApplicationError>
}) => {
  const successResponseHandler = responseHandlers?.success || new DefaultSuccessResponseHandler()
  const errorResponseHandler = responseHandlers?.error || new DefaultErrorResponseHandler()

  return (
    target: IUseCase<any, SuccessResponse>,
    _propertyKey: 'execute',
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (props: any, utils?: UseCaseUtils) {
      const logger = utils?.logger
      const additionalFieldsToLog = utils?.additionalFieldsToLog

      const useCaseResponse = (await originalMethod.apply(this, [props, utils])) as Awaited<
        ErrorProneResponse<SuccessResponse>
      >

      if (logger) {
        const className = target.constructor.name
        const operationDescription = className
          .replace('UseCase', '')
          .replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`)
          .trim()

        const responseHandler = useCaseResponse.isRight()
          ? successResponseHandler
          : errorResponseHandler

        responseHandler.handle({
          // @ts-ignore
          response: useCaseResponse.value,
          logger,
          additionalFieldsToLog: additionalFieldsToLog || {},
          operationDescription,
        })
      }

      return useCaseResponse
    }

    return descriptor
  }
}
