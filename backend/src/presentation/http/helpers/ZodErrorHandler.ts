import { ZodError } from 'zod'
import { IPresentationError, MissingFieldError, ValidationError } from '../errors/index'

export class ZodErrorHandler {
  static handleError(zodError: ZodError, entity: string): IPresentationError {
    const firstIssue = zodError.issues[0]
    const errorPath = firstIssue.path.join('.')
    const errorMessage = firstIssue.message

    // Check if it's a missing field error by checking the error message pattern
    // Missing fields typically have messages like "Invalid input: expected string, received undefined"
    if (firstIssue.code === 'invalid_type' && errorMessage.includes('received undefined')) {
      return new MissingFieldError(entity, errorPath)
    }

    // For all other validation errors, return ValidationError
    return new ValidationError(entity, errorPath, errorMessage)
  }
}
