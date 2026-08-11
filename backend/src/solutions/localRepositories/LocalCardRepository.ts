import { ICardRepository } from "../../domain/EntityModule/ICardRepository";
import { Card } from "../../domain/EntityModule/Card";
import { ErrorProneResponse } from "../../domain/contracts/ErrorProneResponse";
import { left, right } from "../../shared/Either";
import { ConnectionError } from "../../domain/errors/ConnectionError";

export class LocalCardRepository implements ICardRepository {
  private cards: Map<string | number | undefined, Card> = new Map();

  constructor(initialCards: Card[] = []) {
    initialCards.forEach((card) => {
      this.cards.set(card.props.id, card);
    });
  }

  async create(card: Card): ErrorProneResponse<null> {
    try {
      this.cards.set(card.props.id, Card.clone(card));
      return right(null);
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  async changeQuantity(
    id: string,
    quantidade: number,
  ): ErrorProneResponse<null> {
    try {
      const existing = this.cards.get(id);
      if (!existing) return right(null);
      this.cards.set(
        id,
        Card.clone(existing).update({ quantidade: quantidade }, new Date()),
      );
      return right(null);
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  async findByNome(nome: string): ErrorProneResponse<Card | null> {
    try {
      const card = this.cards.get(nome) || null;
      return right(card && Card.clone(card));
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  async findById(id: string): ErrorProneResponse<Card | null> {
    try {
      const card = this.cards.get(id) || null;
      return right(card && Card.clone(card));
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  async findByNumero(numero: number): ErrorProneResponse<Card | null> {
    try {
      const card = this.cards.get(numero) || null;
      return right(card && Card.clone(card));
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknow error",
        ),
      );
    }
  }

  async findAll(): ErrorProneResponse<Card[]> {
    try {
      return right(Array.from(this.cards.values()).map(Card.clone));
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  async update(id: string, card: Card): ErrorProneResponse<null> {
    try {
      const existing = this.cards.get(id);
      if (!existing) return right(null);
      this.cards.set(id, Card.clone(card));
      return right(null);
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  async delete(id: string): ErrorProneResponse<null> {
    try {
      this.cards.delete(id);
      return right(null);
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  async existsById(id: string): ErrorProneResponse<boolean> {
    try {
      return right(this.cards.has(id));
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  // Additional utility methods for testing/debugging
  clear(): void {
    this.cards.clear();
  }

  size(): number {
    return this.cards.size;
  }
}
