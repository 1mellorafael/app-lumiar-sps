import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import { fotoSignedUrl } from '@/lib/supabase/signed-url'
import { localizacoesAbrev } from '@/lib/mock-data'
import { formatarTelefone } from '@/lib/utils'
import type { NegocioCard } from '@/lib/negocio-card'

export const NEGOCIOS_ATIVOS_TAG = 'negocios-ativos'

// Só os campos públicos de um negócio ativo — RLS já barra pendente pra
// quem não é dono/admin, mas o select também limita o que sai daqui.
// Cacheado por 30s (client público, sem cookies) — sem isso, toda
// navegação pra Busca/Categorias refazia a query + gerava signed URL de
// cada foto na hora, cada uma um round-trip pro Supabase. revalidateTag
// invalida na hora quando um negócio é aprovado/editado.
async function buscarNegociosAtivos(): Promise<NegocioCard[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('negocios')
    .select(
      'id, nome_negocio, categorias, localizacoes, descricao, telefone_contato, foto_principal_url, foto_principal_pos_x, foto_principal_pos_y'
    )
    .eq('status', 'ativo')
    .order('created_at', { ascending: false })

  if (!data) return []

  return Promise.all(
    data.map(async (n) => ({
      id: n.id,
      nomeNegocio: n.nome_negocio,
      categoriaSlugs: n.categorias,
      descricao: n.descricao ?? '',
      whatsapp: n.telefone_contato,
      telefoneDisplay: formatarTelefone(n.telefone_contato),
      localizacaoLabel: localizacoesAbrev(n.localizacoes),
      fotoPrincipalUrl: await fotoSignedUrl(n.foto_principal_url),
      fotoPrincipalPos: { x: n.foto_principal_pos_x, y: n.foto_principal_pos_y },
    }))
  )
}

export const getNegociosAtivos = unstable_cache(
  buscarNegociosAtivos,
  ['negocios-ativos'],
  { revalidate: 30, tags: [NEGOCIOS_ATIVOS_TAG] }
)
