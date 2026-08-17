import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { PerfilForm } from '@/components/perfil/perfil-form'

// Nunca busca/exibe email aqui — CLAUDE.md seção 10: "Dados privados
// (email) nunca aparecem nem pro próprio dono na tela de Perfil".
export default async function PerfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome, telefone')
    .eq('id', user.id)
    .single()

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Meu Perfil" backHref="/menu" />
      <PerfilForm
        nomeInicial={profile?.nome ?? ''}
        telefoneInicial={profile?.telefone ?? ''}
      />
    </main>
  )
}
