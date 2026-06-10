// src/types/index.ts

import type { Categoria, Raridade } from "@prisma/client"

export type CriarFigurinhaBody = {
  numero: number
  nome: string
  categoria: Categoria
  raridade: Raridade
  imagem: string
  descricao?: string
}

export type AtualizarFigurinhaBody = Partial<CriarFigurinhaBody>

export type FiltrosCatalogo = {
  numero?: number
  categoria?: string
  raridade?: string
}

export type FiltrosAlbum = {
  categoria?: string
  raridade?: string
  status?: string
}