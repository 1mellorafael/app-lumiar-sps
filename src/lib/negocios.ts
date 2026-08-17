import { createClient } from '@/lib/supabase/server'
import { fotoSignedUrl } from '@/lib/supabase/signed-url'
import { localizacoesAbrev } from '@/lib/mock-data'
import type { NegocioCard } from '@/lib/negocio-card'

// Só os campos públicos de um negócio ativo — RLS já barra pendente pra
// quem não é dono/admin, mas o select também limita o que sai daqui
export async function getNegociosAtivos(): Promise<NegocioCard[]> {
  const supabase = await createClient()
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
      telefoneDisplay: n.telefone_contato,
      localizacaoLabel: localizacoesAbrev(n.localizacoes),
      fotoPrincipalUrl: await fotoSignedUrl(n.foto_principal_url),
      fotoPrincipalPos: { x: n.foto_principal_pos_x, y: n.foto_principal_pos_y },
    }))
  )
}
