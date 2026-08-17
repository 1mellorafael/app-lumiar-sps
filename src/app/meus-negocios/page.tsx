import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { getCategoria } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import { fotoSignedUrl } from '@/lib/supabase/signed-url'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  ativo: 'Ativo',
  rejeitado: 'Rejeitado',
}

const STATUS_CLASS: Record<string, string> = {
  pendente: 'bg-secondary-500/10 text-secondary-700',
  ativo: 'bg-primary-500/10 text-primary-700',
  rejeitado: 'bg-destructive/10 text-destructive',
}

export default async function MeusNegociosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: negociosRaw } = await supabase
    .from('negocios')
    .select(
      'id, nome_negocio, categorias, status, foto_principal_url, foto_principal_pos_x, foto_principal_pos_y, created_at'
    )
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })

  const negocios = await Promise.all(
    (negociosRaw ?? []).map(async (n) => ({
      id: n.id,
      nomeNegocio: n.nome_negocio,
      categoriaNome: n.categorias
        .map((c: string) => getCategoria(c)?.nome ?? c)
        .join(', '),
      status: n.status as string,
      fotoPrincipalUrl: await fotoSignedUrl(n.foto_principal_url),
      fotoPrincipalPos: { x: n.foto_principal_pos_x, y: n.foto_principal_pos_y },
    }))
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Meus Negócios" backHref="/menu" />

      <div className="flex justify-end">
        <Button size="sm" asChild>
          <Link href="/cadastro-negocio">
            <PlusCircle className="mr-1.5 size-4" />
            Cadastrar
          </Link>
        </Button>
      </div>

      {negocios.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          Você ainda não cadastrou nenhum negócio.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {negocios.map((n) => (
            <Link
              key={n.id}
              href={`/negocio/${n.id}`}
              className="group border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 ease-decelerate"
            >
              <div className="bg-muted size-12 shrink-0 overflow-hidden rounded-full">
                {n.fotoPrincipalUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={n.fotoPrincipalUrl}
                    alt=""
                    style={{
                      objectPosition: `${n.fotoPrincipalPos.x}% ${n.fotoPrincipalPos.y}%`,
                    }}
                    className="size-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-card-foreground [@media(hover:hover)]:group-hover:text-primary-500 truncate text-sm font-semibold transition-colors">
                  {n.nomeNegocio}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {n.categoriaNome}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${STATUS_CLASS[n.status] ?? 'bg-muted text-muted-foreground'}`}
              >
                {STATUS_LABEL[n.status] ?? n.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
