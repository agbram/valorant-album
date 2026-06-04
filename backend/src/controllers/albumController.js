import prisma from "../db/prisma.js";

export const AlbumController = {
  async adicionar(req, res, next) {
    try {
      const { quantidade } = req.params;
      const figurinhaId = Number(req.params.figurinhaId);

      const novaFigurinha = await prisma.album.upsert({
        where: {
          figurinhaId: figurinhaId,
        },
        update: {
          quantidade: { increment: 1 },
        },
        create: {
          figurinhaId,
          quantidade: 1,
        },
      });

      console.log("Figurinhas adicionada a coleção: ", novaFigurinha);
      res.status(200).json("Figurinha adicionada a coleção!");
    } catch (error) {
      next(error);
    }
  },

  async remover(req, res, next) {
    try {
      const { figurinhaId } = req.params;

      const figurinhaAtual = await prisma.album.findUnique({
        where: { figurinhaId: Number(figurinhaId) },
      });

      if (!figurinhaAtual) {
        return res.status(404).json({ error: "Figurinha não encontrada" });
      }

      if (figurinhaAtual.quantidade === 1) {
        return res
          .status(400)
          .json({ error: "Figurinha colada não pode ser removida" });
      }

      const decrementaColecao = await prisma.album.update({
        where: { figurinhaId: Number(figurinhaId) },
        data: { quantidade: { decrement: 1 } },
      });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async listar(req, res, next) {
    try {
      const { categoria, raridade, status } = req.query;

      let colecao;
      const where = {};

      if (categoria || raridade) {
        where.figurinha = {};
        if (categoria) where.figurinha.categoria = categoria;
        if (raridade) where.figurinha.raridade = raridade;
      }
      if (status === "colada") where.quantidade = 1;
      if (status === "repetida") where.quantidade = { gt: 1 };

      colecao = await prisma.album.findMany({
        where: where,
        include: {
          figurinha: true,
        },
      });

      res.status(200).json(colecao);
    } catch (error) {
      next(error);
    }
  },

  async stats(req, res, next) {
    try {
      const totalCatalago = await prisma.figurinha.count();
      const totalColadas = await prisma.album.count({
        where: { quantidade: { gte: 1 } },
      });
      const totalRepetidasSum = await prisma.album.aggregate({
        where: {quantidade: {gt: 1}},
        _sum: {
            quantidade: true
        }
      });
      const totalRepetidasCount = await prisma.album.count({
        where: {
            quantidade: {gt: 1}
        }
      });

      const totalRepetidas = totalRepetidasSum._sum.quantidade - totalRepetidasCount;
      const totalFaltando = totalCatalago - totalColadas;
      const percentual = Math.round((totalColadas / totalCatalago) * 100);
      return res
        .status(200)
        .json({
          totalCatalago,
          totalColadas,
          totalFaltando,
          totalRepetidas,
          percentual,
        });
    } catch (error) {
      next(error);
    }
  },
};
