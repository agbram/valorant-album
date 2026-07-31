import { left } from '../../src/shared'
import { GetCardUseCase } from '../../src/useCases'
import { CardNotFoundError } from '../../src/useCases/errors'
import { SeededLocalCardRepository } from '../utils/seeds/SeededLocalCardRepository'

describe('GetCardUseCase', () => {
  let useCase: GetCardUseCase
  let repository: SeededLocalCardRepository

  beforeEach(() => {
    repository = SeededLocalCardRepository.withAllSeeds()
    useCase = new GetCardUseCase(repository)
  })

  describe('execute', () => {
    it('should return an existing card', async () => {

      const result = await useCase.execute({
        cardId: 'card-1',
      })

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        const card = result.value.card
        expect(card).not.toBeNull()
        expect(card.props.id).toBe('card-1')
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
