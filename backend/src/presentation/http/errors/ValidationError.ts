import { IPresentationError } from './IPresentationError'
import { IErrorReason } from '../../../shared/errors/reasons'
import { ReasonCustom } from '../../../shared/errors/reasons/reasonClasses/domain/useCases'
import { DomainError } from '../../../shared/errors/types'

export class ValidationError implements IPresentationError {
  reason: IErrorReason

  constructor(
    private entity: string,
    private key: string,
    private message: string
  ) {
    this.reason = new ReasonCustom(message)
  }

  get error(): DomainError {
    return {
      external: false,
      name: 'ValidationError',
      baseError: 'InvalidInputError',
      entity: this.entity,
      key: this.key,
      value: this.message,
      reason: this.reason
    }
  }
}
