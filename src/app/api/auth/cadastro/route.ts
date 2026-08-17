import { NextResponse } from 'next/server'
import { cadastroSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = cadastroSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { nome, email, telefone, senha } = parsed.data
  const supabase = await createClient()

  // Duplicidade de telefone não é coberta pelo Auth nativo (só cobre
  // email) — checa via admin client (service_role, só roda no backend,
  // nunca exposto ao browser). Uma RPC pública equivalente já foi tentada
  // e removida (migration 0004): mesmo só devolvendo um boolean, ela virava
  // um oráculo de enumeração de telefone chamável direto por qualquer um.
  const admin = createAdminClient()
  const { data: telefoneExistente, error: telefoneCheckError } = await admin
    .from('profiles')
    .select('id')
    .eq('telefone', telefone)
    .maybeSingle()

  if (telefoneCheckError) {
    return NextResponse.json(
      { error: 'Não foi possível verificar o telefone. Tente novamente.' },
      { status: 500 }
    )
  }

  if (telefoneExistente) {
    return NextResponse.json(
      { error: 'Este telefone já está cadastrado. Faça login.', field: 'telefone' },
      { status: 409 }
    )
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome, telefone },
    },
  })

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado. Faça login.', field: 'email' },
        { status: 409 }
      )
    }
    // Corrida entre a checagem acima e este signUp (dois cadastros quase
    // simultâneos com o mesmo telefone): a constraint unique do banco
    // barra o segundo, e o erro chega aqui em vez de na checagem.
    if (error.message.toLowerCase().includes('profiles_telefone_key')) {
      return NextResponse.json(
        { error: 'Este telefone já está cadastrado. Faça login.', field: 'telefone' },
        { status: 409 }
      )
    }
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em instantes.' },
        { status: 429 }
      )
    }
    return NextResponse.json(
      { error: 'Não foi possível criar a conta. Tente novamente.' },
      { status: 500 }
    )
  }

  // Proteção de enumeração do Supabase: signUp devolve "sucesso" com
  // identities vazio quando o email já existe, em vez de erro.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return NextResponse.json(
      { error: 'Este email já está cadastrado. Faça login.', field: 'email' },
      { status: 409 }
    )
  }

  return NextResponse.json({
    user: data.user ? { id: data.user.id, email: data.user.email } : null,
    confirmado: !!data.session,
  })
}
