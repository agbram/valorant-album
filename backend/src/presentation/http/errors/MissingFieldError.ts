import { IPresentationError } from './IPresentationError'
import { IErrorReason } from '../../../shared/errors/reasons'
import { ReasonFieldMissing } from '../../../shared/errors/reasons/reasonClasses/domain/entities'
import { DomainError } from '../../../shared/errors/types'

export class MissingFieldError implements IPresentationError {
  reason: IErrorReason

  constructor(
    private entity: string,
    private key: string
  ) {
    this.reason = new ReasonFieldMissing()
  }

  get error(): DomainError {
    return {
      external: false,
      name: 'MissingFieldError',
      baseError: 'InvalidInputError',
      entity: this.entity,
      key: this.key,
      value: '',
      reason: this.reason
    }
  }
}
