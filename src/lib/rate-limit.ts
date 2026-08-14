import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const upstashConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

// Sem Upstash configurado (ex: dev local antes de criar a conta), o rate
// limit vira no-op — nunca bloqueia a aplicação por env var faltando, só
// não protege. Em produção as env vars são obrigatórias (ver .env.example).
export const rateLimiters = upstashConfigured
  ? {
      login: new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, '1 m'),
        prefix: 'ratelimit:login',
      }),
      cadastro: new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, '10 m'),
        prefix: 'ratelimit:cadastro',
      }),
    }
  : null

export function isRateLimitConfigured() {
  return upstashConfigured
}
