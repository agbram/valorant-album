import prisma from "../db/prisma.js"
import type { Request, Response, NextFunction } from 'express';
import { Prisma } from "@prisma/client";
import type { FiltrosAlbum } from "../types/index.js";

export const AlbumController = {
// Adiciona uma figurinha ao álbum do colecionador.
// Se já existir, incrementa a quantidade (vira repetida).
// Se não existir, cria com quantidade 1 (colada).
  async adicionar(req: Request, res: Response, next: NextFunction) {
    try {
      const figurinhaId = Number(req.params.figurinhaId)

      const novaFigurinha = await prisma.album.upsert({
        where: { figurinhaId },
        update: { quantidade: { increment: 1 } },
        create: { figurinhaId, quantidade: 1},
      })

      res.status(200).json(novaFigurinha)
    } catch (error) {
      next(error)
    }
  },
// Remove uma cópia repetida da figurinha do álbum.
// Figurinhas coladas (quantidade === 1) não podem ser removidas.
// Decrementa 1 da quantidade se houver repetidas.
  async remover(req: Request, res: Response, next: NextFunction) {
    try {
      const figurinhaId = Number(req.params.figurinhaId)

      const figurinhaAtual = await prisma.album.findUnique({ where: { figurinhaId } })

      if (!figurinhaAtual) {
        return res.status(404).json({ error: "Figurinha não encontrada" })
      }

      if (figurinhaAtual.quantidade === 1) {
        return res.status(400).json({ error: "Figurinha colada não pode ser removida" })
      }

      await prisma.album.update({
        where: { figurinhaId },
        data: { quantidade: { decrement: 1 } },
      })

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },
// Lista as figurinhas do álbum com filtros opcionais.
// Filtros: categoria e raridade (via tabela figurinha), status (colada/repetida).
// Inclui os dados completos da figurinha em cada entrada.
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoria, raridade, status } = req.query as FiltrosAlbum

      const where: any = {}

      if (categoria || raridade) {
        where.figurinha = {}
        if (categoria) where.figurinha.categoria = categoria
        if (raridade) where.figurinha.raridade = raridade
      }

      if (status === "colada") where.quantidade = 1
      if (status === "repetida") where.quantidade = { gt: 1 }

      const colecao = await prisma.album.findMany({
        where,
        include: { figurinha: true },
      })

      res.status(200).json(colecao)
    } catch (error) {
      next(error)
    }
  },
// Retorna as estatísticas de progresso do álbum.
// Calcula: total no catálogo, coladas, faltando, repetidas e percentual de conclusão.
  async stats(req: Request, res: Response, next: NextFunction) {
    try {
      const totalCatalago = await prisma.figurinha.count()
      const totalColadas = await prisma.album.count({ where: { quantidade: { gte: 1 } } })

      const totalRepetidasSum = await prisma.album.aggregate({
        where: { quantidade: { gt: 1 } },
        _sum: { quantidade: true },
      })

      const totalRepetidasCount = await prisma.album.count({ where: { quantidade: { gt: 1 } } })
      const totalRepetidas = (totalRepetidasSum._sum.quantidade ?? 0) - totalRepetidasCount
      const totalFaltando = totalCatalago - totalColadas
      const percentual = Math.round((totalColadas / totalCatalago) * 100)

      return res.status(200).json({
        totalCatalago,
        totalColadas,
        totalFaltando,
        totalRepetidas,
        percentual,
      })
    } catch (error) {
      next(error)
    }
  },
}
