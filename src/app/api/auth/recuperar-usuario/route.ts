import { NextResponse } from 'next/server'
import { recuperarUsuarioSchema } from '@/lib/validations/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { enviarEmailUsuario } from '@/lib/resend'

// Mensagem de sucesso é sempre a mesma, exista ou não o email — mesmo
// espírito anti-enumeração do /api/auth/recuperar-senha
const MENSAGEM_GENERICA =
  'Se esse email tiver uma conta, mandamos o usuário pra ele.'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = recuperarUsuarioSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const admin = createAdminClient()
  // Não existe "getUserByEmail" no admin API — a base é pequena
  // (comunidade local), então listar e filtrar é aceitável aqui.
  const { data: listaUsuarios } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })
  const usuario = listaUsuarios?.users.find(
    (u) => u.email?.toLowerCase() === parsed.data.email
  )

  if (usuario) {
    const { data: profile } = await admin
      .from('profiles')
      .select('username')
      .eq('id', usuario.id)
      .maybeSingle()

    if (profile?.username && usuario.email) {
      await enviarEmailUsuario(usuario.email, profile.username).catch(() => null)
    }
  }

  return NextResponse.json({ message: MENSAGEM_GENERICA })
}
