import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { getCategoria } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import { fotoSignedUrl } from '@/lib/supabase/signed-url'
import { PendenteCard } from '@/components/admin/pendente-card'
import { PageHeader } from '@/components/shared/page-header'
import { CAMPO_LABELS, type NivelAlerta } from '@/lib/negocio-edicao'

const NIVEL_CLASS: Record<NivelAlerta, string> = {
  alto: 'bg-destructive/10 text-destructive',
  medio: 'bg-secondary-500/10 text-secondary-700',
  baixo: 'bg-muted text-muted-foreground',
}

const NIVEL_LABEL: Record<NivelAlerta, string> = {
  alto: 'Alto',
  medio: 'Médio',
  baixo: 'Baixo',
}

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  // negocios e edicoes não dependem uma da outra — rodar em paralelo
  // corta 2 round-trips pro Supabase (~90ms cada) pra 1
  const [{ data: negociosRaw }, { data: edicoesRaw }] = await Promise.all([
    supabase
      .from('negocios')
      .select(
        'id, nome_negocio, categorias, foto_principal_url, foto_principal_pos_x, foto_principal_pos_y, created_at, profiles(nome)'
      )
      .eq('status', 'pendente')
      .order('created_at', { ascending: true }),
    supabase
      .from('negocio_edicoes')
      .select(
        'id, negocio_id, campos_alterados, nivel_alerta, editado_em, negocios(nome_negocio)'
      )
      .order('editado_em', { ascending: false })
      .limit(20),
  ])

  // profile_id → profiles é N:1 (cada negócio tem 1 dono), então o
  // embed vem como objeto — o tipo inferido pelo client (sem schema
  // gerado) assume array por segurança, mas em runtime é singular
  const negocios = negociosRaw as unknown as Array<{
    id: string
    nome_negocio: string
    categorias: string[]
    foto_principal_url: string | null
    foto_principal_pos_x: number
    foto_principal_pos_y: number
    created_at: string
    profiles: { nome: string } | null
  }> | null

  // Telefone e descrição completa ficam só no clique (/negocio/[id]) —
  // o card serve pra escanear rápido uma fila de pendentes, não pra ler
  // tudo ali (decisão de 17/08)
  const pendentes = await Promise.all(
    (negocios ?? []).map(async (n) => ({
      id: n.id,
      nomeNegocio: n.nome_negocio,
      categoriaNome: n.categorias
        .map((c) => getCategoria(c)?.nome ?? c)
        .join(', '),
      fotoPrincipalUrl: await fotoSignedUrl(n.foto_principal_url),
      fotoPrincipalPos: { x: n.foto_principal_pos_x, y: n.foto_principal_pos_y },
      criadoEm: n.created_at,
      criadoPor: n.profiles?.nome ?? 'Desconhecido',
    }))
  )

  // negocio_id → negocios é N:1, embed vem como objeto (mesmo caso do
  // profiles acima)
  const edicoes = edicoesRaw as unknown as Array<{
    id: string
    negocio_id: string
    campos_alterados: string[]
    nivel_alerta: NivelAlerta
    editado_em: string
    negocios: { nome_negocio: string } | null
  }> | null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Admin" backHref="/menu" />
      <p className="text-muted-foreground text-center text-sm">
        {pendentes.length === 0
          ? 'Nenhum cadastro pendente.'
          : `${pendentes.length} cadastro${pendentes.length > 1 ? 's' : ''} pendente${pendentes.length > 1 ? 's' : ''}`}
      </p>

      <div className="flex flex-col gap-3">
        {pendentes.map((n) => (
          <PendenteCard key={n.id} pendente={n} />
        ))}
      </div>

      {edicoes && edicoes.length > 0 && (
        <div>
          <h2 className="text-neutral-text mb-2 text-sm font-semibold uppercase tracking-wide">
            Edições recentes
          </h2>
          <div className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col overflow-hidden rounded-lg border">
            {edicoes.map((e, i) => (
              <Link
                key={e.id}
                href={`/negocio/${e.negocio_id}`}
                className={`hover:bg-accent active:bg-accent/70 flex items-center gap-2 px-3 py-2.5 transition-colors duration-150 ease-standard ${
                  i !== edicoes.length - 1 ? 'border-border/70 border-b' : ''
                }`}
              >
                {e.nivel_alerta === 'alto' && (
                  <AlertTriangle className="text-destructive size-4 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-card-foreground truncate text-sm font-medium">
                    {e.negocios?.nome_negocio ?? 'Negócio removido'}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {e.campos_alterados.map((c) => CAMPO_LABELS[c] ?? c).join(', ')}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${NIVEL_CLASS[e.nivel_alerta]}`}
                >
                  {NIVEL_LABEL[e.nivel_alerta]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
