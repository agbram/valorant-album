import { LocalCardRepository } from "../../../src/solutions/localRepositories";
import { CardBuilder } from "../../utils/builders";
import { SeededLocalCardRepository, cardSeeds } from "../../utils/seeds";

describe("LocalCardRepository", () => {
  describe("Constructor", () => {
    it("should create an empty repository when no initial data is provided", () => {
      const repository = new LocalCardRepository();

      expect(repository.size()).toBe(0);
    });

    it("should create a repository with initial data when provided", () => {
      const initialEntities = CardBuilder.create().buildMany(3, "test");
      const repository = new LocalCardRepository(initialEntities);

      expect(repository.size()).toBe(3);
    });

    it("should seed repository with provided entities", () => {
      const repository = SeededLocalCardRepository.withAllSeeds();

      expect(repository.size()).toBe(cardSeeds.length);
    });
  });

  describe("create", () => {
    let repository: LocalCardRepository;

    beforeEach(() => {
      repository = SeededLocalCardRepository.empty();
    });

    it("should create a card successfully", async () => {
      const card = CardBuilder.create().build();

      const result = await repository.create(card);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeNull();
      expect(repository.size()).toBe(1);
    });

    it("should allow creating entities with duplicate IDs (no business logic validation)", async () => {
      const card1 = CardBuilder.create().withId("1").build();
      const card2 = CardBuilder.create().withId("1").build();

      await repository.create(card1);
      const result = await repository.create(card2);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeNull();
      expect(repository.size()).toBe(1); // Second card overwrites the first
    });
  });

  describe("findById", () => {
    let repository: LocalCardRepository;

    beforeEach(() => {
      repository = SeededLocalCardRepository.withAllSeeds();
    });

    it("should find an existing card by ID", async () => {
      const result = await repository.findById("card-1");

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).not.toBeNull();
        expect(result.value?.props.id).toBe("card-1");
      }
    });

    it("should return null for non-existent card", async () => {
      const result = await repository.findById("non-existent-card");

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeNull();
    });

    it("should return card with all properties", async () => {
      const result = await repository.findById("card-1");

      expect(result.isRight()).toBe(true);
      if (result.isRight() && result.value) {
        expect(result.value.props).toMatchObject({
          id: "card-1",
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      }
    });
  });

  describe("findAll", () => {
    it("should return empty array for empty repository", async () => {
      const repository = SeededLocalCardRepository.empty();

      const result = await repository.findAll();

      expect(result.isRight()).toBe(true);
      expect(result.value).toEqual([]);
    });

    it("should return all entities in repository", async () => {
      const repository = SeededLocalCardRepository.withMultipleEntities(3);

      const result = await repository.findAll();

      expect(result.isRight()).toBe(true);
      expect(result.value).toHaveLength(3);
    });

    it("should return all seeded entities", async () => {
      const repository = SeededLocalCardRepository.withAllSeeds();

      const result = await repository.findAll();

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(cardSeeds.length);
        const ids = result.value.map((b) => b.props.id);

        expect(ids).toContain("card-1");
        expect(ids).toContain("card-2");
        expect(ids).toContain("card-3");
        expect(ids).toContain("card-4");
        expect(ids).toContain("card-5");
      }
    });
  });

  describe("update", () => {
    let repository: LocalCardRepository;

    beforeEach(() => {
      repository = SeededLocalCardRepository.withAllSeeds();
    });

    it("should update an existing card successfully", async () => {
      const updateData = CardBuilder.create()
        .withId("card-1")
        .withNumero(1)
        .withNome("Updated Card 1")
        .withQuantidade(2)
        .withCategoria("Default")
        .withRaridade("Default")
        .withDescricao("new-Default")
        .withUpdatedAt(new Date("2024-02-01T00:00:00.000Z"))
        .build();

      const result = await repository.update("card-1", updateData);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeNull();

      // Verify the card was updated
      const updatedCard = await repository.findById("card-1");
      if (updatedCard.isRight() && updatedCard.value) {
        expect(updatedCard.value.props.nome).toBe("Updated Card 1");
        expect(updatedCard.value.props.updatedAt).toEqual(
          new Date("2024-02-01T00:00:00.000Z"),
        );
      }
    });

    it("should preserve ID and createdAt when updating", async () => {
      const originalCard = await repository.findById("card-1");
      let originalCreatedAt: Date | undefined;
      if (originalCard.isRight() && originalCard.value) {
        originalCreatedAt = originalCard.value.props.createdAt;
      }

      const updateData = CardBuilder.create()
        .withId("card-1")
        .withNumero(1)
        .withNome("new-Default")
        .withQuantidade(1)
        .withCategoria("Default")
        .withRaridade("Default")
        .withDescricao("new-Default")
        .build();

      await repository.update("card-1", updateData);

      const updatedCard = await repository.findById("card-1");
      if (updatedCard.isRight() && updatedCard.value) {
        expect(updatedCard.value.props.id).toBe("card-1"); // ID preserved
        expect(updatedCard.value.props.createdAt).toEqual(originalCreatedAt); // createdAt preserved
      }
    });

    it("should return null for non-existent card (no error handling)", async () => {
      const updateData = CardBuilder.create()
        .withId("100")
        .withNumero(1)
        .withNome("Default")
        .withQuantidade(1)
        .withCategoria("Default")
        .withRaridade("Default")
        .withDescricao("Default")
        .build();

      const result = await repository.update("non-existent-card", updateData);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeNull();
    });
  });

  describe("delete", () => {
    let repository: LocalCardRepository;

    beforeEach(() => {
      repository = SeededLocalCardRepository.withAllSeeds();
    });

    it("should delete an existing card successfully", async () => {
      const initialSize = repository.size();

      const result = await repository.delete("card-1");

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeNull();
      expect(repository.size()).toBe(initialSize - 1);

      // Verify card is deleted
      const deletedCard = await repository.findById("card-1");
      expect(deletedCard.value).toBeNull();
    });

    it("should not throw error when deleting non-existent card", async () => {
      const initialSize = repository.size();

      const result = await repository.delete("non-existent-card");

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeNull();
      expect(repository.size()).toBe(initialSize); // Size unchanged
    });
  });

  describe("existsById", () => {
    let repository: LocalCardRepository;

    beforeEach(() => {
      repository = SeededLocalCardRepository.withAllSeeds();
    });

    it("should return true for existing card", async () => {
      const result = await repository.existsById("card-1");

      expect(result.isRight()).toBe(true);
      expect(result.value).toBe(true);
    });

    it("should return false for non-existent card", async () => {
      const result = await repository.existsById("non-existent-card");

      expect(result.isRight()).toBe(true);
      expect(result.value).toBe(false);
    });
  });

  describe("Utility methods", () => {
    it("should clear all entities", () => {
      const repository = SeededLocalCardRepository.withAllSeeds();

      expect(repository.size()).toBeGreaterThan(0);

      repository.clear();

      expect(repository.size()).toBe(0);
    });

    it("should return correct size", () => {
      const repository = SeededLocalCardRepository.withMultipleEntities(5);

      expect(repository.size()).toBe(5);
    });
  });
});
