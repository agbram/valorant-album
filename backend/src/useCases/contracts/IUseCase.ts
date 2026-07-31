import { AdditionalFieldsToLog, ILogger } from './ILogger.js'
import { ErrorProneResponse } from '../../domain/contracts/ErrorProneResponse.js'

export type UseCaseUtils = {
  logger?: ILogger
  additionalFieldsToLog?: AdditionalFieldsToLog
}

export interface IUseCase<Props = null, SuccessResponse = null> {
  execute(props: Props, utils?: UseCaseUtils): ErrorProneResponse<SuccessResponse>
}