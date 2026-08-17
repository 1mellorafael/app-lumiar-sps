import { z } from 'zod'

export const statusNegocioSchema = z.object({
  status: z.enum(['ativo', 'rejeitado']),
})
