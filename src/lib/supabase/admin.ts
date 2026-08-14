import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Client admin com service_role key — bypassa RLS.
// 'server-only' faz o build falhar se isso for importado num Client Component.
// Usar SÓ em rotas admin (ex: aprovar/rejeitar prestador), nunca em endpoint
// público.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
