// Reminder: Install zod with `npm install zod` for schema validation
import { z } from 'zod'

export const cardIdSchema = z
  .string()
  .min(1, 'Card ID is required')
  .max(50, 'Card ID must be at most 50 characters')
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    'Card ID can only contain letters, numbers, hyphens, underscores, and dots'
  )

export const cardFieldSchema = z
  .string()
  .trim()
  .min(1, 'Card field is required')
  .max(100, 'Card field must be at most 100 characters')

export const raridadeSchema = z.enum(['Comum', 'Rara', 'Lendaria', 'Default'])

export const categoriaSchema = z.enum([
  'Iniciador',
  'Sentinela',
  'Controlador',
  'Duelista',
  'Default'
])

export const numeroCardSchema = z.number().int().positive()

export const quantityCardSchema = z.number().int().nonnegative('Quantity must be 0 or greater')

export const createCardRequestSchema = z.object({
  id: cardIdSchema,
  numero: numeroCardSchema,
  nome: cardFieldSchema,
  categoria: categoriaSchema,
  raridade: raridadeSchema,
  imagem: cardFieldSchema.optional(),
  descricao: cardFieldSchema.nullable(),
  quantidade: quantityCardSchema.optional(),
})

export const updateCardRequestSchema = z.object({
  nome: cardFieldSchema.optional(),
  imagem: cardFieldSchema.optional(),
  descricao: cardFieldSchema.nullable().optional(),
  quantidade: quantityCardSchema.optional(),
})

export const getCardParamsSchema = z.object({
  id: cardIdSchema,
})

export const PatchQuantitySchema = z.object({ 
  quantidade: quantityCardSchema
}) 

export type CreateCardRequestSchema = z.infer<typeof createCardRequestSchema>
export type UpdateCardRequestSchema = z.infer<typeof updateCardRequestSchema>
export type GetCardParamsSchema = z.infer<typeof getCardParamsSchema>
export type QuantityCardSchema = z.infer<typeof quantityCardSchema>
export type PatchQuantitySchema = z.infer<typeof PatchQuantitySchema>