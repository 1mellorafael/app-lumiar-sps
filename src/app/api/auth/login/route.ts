import { NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  // Login é por usuário, mas o Auth do Supabase autentica por email —
  // resolve usuário -> email via admin client (service_role, só roda
  // aqui) antes de chamar signInWithPassword. Mensagem de erro genérica
  // em qualquer etapa que falhar, pra não revelar se o usuário existe.
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('username', parsed.data.username)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json(
      { error: 'Usuário ou senha incorretos.' },
      { status: 401 }
    )
  }

  const { data: userData, error: userError } = await admin.auth.admin.getUserById(
    profile.id
  )

  if (userError || !userData.user?.email) {
    return NextResponse.json(
      { error: 'Usuário ou senha incorretos.' },
      { status: 401 }
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: parsed.data.senha,
  })

  if (error) {
    // "Email not confirmed" é mensagem própria do Auth — vale distinguir
    // pra pessoa saber que precisa confirmar, não que errou a senha
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return NextResponse.json(
        { error: 'Confirme seu email antes de entrar — veja o link que mandamos.' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Usuário ou senha incorretos.' },
      { status: 401 }
    )
  }

  return NextResponse.json({ success: true })
}
