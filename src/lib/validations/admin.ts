import { z } from 'zod'
import { telefoneSchema } from '@/lib/validations/auth'

export const statusNegocioSchema = z.object({
  status: z.enum(['ativo', 'rejeitado']),
})

// Transferir a posse de um negócio sem dono pro telefone de uma conta
// já existente — admin só informa o telefone, a API resolve o profile_id
export const transferirDonoSchema = z.object({
  telefoneNovoDono: telefoneSchema,
})
