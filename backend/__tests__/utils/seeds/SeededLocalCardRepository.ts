import { LocalCardRepository } from "../../../src/solutions/localRepositories/LocalCardRepository";
import { Card } from "../../../src/domain/EntityModule/Card";

import { CardBuilder } from "../builders";

// Fixed dates for consistent testing
const FIXED_CREATED_DATE = new Date("2024-01-01T00:00:00.000Z");
const FIXED_UPDATED_DATE = new Date("2024-01-01T00:00:00.000Z");

export const cardSeeds: Card[] = [
  CardBuilder.create()
    .withId("card-1")
    .withNumero(1)
    .withNome("Default - 1")
    .withQuantidade(1)
    .withCategoria("Default")
    .withRaridade("Default")
    .withDescricao("Default")
    .withCreatedAt(FIXED_CREATED_DATE)
    .withUpdatedAt(FIXED_UPDATED_DATE)
    .build(),

  CardBuilder.create()
    .withId("card-2")
    .withNumero(2)
    .withNome("Default - 2")
    .withQuantidade(1)
    .withCategoria("Default")
    .withRaridade("Default")
    .withDescricao("Default")
    .withCreatedAt(FIXED_CREATED_DATE)
    .withUpdatedAt(FIXED_UPDATED_DATE)
    .build(),

  CardBuilder.create()
    .withId("card-3")
    .withNumero(3)
    .withNome("Default - 3")
    .withQuantidade(1)
    .withCategoria("Default")
    .withRaridade("Default")
    .withDescricao("Default")
    .withCreatedAt(FIXED_CREATED_DATE)
    .withUpdatedAt(FIXED_UPDATED_DATE)
    .build(),

  CardBuilder.create()
    .withId("card-4")
    .withNumero(4)
    .withNome("Default - 4")
    .withQuantidade(1)
    .withCategoria("Default")
    .withRaridade("Default")
    .withDescricao("Default")
    .withCreatedAt(FIXED_CREATED_DATE)
    .withUpdatedAt(FIXED_UPDATED_DATE)
    .build(),

  CardBuilder.create()
    .withId("card-5")
    .withNumero(5)
    .withNome("Default - 5")
    .withQuantidade(1)
    .withCategoria("Default")
    .withRaridade("Default")
    .withDescricao("Default")
    .withCreatedAt(FIXED_CREATED_DATE)
    .withUpdatedAt(FIXED_UPDATED_DATE)
    .build(),
];

// Helper functions for specific test scenarios
export const getEmptyCardSeeds = (): Card[] => [];

export const getSingleCardSeed = (): Card[] => [cardSeeds[0]];

export const getMultipleCardSeeds = (count: number = 3): Card[] =>
  cardSeeds.slice(0, Math.min(count, cardSeeds.length));

export class SeededLocalCardRepository extends LocalCardRepository {
  // Factory methods for different test scenarios
  static empty(): LocalCardRepository {
    return new LocalCardRepository(getEmptyCardSeeds());
  }

  static withAllSeeds(): LocalCardRepository {
    return new LocalCardRepository(cardSeeds);
  }

  static withSingleCard(): LocalCardRepository {
    return new LocalCardRepository(getSingleCardSeed());
  }

  static withMultipleEntities(count: number = 3): LocalCardRepository {
    return new LocalCardRepository(getMultipleCardSeeds(count));
  }
}
