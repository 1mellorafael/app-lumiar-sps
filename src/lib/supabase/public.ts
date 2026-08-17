import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Client público (anon key, sem sessão/cookies) — pra dados que não
// dependem de quem está olhando (busca, categorias). Ao contrário do
// client de servidor (que lê cookies a cada request via next/headers),
// esse pode ser usado dentro de unstable_cache.
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase não configurado: NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY ausentes no ambiente.'
    )
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
