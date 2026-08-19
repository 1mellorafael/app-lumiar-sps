import { NextResponse } from 'next/server'
import { recuperarSenhaSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Mensagem de sucesso é sempre a mesma, exista ou não o usuário — não dá
// pra virar oráculo de enumeração de conta (mesmo espírito da checagem
// de telefone/usuário no cadastro)
const MENSAGEM_GENERICA =
  'Se esse usuário existir, mandamos um link de recuperação pro email cadastrado.'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = recuperarSenhaSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('username', parsed.data.username)
    .maybeSingle()

  if (profile) {
    const { data: userData } = await admin.auth.admin.getUserById(profile.id)
    if (userData.user?.email) {
      const origin = new URL(request.url).origin
      const supabase = await createClient()
      await supabase.auth.resetPasswordForEmail(userData.user.email, {
        redirectTo: `${origin}/redefinir-senha`,
      })
    }
  }

  return NextResponse.json({ message: MENSAGEM_GENERICA })
}
