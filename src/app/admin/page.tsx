import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCategoria } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import { fotoSignedUrl } from '@/lib/supabase/signed-url'
import { PendenteCard } from '@/components/admin/pendente-card'

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

  const { data: negociosRaw } = await supabase
    .from('negocios')
    .select(
      'id, nome_negocio, categoria, foto_principal_url, created_at, profiles(nome)'
    )
    .eq('status', 'pendente')
    .order('created_at', { ascending: true })

  // profile_id → profiles é N:1 (cada negócio tem 1 dono), então o
  // embed vem como objeto — o tipo inferido pelo client (sem schema
  // gerado) assume array por segurança, mas em runtime é singular
  const negocios = negociosRaw as unknown as Array<{
    id: string
    nome_negocio: string | null
    categoria: string
    foto_principal_url: string | null
    created_at: string
    profiles: { nome: string } | null
  }> | null

  // Telefone e descrição completa ficam só no clique (/negocio/[id]) —
  // o card serve pra escanear rápido uma fila de pendentes, não pra ler
  // tudo ali (decisão de 17/08)
  const pendentes = await Promise.all(
    (negocios ?? []).map(async (n) => ({
      id: n.id,
      nomeNegocio: n.nome_negocio || 'Negócio sem nome',
      categoriaNome: getCategoria(n.categoria)?.nome ?? n.categoria,
      fotoPrincipalUrl: await fotoSignedUrl(n.foto_principal_url),
      criadoEm: n.created_at,
      criadoPor: n.profiles?.nome ?? 'Desconhecido',
    }))
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <Link
        href="/menu"
        aria-label="Voltar"
        className="text-neutral-text hover:text-primary-500 flex w-fit items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <div>
        <h1 className="text-primary-500 text-lg font-bold">Admin</h1>
        <p className="text-muted-foreground text-sm">
          {pendentes.length === 0
            ? 'Nenhum cadastro pendente.'
            : `${pendentes.length} cadastro${pendentes.length > 1 ? 's' : ''} pendente${pendentes.length > 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {pendentes.map((n) => (
          <PendenteCard key={n.id} pendente={n} />
        ))}
      </div>
    </main>
  )
}
