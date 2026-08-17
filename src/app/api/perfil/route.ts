import { NextResponse } from 'next/server'
import { perfilSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'

// Só nome e telefone são aceitos daqui — is_admin nunca vem do cliente
// (CLAUDE.md item 8, whitelist de campos)
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = perfilSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { nome, telefone } = parsed.data

  const { error } = await supabase
    .from('profiles')
    .update({ nome, telefone })
    .eq('id', user.id)

  if (error) {
    if (error.message.includes('profiles_telefone_key')) {
      return NextResponse.json(
        { error: 'Este telefone já está em uso por outra conta.', field: 'telefone' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Não foi possível salvar. Tente novamente.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
