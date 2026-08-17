import { unstable_cache } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

const EXPIRA_EM_SEGUNDOS = 60 * 60 // 1h — só precisa durar o carregamento da página

// Admin client bypassa RLS de storage — quem decide se a foto pode ser
// vista é o backend (status ativo, ou dono vendo o próprio pendente),
// não uma policy de leitura pública no bucket.
async function gerarSignedUrl(path: string): Promise<string | null> {
  const admin = createAdminClient()
  const { data } = await admin.storage
    .from('prestador-fotos')
    .createSignedUrl(path, EXPIRA_EM_SEGUNDOS)
  return data?.signedUrl ?? null
}

// createSignedUrl é um endpoint bem mais lento que uma query normal do
// Supabase (~200-450ms medido, contra ~90ms de uma select comum) —
// cacheado por menos tempo que a validade da própria URL (1h), pra nunca
// servir uma expirada, mas evitar refazer essa chamada cara em toda
// visita à mesma foto.
const gerarSignedUrlCached = unstable_cache(gerarSignedUrl, ['foto-signed-url'], {
  revalidate: 50 * 60,
})

export async function fotoSignedUrl(path: string | null): Promise<string | null> {
  if (!path) return null
  return gerarSignedUrlCached(path)
}
