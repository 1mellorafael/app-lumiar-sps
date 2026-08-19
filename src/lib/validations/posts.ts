import { z } from 'zod'
import { getLocalizacao } from '@/lib/mock-data'
import { telefoneSchema } from '@/lib/validations/auth'

export const POST_TIPOS = ['evento', 'curso', 'anuncio', 'pet_perdido'] as const
export type PostTipo = (typeof POST_TIPOS)[number]

export const VISIBILIDADES = ['publico', 'logado'] as const
export type Visibilidade = (typeof VISIBILIDADES)[number]

// Fotos vêm como File separado (multipart/form-data), validadas na rota.
export const postSchema = z
  .object({
    tipo: z.enum(POST_TIPOS, { message: 'Tipo inválido' }),
    // preenchido só quando o post é publicado em nome de um negócio
    // próprio em vez do perfil pessoal — dono confere na rota
    negocioId: z.string().uuid().optional(),
    localizacao: z.string().refine((v) => !!getLocalizacao(v), 'Localização inválida'),
    // quem posta escolhe se fica visível pra qualquer um ou só pra
    // quem tem conta — default público
    visibilidade: z.enum(VISIBILIDADES).optional().default('publico'),
    titulo: z.string().trim().min(1, 'Título é obrigatório').max(255),
    descricao: z.string().trim().max(2000).optional().default(''),
    // telefone é sempre obrigatório (todo tipo, inclusive pet perdido —
    // é o contato principal); email é complemento opcional só pra
    // evento/curso/anuncio, não faz sentido pra pet perdido
    telefoneContato: telefoneSchema,
    emailContato: z.union([z.literal(''), z.string().trim().email('Email inválido')])
      .optional()
      .default(''),
    // só evento/curso
    redeSocial: z
      .string()
      .trim()
      .transform((v) => v.replace(/^@/, ''))
      .optional()
      .default(''),
    // evento/curso: obrigatória. Vem de <input type="datetime-local">
    dataEvento: z.coerce.date().optional(),
    // evento/curso: obrigatório (endereço real). pet_perdido: opcional
    // ("visto por último"). anuncio: não usa.
    localTexto: z.string().trim().max(255).optional().default(''),
    // só vêm preenchidos quando a pessoa escolhe um lugar real no
    // autocomplete do Google — mesmo padrão de negocioSchema
    enderecoLat: z.coerce.number().min(-90).max(90).optional(),
    enderecoLng: z.coerce.number().min(-180).max(180).optional(),
    // só anuncio; ausente = "a combinar"
    preco: z.coerce.number().min(0).optional(),
  })
  .refine((d) => (d.tipo !== 'evento' && d.tipo !== 'curso') || !!d.dataEvento, {
    message: 'Data é obrigatória pra evento ou curso',
    path: ['dataEvento'],
  })
  .refine((d) => (d.tipo !== 'evento' && d.tipo !== 'curso') || !!d.localTexto, {
    message: 'Local é obrigatório pra evento ou curso',
    path: ['localTexto'],
  })

export type PostInput = z.infer<typeof postSchema>
