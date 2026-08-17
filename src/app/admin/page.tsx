import { redirect } from 'next/navigation'
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

  const { data: prestadoresRaw } = await supabase
    .from('prestadores')
    .select(
      'id, nome_servico, categoria, descricao, telefone_contato, foto_principal_url, created_at, profiles(nome)'
    )
    .eq('status', 'pendente')
    .order('created_at', { ascending: true })

  // profile_id → profiles é N:1 (cada prestador tem 1 dono), então o
  // embed vem como objeto — o tipo inferido pelo client (sem schema
  // gerado) assume array por segurança, mas em runtime é singular
  const prestadores = prestadoresRaw as unknown as Array<{
    id: string
    nome_servico: string | null
    categoria: string
    descricao: string | null
    telefone_contato: string
    foto_principal_url: string | null
    created_at: string
    profiles: { nome: string } | null
  }> | null

  const pendentes = await Promise.all(
    (prestadores ?? []).map(async (p) => ({
      id: p.id,
      nomeServico: p.nome_servico || 'Serviço sem nome',
      categoriaNome: getCategoria(p.categoria)?.nome ?? p.categoria,
      telefoneContato: p.telefone_contato,
      descricao: p.descricao,
      fotoPrincipalUrl: await fotoSignedUrl(p.foto_principal_url),
      criadoEm: p.created_at,
      criadoPor: p.profiles?.nome ?? 'Desconhecido',
    }))
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <div>
        <h1 className="text-primary-500 text-lg font-bold">Admin</h1>
        <p className="text-muted-foreground text-sm">
          {pendentes.length === 0
            ? 'Nenhum cadastro pendente.'
            : `${pendentes.length} cadastro${pendentes.length > 1 ? 's' : ''} pendente${pendentes.length > 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {pendentes.map((p) => (
          <PendenteCard key={p.id} pendente={p} />
        ))}
      </div>
    </main>
  )
}
