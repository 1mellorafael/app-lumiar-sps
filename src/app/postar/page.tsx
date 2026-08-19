import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostForm } from '@/components/postar/post-form'

export default async function PostarPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: negociosRaw }] = await Promise.all([
    supabase.from('profiles').select('nome, telefone').eq('id', user.id).single(),
    supabase
      .from('negocios')
      .select('id, nome_negocio, telefone_contato')
      .eq('profile_id', user.id)
      .eq('status', 'ativo'),
  ])

  const negocios = (negociosRaw ?? []).map((n) => ({
    id: n.id,
    nomeNegocio: n.nome_negocio,
    telefoneContato: n.telefone_contato,
  }))

  return (
    <PostForm
      nomePerfil={profile?.nome ?? ''}
      telefonePerfil={profile?.telefone ?? ''}
      negocios={negocios}
    />
  )
}
