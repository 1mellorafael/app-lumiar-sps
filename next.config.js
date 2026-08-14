/** @type {import('next').NextConfig} */

// CSP permite: scripts/estilos próprios + Google Places Autocomplete,
// conexão com Supabase e Google Geocoding/Places. Ajustar aqui se um
// serviço novo (Resend, Sentry etc.) precisar de domínio liberado.
// 'unsafe-eval' só entra em dev — o React precisa disso pra hot reload e
// stack traces, mas nunca é adicionado no build de produção.
const isDev = process.env.NODE_ENV !== 'production'

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://maps.googleapis.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://maps.googleapis.com;
  frame-src 'self' https://www.google.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`
  .replace(/\s{2,}/g, ' ')
  .trim()

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)',
  },
]

const nextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: '/:path*',
      headers: securityHeaders,
    },
  ],
}

module.exports = nextConfig
