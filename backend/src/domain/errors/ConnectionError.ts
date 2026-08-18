import { IErrorReason } from '../../shared/errors/reasons/IErrorReason'
import { ReasonConnectionFailed } from '../../shared/errors/reasons/reasonClasses/solutions'
import { SolutionError } from '../../shared/errors/types'
import { IApplicationError } from './IApplicationError'

export class ConnectionError implements IApplicationError {
  reason: IErrorReason

  constructor(private solution: string, private description = 'Unexpected error') {
    this.reason = new ReasonConnectionFailed()
  }

  get error(): SolutionError {
    return {
      external: true,
      name: 'ConnectionError',
      baseError: 'ConnectionError',
      solution: this.solution,
      message: `Connection with ${this.solution} has failed.`,
      description: this.description,
      reason: this.reason
    }
  }
}
