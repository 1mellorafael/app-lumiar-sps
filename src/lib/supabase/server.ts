import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Client de servidor (Server Components, API Routes) — ainda usa a anon key
// + sessão do usuário via cookies; RLS decide o que cada um pode ver/editar
export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // Mensagem própria em vez de deixar o @supabase/ssr estourar a genérica
  // "URL and Key are required" — mais fácil de diagnosticar se a env var
  // sumir num cold start (error.tsx captura de qualquer jeito, mas isso
  // deixa claro no log qual é o problema real)
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase não configurado: NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY ausentes no ambiente.'
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll chamado de um Server Component (não pode escrever
            // cookie) — ignora aqui, quem escreve o cookie renovado é o
            // proxy.ts (roda antes, em toda rota) via seu próprio getUser()
          }
        },
      },
    }
  )
}
