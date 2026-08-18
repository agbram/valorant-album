import { IErrorReason } from '../../../shared/errors/reasons'
import { DomainError, SolutionError } from '../../../shared/errors/types'

export interface IPresentationError {
  readonly error: DomainError | SolutionError
  reason: IErrorReason
}
