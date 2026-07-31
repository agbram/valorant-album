import { ErrorProneResponse } from "../domain/contracts";
import { Card } from "../domain/EntityModule";
import { ICardRepository } from "../domain/EntityModule/ICardRepository";
import { ConnectionError } from "../domain/errors";
import { logger } from "../main/solutions";
import { left, right } from "../shared";
import { PostgresConnection, PostgresDb } from "./postgres";

export class PostgresCardRepository implements ICardRepository {
  private db: Promise<PostgresDb>;

  constructor(private connection: PostgresConnection) {
    this.db = this.connection.getConnection();
  }

  async create(card: Card): ErrorProneResponse<null> {
    const db = await this.db;
    try {
      await db.none(
        "INSERT INTO cards (id, numero, nome, quantidade, categoria, raridade, imagem, descricao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          card.props.id,
          card.props.numero,
          card.props.nome,
          card.props.quantidade,
          card.props.categoria,
          card.props.raridade,
          card.props.imagem,
          card.props.descricao,
        ],
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

  async findById(id: string): ErrorProneResponse<Card | null> {
    try {
      const db = await this.db;
      const row = await db.oneOrNone("SELECT * FROM cards WHERE id = $1", [id]);
      if (!row) return right(null);

      // Mapeia os dados do Postgres de volta para o formato do CardProps
      return right(
        new Card({
          id: row.id,
          numero: row.numero,
          nome: row.nome,
          quantidade: row.quantidade,
          categoria: row.categoria,
          raridade: row.raridade,
          imagem: row.imagem ?? undefined,
          descricao: row.descricao ?? null,
            createdAt: row.created_at ? new Date(row.created_at) : new Date(),
            updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
        }),
      );
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
      const db = await this.db;
      const row = await db.oneOrNone("SELECT * FROM cards WHERE numero = $1", [
        numero,
      ]);
      if (!row) return right(null);

      return right(
        new Card({
          id: row.id,
          numero: row.numero,
          nome: row.nome,
          quantidade: row.quantidade,
          categoria: row.categoria,
          raridade: row.raridade,
          imagem: row.imagem ?? undefined,
          descricao: row.descricao ?? null,
            createdAt: row.created_at ? new Date(row.created_at) : new Date(),
            updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
        }),
      );
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  async findAll(): ErrorProneResponse<Card[]> {
    logger.debug("findall");
    try {
      const db = await this.db;
      const rows = await db.any("SELECT * FROM cards");

      // Mapeia a lista inteira recebida do banco
      const cards = rows.map(
        (row) =>
          new Card({
            id: row.id,
            numero: row.numero,
            nome: row.nome,
            quantidade: row.quantidade,
            categoria: row.categoria,
            raridade: row.raridade,
            imagem: row.imagem ?? undefined,
            descricao: row.descricao ?? null,
            createdAt: row.created_at ? new Date(row.created_at) : new Date(),
            updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
          }),
      );

      return right(cards);
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
      const db = await this.db;
      await db.none("UPDATE cards SET numero = $1 WHERE id = $2", [
        card.props.numero,
        id,
      ]);
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
      const db = await this.db;
      await db.none("DELETE FROM cards WHERE id = $1", [id]);
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
      const db = await this.db;
      const data = await db.one(
        "SELECT EXISTS(SELECT 1 FROM cards WHERE id = $1)",
        [id],
      );
      return right(data.exists);
    } catch (error) {
      return left(
        new ConnectionError(
          "Card Repository",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }
}
