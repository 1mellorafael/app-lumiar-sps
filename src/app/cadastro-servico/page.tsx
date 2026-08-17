import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ServicoForm } from '@/components/cadastro-servico/form'

export default async function CadastroServicoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Quem não tem conta ainda cria uma pelo /login (link "Criar conta" lá)
  // — evita mandar quem já tem conta de volta pro formulário de cadastro
  // e esbarrar em "email já cadastrado"
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('telefone')
    .eq('id', user.id)
    .single()

  return <ServicoForm telefoneConta={profile?.telefone ?? ''} />
}
