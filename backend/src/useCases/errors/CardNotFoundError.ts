import { IErrorReason } from '../../shared/errors/reasons/IErrorReason'
import { ReasonEntityNotFound } from '../../shared/errors/reasons/reasonClasses/domain/useCases'
import { DomainError } from '../../shared/errors/types'
import { IApplicationError } from '../../domain/errors/IApplicationError'

export class CardNotFoundError implements IApplicationError {
  reason: IErrorReason

  constructor(private cardId: string) {
    this.reason = new ReasonEntityNotFound()
  }

  get error(): DomainError {
    return {
      external: false,
      name: 'CardNotFoundError',
      baseError: 'NotFoundError',
      entity: 'Card',
      key: 'id',
      value: this.cardId,
      reason: this.reason
    }
  }
}
