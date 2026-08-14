import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Client de servidor (Server Components, API Routes) — ainda usa a anon key
// + sessão do usuário via cookies; RLS decide o que cada um pode ver/editar
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            // setAll chamado de um Server Component — ignora, o middleware
            // já cuida de refresh de sessão nesse caso
          }
        },
      },
    }
  )
}
