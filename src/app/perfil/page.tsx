import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { PerfilForm } from '@/components/perfil/perfil-form'

// Decisão de 17/08 (revisa a anterior): email passa a aparecer aqui,
// só leitura — trocar email exige fluxo de confirmação do Supabase Auth
// que ainda não existe, então não é editável por este formulário.
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
        email={user.email ?? ''}
      />
    </main>
  )
}
