import { NextResponse, type NextRequest } from 'next/server'
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

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/auth/login', '/api/auth/cadastro'],
}
