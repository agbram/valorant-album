import type { Either } from '../../shared/Either.js'
import { IApplicationError } from '../errors/IApplicationError.js'

export type ErrorProneResponse<Success> = Promise<Either<IApplicationError, Success>>
