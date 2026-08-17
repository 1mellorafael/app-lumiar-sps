import { z } from 'zod'

export const statusPrestadorSchema = z.object({
  status: z.enum(['ativo', 'rejeitado']),
})
