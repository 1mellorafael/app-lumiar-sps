import { createAdminClient } from '@/lib/supabase/admin'

const EXPIRA_EM_SEGUNDOS = 60 * 60 // 1h — só precisa durar o carregamento da página

// Admin client bypassa RLS de storage — quem decide se a foto pode ser
// vista é o backend (status ativo, ou dono vendo o próprio pendente),
// não uma policy de leitura pública no bucket.
export async function fotoSignedUrl(path: string | null): Promise<string | null> {
  if (!path) return null
  const admin = createAdminClient()
  const { data } = await admin.storage
    .from('prestador-fotos')
    .createSignedUrl(path, EXPIRA_EM_SEGUNDOS)
  return data?.signedUrl ?? null
}
