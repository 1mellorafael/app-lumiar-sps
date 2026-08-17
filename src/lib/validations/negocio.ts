import { z } from 'zod'
import { getCategoria, getLocalizacao } from '@/lib/mock-data'
import { telefoneSchema } from '@/lib/validations/auth'

// Fotos vêm como File separado (multipart/form-data), validadas na rota —
// zod aqui cobre só os campos de texto. Já chegam recortadas no formato
// certo pelo editor (PhotoCropField), não precisam mais de object-position.
export const negocioSchema = z.object({
  nomeNegocio: z.string().trim().min(1, 'Nome do negócio é obrigatório').max(255),
  // Um negócio pode ser mais de uma coisa (motoboy/mototáxi, hospedagem
  // pet/adestramento) — evita cadastro duplicado pra cobrir isso
  categorias: z
    .array(z.string().refine((v) => !!getCategoria(v), 'Categoria inválida'))
    .min(1, 'Escolha ao menos uma categoria'),
  // Onde o negócio atende — Lumiar, São Pedro da Serra, ou os dois
  localizacoes: z
    .array(
      z.string().refine((v) => !!getLocalizacao(v), 'Localização inválida')
    )
    .min(1, 'Escolha ao menos uma localização'),
  endereco: z.string().trim().max(500).optional().default(''),
  // Só vêm preenchidos quando a pessoa escolhe um lugar real no
  // autocomplete do Google — texto livre sem seleção não geocodifica
  enderecoLat: z.coerce.number().min(-90).max(90).optional(),
  enderecoLng: z.coerce.number().min(-180).max(180).optional(),
  descricao: z.string().trim().max(2000).optional().default(''),
  instagram: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@/, ''))
    .optional()
    .default(''),
  telefoneContato: telefoneSchema,
})

export type NegocioInput = z.infer<typeof negocioSchema>

export const FOTO_MAX_BYTES = 5 * 1024 * 1024 // 5MB
export const FOTO_TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp']
