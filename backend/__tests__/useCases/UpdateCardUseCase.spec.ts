import { left } from "../../src/shared";
import { UpdateCardUseCase } from "../../src/useCases";
import { CardNotFoundError } from "../../src/useCases/errors";
import { CardBuilder } from "../utils/builders";
import { SeededLocalCardRepository } from "../utils/seeds/SeededLocalCardRepository";

describe("UpdateCardUseCase", () => {
  let useCase: UpdateCardUseCase;
  let repository: SeededLocalCardRepository;

  beforeEach(() => {
    repository = SeededLocalCardRepository.withAllSeeds();
    useCase = new UpdateCardUseCase(repository);
  });

  describe("execute", () => {
    it("should update the card in the repository", async () => {
      const now = new Date("2024-01-02T00:00:00.000Z");

      await useCase.execute({
        cardId: "card-1",
        updates: { quantidade: 1, descricao: "nova descricao" },
        now,
      });

      const result = await repository.findById("card-1");

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const card = result.value;
        expect(card?.props).toEqual(
          CardBuilder.create()
            .withId("card-1")
            .withNumero(1)
            .withNome("Default - 1")
            .withQuantidade(1)
            .withCategoria("Default")
            .withRaridade("Default")
            .withDescricao("nova descricao")
            .withUpdatedAt(now)
            .build().props,
        );
      }
    });

    it("should return the updated card and the diffs", async () => {
      const now = new Date("2024-01-02T00:00:00.000Z");

      const result = await useCase.execute({
        cardId: "card-1",
        updates: { descricao: "Default" },
        now,
      });

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const { card, diff } = result.value;
        expect(card.props).toEqual(
          CardBuilder.create()
            .withId("card-1")
            .withNumero(1)
            .withNome("Default - 1")
            .withQuantidade(1)
            .withCategoria("Default")
            .withRaridade("Default")
            .withDescricao("Default")
            .withUpdatedAt(now)
            .build().props,
        );
        expect(diff).toEqual({
          updatedAt: now.toISOString(),
        });
      }
    });

    it("should return not found error for non-existent card", async () => {
      const now = new Date("2024-01-02T00:00:00.000Z");

      const result = await useCase.execute({
        cardId: "non-existent-card",
        updates: { descricao: "Default" },
        now,
      });

      expect(result).toEqual(left(new CardNotFoundError("non-existent-card")));
    });
  });
});
