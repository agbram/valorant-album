import { left } from '../../src/shared'
import { DeleteCardUseCase } from '../../src/useCases'
import { CardNotFoundError } from '../../src/useCases/errors'
import { SeededLocalCardRepository } from '../utils/seeds/SeededLocalCardRepository'

describe('DeleteCardUseCase', () => {
  let useCase: DeleteCardUseCase
  let repository: SeededLocalCardRepository

  beforeEach(() => {
    repository = SeededLocalCardRepository.withAllSeeds()
    useCase = new DeleteCardUseCase(repository)
  })

  describe('execute', () => {
    it('should delete the card in the repository', async () => {

      await useCase.execute({
        cardId: 'card-1',
      })

      const result = await repository.findById('card-1')

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value).toBeNull()
      }
    })
    it('should return not found error for non-existent card', async () => {

      const result = await useCase.execute({
        cardId: 'non-existent-card',
      })

      expect(result).toEqual(left(new CardNotFoundError('non-existent-card')))
    })
  })
})
