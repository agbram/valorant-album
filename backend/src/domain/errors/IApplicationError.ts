import { IErrorReason } from '../../shared/errors/reasons/IErrorReason'
import { ApplicationError } from '../../shared/errors/types'

export interface IApplicationError {
  readonly error: ApplicationError
  reason: IErrorReason
}
