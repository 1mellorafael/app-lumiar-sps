import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { rateLimiters } from '@/lib/rate-limit'

type RateLimiterKey = keyof NonNullable<typeof rateLimiters>

// Rotas sensíveis a força-bruta/bot (login, cadastro). Outras rotas passam
// direto — rate limit geral de API fica pra quando houver tráfego real.
const LIMITED_ROUTES: Record<string, RateLimiterKey> = {
  '/api/auth/login': 'login',
  '/api/auth/cadastro': 'cadastro',
}

export async function proxy(request: NextRequest) {
  const routeKey = LIMITED_ROUTES[request.nextUrl.pathname]

  if (routeKey && rateLimiters) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const { success, limit, remaining, reset } =
      await rateLimiters[routeKey].limit(ip)

    if (!success) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em instantes.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      )
    }
  }

  // Refresh de sessão do Supabase — sem isso, o token expira (~1h) e o
  // usuário é deslogado silenciosamente mesmo sem ter clicado em Sair.
  // Padrão oficial do @supabase/ssr: getUser() aqui reescreve o cookie de
  // sessão quando o token é renovado, propagado pra request e response.
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    // Roda em toda rota, exceto assets estáticos e imagens do Next —
    // é o que mantém a sessão viva durante a navegação normal.
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|apple-touch-icon\\.png).*)',
  ],
}
