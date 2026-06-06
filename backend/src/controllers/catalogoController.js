import prisma from "../db/prisma.js";

export const CatalogoController = {
  // Cria uma nova figurinha no catálogo.
  // Nome e número são obrigatórios. Número deve ser único.
  async store(req, res, next) {
    try {
      const { numero, nome, categoria, raridade, imagem, descricao } = req.body;

      if (!nome || !numero) {
        return res
          .status(400)
          .json({ error: "Nome e número são obrigatórios!" });
      }

      const figurinhaNova = await prisma.figurinha.create({
        data: {
          nome: nome,
          numero: numero,
          categoria: categoria,
          raridade: raridade,
          imagem: imagem,
          descricao: descricao || null,
        },
      });

      console.log("Figurinhas criada: ", figurinhaNova);
      res.status(201).json(figurinhaNova);
    } catch (error) {
      console.error("Detalhes do erro: ", error);
      next(error);
    }
  },

  // Lista figurinhas do catálogo com filtros opcionais.
  // Filtros combináveis: numero, categoria e raridade via query params.
  async index(req, res, next) {
    try {
      const { numero, categoria, raridade } = req.query;

      let figurinhas;
      const where = {};

      if (numero) where.numero = numero;
      if (categoria) where.categoria = categoria;
      if (raridade) where.raridade = raridade;

      figurinhas = await prisma.figurinha.findMany({
        where: where,
      });

      res.status(200).json(figurinhas);
    } catch (error) {
      console.log("Erro: Falha ao buscar as figurinhas");
      next(error);
    }
  },

  async show(req, res, next) {
    try {
      const id = Number(req.params.id);
      const showFigurinha = await prisma.figurinha.findUnique({
        where: { id },
      });
      if (!showFigurinha) {
        return res.status(404).json({ error: "Figurinha não encontrada" });
      } else {
        return res.status(200).json(showFigurinha);
      }
    } catch(error){
      next(error)
    }

    // pega o id do req.params
    // busca com prisma.figurinha.findUnique
    // se não encontrar retorna 404
    // se encontrar retorna 200 com os dados
  },
  // Atualiza os dados de uma figurinha existente pelo id.
  // Apenas os campos enviados no body são atualizados.
  async update(req, res, next) {
    try {
      const id = Number(req.params.id);

      const figurinhaAtual = await prisma.figurinha.findUnique({
        where: { id },
      });

      if (!figurinhaAtual) {
        return res.status(404).json({ error: "Figurinha não encontrada" });
      }

      let data = {};

      if (req.body.nome) data.nome = req.body.nome;
      if (req.body.categoria) data.categoria = req.body.categoria;
      if (req.body.raridade) data.raridade = req.body.raridade;
      if (req.body.descricao) data.descricao = req.body.descricao;
      if (req.body.imagem) data.imagem = req.body.imagem;

      const figurinhaAlterada = await prisma.figurinha.update({
        where: { id },
        data: data,
      });

      res.status(200).json(figurinhaAlterada);
    } catch (error) {
      console.error("Figurinha não encontrada ou não pode ser alterado...");
      next(error);
    }
  },
  // Remove uma figurinha do catálogo pelo id.
  // Por cascade, remove também a entrada correspondente no álbum.
  async delete(req, res, next) {
    try {
      const id = Number(req.params.id);
      const figurinhaAtual = await prisma.figurinha.findUnique({
        where: { id },
      });

      if (!figurinhaAtual) {
        return res.status(404).json({ error: "Figurinha não encontrada" });
      }

      const deletaFigurinha = await prisma.figurinha.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error: Id de figurinha não encontrado!");
      next(error);
    }
  },
};
