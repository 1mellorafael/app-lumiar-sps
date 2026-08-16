import { NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.senha,
  })

  if (error) {
    // Mensagem genérica — não revela se o email existe ou não
    return NextResponse.json(
      { error: 'Email ou senha incorretos.' },
      { status: 401 }
    )
  }

  return NextResponse.json({ success: true })
}
