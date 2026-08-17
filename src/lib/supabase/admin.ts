import { createClient } from '@supabase/supabase-js'

// Admin client — usa service_role key, roda só no backend.
// Nunca expor pra cliente; usar só em API routes com server-only.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
