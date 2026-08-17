import { z } from 'zod'
import { getCategoria } from '@/lib/mock-data'
import { telefoneSchema } from '@/lib/validations/auth'

// Fotos vêm como File separado (multipart/form-data), validadas na rota —
// zod aqui cobre só os campos de texto.
export const negocioSchema = z.object({
  nomeNegocio: z.string().trim().max(255).optional().default(''),
  categoria: z
    .string()
    .refine((v) => !!getCategoria(v), 'Categoria inválida'),
  descricao: z.string().trim().max(2000).optional().default(''),
  instagram: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@/, ''))
    .optional()
    .default(''),
  telefoneContato: telefoneSchema,
  horarioFuncionamento: z.string().trim().max(255).optional().default(''),
})

export type NegocioInput = z.infer<typeof negocioSchema>

export const FOTO_MAX_BYTES = 5 * 1024 * 1024 // 5MB
export const FOTO_TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp']
