import { IPresentationError } from './IPresentationError'
import { IErrorReason } from '../../../shared/errors/reasons'
import { ReasonUnexpected } from '../../../shared/errors/reasons/reasonClasses/solutions'
import { SolutionError } from '../../../shared/errors/types'

export class ServerError implements IPresentationError {
  reason: IErrorReason

  constructor(private message?: string) {
    this.reason = new ReasonUnexpected()
  }

  get error(): SolutionError {
    return {
      external: true,
      name: 'ServerError',
      baseError: 'ServerError',
      solution: '',
      description: '',
      message: this.message || 'Unexpected error',
      reason: this.reason
    }
  }
}
