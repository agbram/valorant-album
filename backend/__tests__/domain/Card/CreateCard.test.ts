import { Card } from "../../../src/domain/EntityModule";
import { CreateCardProps } from "../../../src/domain/EntityModule"; // ajusta se o tipo estiver em outro arquivo

describe("create", () => {
  const now = new Date("2026-01-01T00:00:00Z");

  const baseProps: CreateCardProps = {
    id: "1",
    numero: 1,
    nome: "Jett",
    categoria: "Duelista",
    raridade: "Rara",
    imagem: "jett.png",
    descricao: "Agente duelista",
  };

  it("Deve definir quantidade como 0 quando não for informada.", () => {
    const card = Card.create(baseProps, now);

    expect(card.props.quantidade).toBe(0);
  });

  it("Deve usar a quantidade fornecida quando ela for informada.", () => {
    const card = Card.create({ ...baseProps, quantidade: 3 }, now);

    expect(card.props.quantidade).toBe(3);
  });

  it("Deve definir createdAt e updatedAt com o valor de now fornecido.", () => {
    const card = Card.create(baseProps, now);

    expect(card.props.createdAt).toBe(now);
    expect(card.props.updatedAt).toBe(now);
  });

  it("Deve copiar os campos restantes exatamente como estão.", () => {
    const card = Card.create(baseProps, now);

    expect(card.props.id).toBe(baseProps.id);
    expect(card.props.numero).toBe(baseProps.numero);
    expect(card.props.nome).toBe(baseProps.nome);
    expect(card.props.categoria).toBe(baseProps.categoria);
    expect(card.props.raridade).toBe(baseProps.raridade);
    expect(card.props.imagem).toBe(baseProps.imagem);
    expect(card.props.descricao).toBe(baseProps.descricao);
  });
});
