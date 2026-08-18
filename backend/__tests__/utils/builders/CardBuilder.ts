import {
  CreateCardProps,
  Card,
  CardProps,
  Categoria,
  Raridade,
} from "../../../src/domain/EntityModule";

export class CardBuilder {
  private props: CardProps = {
    id: "1",
    numero: 1,
    nome: "Default",
    quantidade: 0,
    categoria: "Default",
    raridade: "Default",
    descricao: "Default",
    imagem: "Default",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  };

  static create(): CardBuilder {
    return new CardBuilder();
  }

  withId(id: string): CardBuilder {
    this.props.id = id;
    return this;
  }
  withNumero(numero: number): CardBuilder {
    this.props.numero = numero;
    return this;
  }

  withNome(nome: string): CardBuilder {
    this.props.nome = nome;
    return this;
  }

  withQuantidade(quantidade: number): CardBuilder {
    this.props.quantidade = quantidade;
    return this;
  }

  withCategoria(categoria: Categoria): CardBuilder {
    this.props.categoria = categoria;
    return this;
  }

  withRaridade(raridade: Raridade): CardBuilder {
    this.props.raridade = raridade;
    return this;
  }
  
  withImagem(imagem: string): CardBuilder {
    this.props.imagem = imagem;
    return this;
  }

  withDescricao(descricao: string): CardBuilder {
    this.props.descricao = descricao;
    return this;
  }

  withCreatedAt(createdAt: Date): CardBuilder {
    this.props.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): CardBuilder {
    this.props.updatedAt = updatedAt;
    return this;
  }

  withTimestamps(date: Date): CardBuilder {
    this.props.createdAt = date;
    this.props.updatedAt = date;
    return this;
  }

  withCurrentTimestamps(): CardBuilder {
    const now = new Date();
    this.props.createdAt = now;
    this.props.updatedAt = now;
    return this;
  }

  // Helper methods for common test scenarios
  asNewCard(): CardBuilder {
    const now = new Date();
    return this.withTimestamps(now);
  }

  asUpdatedCard(originalCreatedAt?: Date): CardBuilder {
    this.props.createdAt = originalCreatedAt || this.props.createdAt;
    this.props.updatedAt = new Date();
    return this;
  }

  // Build method to get the final Card object
  build(): Card {
    return new Card({ ...this.props });
  }

  buildForCreate(): CreateCardProps {
    return {
      id: this.props.id,
      numero: this.props.numero,
      nome: this.props.nome,
      quantidade: this.props.quantidade,
      categoria: this.props.categoria,
      raridade: this.props.raridade,
      descricao: this.props.descricao
    };
  }

  // Build multiple entities with incremental IDs
  buildMany(count: number, idPrefix: string = "card"): Card[] {
    const card: Card[] = [];
    for (let i = 1; i <= count; i++) {
      const cardCopy = { ...this.props };
      cardCopy.id = `${idPrefix}-${i}`;
      cardCopy.numero = this.props.numero + i;
      cardCopy.nome = this.props.nome;
      cardCopy.categoria = this.props.categoria;
      cardCopy.raridade = this.props.raridade;
      cardCopy.descricao = this.props.descricao;
      card.push(new Card(cardCopy));
    }
    return card;
  }
}
