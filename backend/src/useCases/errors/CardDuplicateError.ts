import { IErrorReason } from '../../shared/errors/reasons/IErrorReason'
import { ReasonEntityDuplicate } from '../../shared/errors/reasons/reasonClasses/domain/useCases'
import { DomainError } from '../../shared/errors/types'
import { IApplicationError } from '../../domain/errors/IApplicationError'

export class CardDuplicateError implements IApplicationError {
  reason: IErrorReason

  constructor(private cardId: string) {
    this.reason = new ReasonEntityDuplicate()
  }

  get error(): DomainError {
    return {
      external: false,
      name: 'CardDuplicateError',
      baseError: 'DuplicateError',
      entity: 'Card',
      key: 'id',
      value: this.cardId,
      reason: this.reason
    }
  }
}
