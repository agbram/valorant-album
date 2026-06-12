import prisma from "../db/prisma.js";
import type { Request, Response, NextFunction } from 'express';
import type { CriarFigurinhaBody, FiltrosCatalogo } from "../types/index.js";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Schema do Zod que define as regras de validação para criação de figurinha.
// Funciona como um "goleiro" — barra qualquer dado inválido antes de chegar no banco.
const criarFigurinhaSchema = z.object({
  // Nome não pode ser vazio
  nome: z.string().min(1, "Nome é obrigatório"),
  // Número deve ser inteiro e positivo — impede números negativos ou decimais
  numero: z.number().int().positive("Número deve ser positivo"),
  // Apenas categorias válidas do jogo são aceitas — qualquer outro valor é rejeitado
  categoria: z.enum(["Duelista", "Controlador", "Sentinela", "Iniciador"]),
  // Apenas raridades válidas são aceitas
  raridade: z.enum(["Comum", "Rara", "Lendaria"]),
  // Imagem deve ser uma URL válida — impede strings soltas como "minha-foto"
  imagem: z.string().url("Deve ser uma URL válida"),
  // Descrição é opcional
  descricao: z.string().optional()
});

// Versão parcial do schema para atualização — todos os campos se tornam opcionais.
// Permite atualizar só o nome sem precisar enviar todos os outros campos.
const atualizarFigurinhaSchema = criarFigurinhaSchema.partial();


export const CatalogoController = {
  // Cria uma nova figurinha no catálogo.
  // Nome e número são obrigatórios. Número deve ser único.
  async store(req: Request, res: Response, next: NextFunction) {
    try {
// safeParse valida o body sem lançar exceção.
// Se inválido, retorna success: false com os erros detalhados.
// Se válido, retorna success: true com os dados já tipados e limpos.
const validacao = criarFigurinhaSchema.safeParse(req.body);

      if (!validacao.success) {
        return res.status(400).json({ error: "Dados inválidos", detalhes: validacao.error.format() });
      }

      const body = validacao.data;

      const figurinhaNova = await prisma.figurinha.create({
        data: {
          nome: body.nome,
          numero: body.numero,
          categoria: body.categoria,
          raridade: body.raridade,
          imagem: body.imagem,
          descricao: body.descricao ?? undefined,
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
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { numero, categoria, raridade } = req.query as FiltrosCatalogo

      const where: any = {}

      if (numero) where.numero = Number(numero)
      if (categoria) where.categoria = categoria
      if (raridade) where.raridade = raridade

      const figurinhas = await prisma.figurinha.findMany({ where })

      res.status(200).json(figurinhas)
    } catch (error) {
      next(error)
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)

      const figurinha = await prisma.figurinha.findUnique({ where: { id } })

      if (!figurinha) {
        return res.status(404).json({ error: "Figurinha não encontrada" })
      }

      return res.status(200).json(figurinha)
    } catch (error) {
      next(error)
    }
  },

    // pega o id do req.params
    // busca com prisma.figurinha.findUnique
    // se não encontrar retorna 404
    // se encontrar retorna 200 com os dados

  // Atualiza os dados de uma figurinha existente pelo id.
  // Apenas os campos enviados no body são atualizados.
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)

      const figurinhaAtual = await prisma.figurinha.findUnique({ where: { id } })

      if (!figurinhaAtual) {
        return res.status(404).json({ error: "Figurinha não encontrada" })
      }

      const validacao = atualizarFigurinhaSchema.safeParse(req.body);
      if (!validacao.success) {
        return res.status(400).json({ error: "Dados inválidos", detalhes: validacao.error.format() });
      }

      const body = validacao.data;
      let data: Prisma.FigurinhaUpdateInput = {};

      if (body.nome) data.nome = body.nome
      if (body.categoria) data.categoria = body.categoria
      if (body.raridade) data.raridade = body.raridade
      if (body.descricao) data.descricao = body.descricao
      if (body.imagem) data.imagem = body.imagem

      const figurinhaAlterada = await prisma.figurinha.update({ where: { id }, data })

      res.status(200).json(figurinhaAlterada)
    } catch (error) {
      next(error)
    }
  },
  // Remove uma figurinha do catálogo pelo id.
  // Por cascade, remove também a entrada correspondente no álbum.
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)

      const figurinhaAtual = await prisma.figurinha.findUnique({ where: { id } })

      if (!figurinhaAtual) {
        return res.status(404).json({ error: "Figurinha não encontrada" })
      }

      await prisma.figurinha.delete({ where: { id } })

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },
}
