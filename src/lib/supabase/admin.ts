import { createClient } from '@supabase/supabase-js'

// Admin client — usa service_role key, roda só no backend.
// Nunca expor pra cliente; usar só em API routes com server-only.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Supabase não configurado: NEXT_PUBLIC_SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY ausentes no ambiente.'
    )
  }
  return createClient(supabaseUrl, serviceRoleKey)
}
