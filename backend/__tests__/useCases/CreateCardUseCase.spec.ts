import { left } from "../../src/shared";
import { CreateCardUseCase } from "../../src/useCases";
import { CardDuplicateError } from "../../src/useCases/errors";
import { CardBuilder } from "../utils/builders";
import { SeededLocalCardRepository } from "../utils/seeds/SeededLocalCardRepository";

describe("CreateCardUseCase", () => {
  let useCase: CreateCardUseCase;
  let repository: SeededLocalCardRepository;

  beforeEach(() => {
    repository = SeededLocalCardRepository.withAllSeeds();
    useCase = new CreateCardUseCase(repository);
  });

  describe("execute", () => {
    it("should create the new card in the repository", async () => {
      const createProps = CardBuilder.create()
        .withId("new-card")
        .withNumero(1)
        .withNome("Default")
        .withQuantidade(1)
        .withCategoria("Default")
        .withRaridade("Default")
        .withDescricao("Default")
        .buildForCreate();

      const now = new Date("2024-01-01T00:00:00.000Z");

      await useCase.execute({
        createProps,
        now,
      });

      const result = await repository.findById("new-card");

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const card = result.value;
        expect(card?.props).toEqual(
          CardBuilder.create()
            .withId("new-card")
            .withNumero(1)
            .withNome("Default")
            .withQuantidade(1)
            .withCategoria("Default")
            .withRaridade("Default")
            .withDescricao("Default")
            .withTimestamps(now)
            .build().props,
        );
      }
    });

    it("should return the new card", async () => {
      const createProps = CardBuilder.create()
        .withId("new-card")
        .withNumero(1)
        .withNome("Default")
        .withQuantidade(1)
        .withCategoria("Default")
        .withRaridade("Default")
        .withDescricao("Default")
        .buildForCreate();

      const now = new Date("2024-01-01T00:00:00.000Z");

      const result = await useCase.execute({
        createProps,
        now,
      });

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const card = result.value.card;
        expect(card.props).toEqual(
          CardBuilder.create()
            .withId("new-card")
            .withNumero(1)
            .withNome("Default")
            .withQuantidade(1)
            .withCategoria("Default")
            .withRaridade("Default")
            .withDescricao("Default")
            .withTimestamps(now)
            .build().props,
        );
      }
    });

    it("should return duplicate error for existent card", async () => {
      const createProps = CardBuilder.create()
        .withId("card-1")
        .withNumero(1)
        .withNome("Default")
        .withQuantidade(1)
        .withCategoria("Default")
        .withRaridade("Default")
        .withDescricao("Default")
        .buildForCreate();

      const now = new Date("2024-01-01T00:00:00.000Z");

      const result = await useCase.execute({
        createProps,
        now,
      });

      expect(result).toEqual(left(new CardDuplicateError("card-1")));
    });
  });
});
