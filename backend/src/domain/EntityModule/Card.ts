export type Raridade = "Comum" | "Rara" | "Lendaria" | "Default";

export type Categoria = "Iniciador" | "Sentinela" | "Controlador" | "Duelista" | "Default";

export type CardProps = {
  id: string;
  numero: number;
  nome: string;
  quantidade: number;
  categoria: Categoria;
  raridade: Raridade;
  imagem?: string;
  descricao?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCardProps = Omit<
  CardProps,
  "createdAt" | "updatedAt" | "quantidade"
> &
  Partial<Pick<CardProps, "quantidade">>;

export type UpdateCardProps = Partial<
  Pick<CardProps, "imagem" | "descricao" | "quantidade">
>;

export class Card {
  constructor(public props: CardProps) {}

  public static create(props: CreateCardProps, now: Date): Card {
    return new Card({
      ...props,
      quantidade: props.quantidade ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  public update(props: UpdateCardProps, now: Date): Card {
    this.props = {
      ...this.props,
      ...props,
      updatedAt: now,
    };
    return this;
  }

  public static clone(card: Card): Card {
    return new Card({ ...card.props });
  }

  public get quantidade(): number {
    return this.props.quantidade;
  }

  public get nome(): string {
    return this.props.nome;
  }

}
