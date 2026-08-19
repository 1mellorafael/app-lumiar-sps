import { z } from 'zod'

export const telefoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.length === 10 || v.length === 11, {
    message: 'Telefone inválido',
  })

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Usuário precisa ter no mínimo 3 caracteres')
  .max(30, 'Usuário muito longo')
  .regex(/^[a-z0-9_]+$/, 'Só letras minúsculas, números e _')

// Bounding box generoso (Lumiar + São Pedro da Serra + margem de ~2km)
// cobrindo também as localidades menores da região (Bocaina, Benfica,
// Boa Esperança, Santiago, Serra Mar). É retângulo, não polígono exato
// — de propósito mais permissivo que restritivo: o Nominatim já provou
// nessa região não mapear bem todo mundo, então um falso positivo
// (aceitar um pouco além da borda real) é preferível a rejeitar vizinho
// de verdade (decisão de 18/08).
export const AREA_ATENDIDA = {
  latMin: -22.46,
  latMax: -22.27,
  lngMin: -42.47,
  lngMax: -42.18,
}

export function dentroDaArea(lat: number, lng: number): boolean {
  return (
    lat >= AREA_ATENDIDA.latMin &&
    lat <= AREA_ATENDIDA.latMax &&
    lng >= AREA_ATENDIDA.lngMin &&
    lng <= AREA_ATENDIDA.lngMax
  )
}

export const IDADE_MINIMA = 12

export function calcularIdade(dataNascimento: Date): number {
  const hoje = new Date()
  let idade = hoje.getFullYear() - dataNascimento.getFullYear()
  const aindaNaoFezAniversarioEsteAno =
    hoje.getMonth() < dataNascimento.getMonth() ||
    (hoje.getMonth() === dataNascimento.getMonth() &&
      hoje.getDate() < dataNascimento.getDate())
  if (aindaNaoFezAniversarioEsteAno) idade--
  return idade
}

export const cadastroSchema = z
  .object({
    nome: z.string().trim().min(2, 'Nome muito curto').max(255),
    username: usernameSchema,
    email: z.string().trim().toLowerCase().email('Email inválido'),
    telefone: telefoneSchema,
    endereco: z.string().trim().min(1, 'Endereço é obrigatório').max(500),
    enderecoLat: z.coerce.number().min(-90).max(90),
    enderecoLng: z.coerce.number().min(-180).max(180),
    dataNascimento: z.coerce.date({ message: 'Data de nascimento inválida' }),
    senha: z.string().min(6, 'Senha precisa ter no mínimo 6 caracteres'),
    confirmaSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmaSenha, {
    message: 'As senhas não combinam',
    path: ['confirmaSenha'],
  })
  .refine((data) => dentroDaArea(data.enderecoLat, data.enderecoLng), {
    message:
      'Esse endereço parece fora de Lumiar/São Pedro da Serra — a plataforma é só pra essa região.',
    path: ['endereco'],
  })
  .refine((data) => data.dataNascimento <= new Date(), {
    message: 'Data de nascimento não pode ser no futuro',
    path: ['dataNascimento'],
  })
  .refine((data) => calcularIdade(data.dataNascimento) >= IDADE_MINIMA, {
    message: `Precisa ter pelo menos ${IDADE_MINIMA} anos pra se cadastrar`,
    path: ['dataNascimento'],
  })

// Login por usuário (decisão de 18/08) — a rota resolve usuário -> email
// via admin client antes de chamar signInWithPassword
export const loginSchema = z.object({
  username: usernameSchema,
  senha: z.string().min(1, 'Senha obrigatória'),
})

export const perfilSchema = z.object({
  nome: z.string().trim().min(2, 'Nome muito curto').max(255),
  telefone: telefoneSchema,
})

export const trocarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
    novaSenha: z.string().min(6, 'Senha precisa ter no mínimo 6 caracteres'),
    confirmaNovaSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmaNovaSenha, {
    message: 'As senhas não combinam',
    path: ['confirmaNovaSenha'],
  })

export const recuperarSenhaSchema = z.object({
  username: usernameSchema,
})

export const recuperarUsuarioSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
})

export type CadastroInput = z.infer<typeof cadastroSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PerfilInput = z.infer<typeof perfilSchema>
