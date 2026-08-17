import { z } from 'zod'

export const telefoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.length === 10 || v.length === 11, {
    message: 'Telefone inválido',
  })

export const cadastroSchema = z
  .object({
    nome: z.string().trim().min(2, 'Nome muito curto').max(255),
    email: z.string().trim().toLowerCase().email('Email inválido'),
    telefone: telefoneSchema,
    senha: z.string().min(6, 'Senha precisa ter no mínimo 6 caracteres'),
    confirmaSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmaSenha, {
    message: 'As senhas não combinam',
    path: ['confirmaSenha'],
  })

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
  senha: z.string().min(1, 'Senha obrigatória'),
})

export type CadastroInput = z.infer<typeof cadastroSchema>
export type LoginInput = z.infer<typeof loginSchema>
