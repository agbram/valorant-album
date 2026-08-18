import { Card } from "../../../src/domain/EntityModule";
import { CreateCardProps } from "../../../src/domain/EntityModule"; // ajusta se o tipo estiver em outro arquivo

describe("update", () => {
  const createdAt = new Date("2026-01-01T00:00:00Z");
  const updatedAt = new Date("2026-01-05T00:00:00Z");

  const baseProps: CreateCardProps = {
    id: "card-1",
    numero: 1,
    nome: "Jett",
    categoria: "Duelista",
    raridade: "Rara",
    imagem: "jett.png",
    descricao: "Agente duelista",
    quantidade: 1,
  };

  it("Deve atualizar apenas os campos fornecidos.", () => {
    const card = Card.create(baseProps, createdAt);

    card.update({ quantidade: 5 }, updatedAt);

    expect(card.props.quantidade).toBe(5);
  });

  it("Deve manter inalterados os campos que não foram tocados", () => {
    const card = Card.create(baseProps, createdAt);

    card.update({ quantidade: 5 }, updatedAt);

    expect(card.props.nome).toBe(baseProps.nome);
    expect(card.props.imagem).toBe(baseProps.imagem);
    expect(card.props.descricao).toBe(baseProps.descricao);
    expect(card.props.categoria).toBe(baseProps.categoria);
    expect(card.props.raridade).toBe(baseProps.raridade);
  });

  it("Deve atualizar o updatedAt mas manter o createdAt inalterado", () => {
    const card = Card.create(baseProps, createdAt);

    card.update({ quantidade: 5 }, updatedAt);

    expect(card.props.updatedAt).toBe(updatedAt);
    expect(card.props.createdAt).toBe(createdAt);
  });

  it("Deve atualizar múltiplos campos de uma só vez.", () => {
    const card = Card.create(baseProps, createdAt);

    card.update({ imagem: "new-image.png", descricao: null }, updatedAt);

    expect(card.props.imagem).toBe("new-image.png");
    expect(card.props.descricao).toBeNull();
  });

  it("Deve mutar (modificar) a mesma instância e retorná-la.", () => {
    const card = Card.create(baseProps, createdAt);

    const result = card.update({ quantidade: 5 }, updatedAt);

    expect(result).toBe(card);
  });
});