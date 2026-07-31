import { ListCardsUseCase } from '../../src/useCases'
import { SeededLocalCardRepository } from '../utils/seeds/SeededLocalCardRepository'

describe('ListCardsUseCase', () => {
  let useCase: ListCardsUseCase
  let repository: SeededLocalCardRepository

  beforeEach(() => {
    repository = SeededLocalCardRepository.withAllSeeds()
    useCase = new ListCardsUseCase(repository)
  })

  describe('execute', () => {
    it('should return all the registered cards', async () => {

      const result = await useCase.execute({
      })

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.cards.length).toBe(repository.size())
      }
    })
  })
})
