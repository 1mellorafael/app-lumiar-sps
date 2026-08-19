import { NextResponse } from 'next/server'
import { trocarSenhaSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = trocarSenhaSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { senhaAtual, novaSenha } = parsed.data

  // Confere a senha atual reautenticando antes de trocar — sem isso,
  // qualquer sessão aberta (ex: celular emprestado) trocaria a senha
  // sem provar que é o dono
  const { error: senhaErrada } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: senhaAtual,
  })

  if (senhaErrada) {
    return NextResponse.json(
      { error: 'Senha atual incorreta.', field: 'senhaAtual' },
      { status: 401 }
    )
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: novaSenha,
  })

  if (updateError) {
    return NextResponse.json(
      { error: 'Não foi possível trocar a senha. Tente novamente.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
