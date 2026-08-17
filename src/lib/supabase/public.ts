import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Client público (anon key, sem sessão/cookies) — pra dados que não
// dependem de quem está olhando (busca, categorias). Ao contrário do
// client de servidor (que lê cookies a cada request via next/headers),
// esse pode ser usado dentro de unstable_cache.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
