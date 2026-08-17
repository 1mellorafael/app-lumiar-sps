import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { statusNegocioSchema } from '@/lib/validations/admin'
import { createClient } from '@/lib/supabase/server'
import { NEGOCIOS_ATIVOS_TAG } from '@/lib/negocios'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Faça login pra continuar.' }, { status: 401 })
  }

  // Checagem explícita além da RLS (defesa em profundidade) — RLS já
  // bloqueia o update se não for admin, isso só dá um erro mais claro
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = statusNegocioSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  // whitelist explícita: admin só muda status, nunca outros campos do
  // negócio — isso continua sendo papel do dono (CLAUDE.md item 8)
  const { error } = await supabase
    .from('negocios')
    .update({ status: parsed.data.status })
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: 'Não foi possível atualizar. Tente novamente.' },
      { status: 500 }
    )
  }

  // Aprovar/rejeitar muda quem aparece na Busca — sem isso, a lista
  // cacheada só atualizaria depois dos 30s de revalidate
  revalidateTag(NEGOCIOS_ATIVOS_TAG, 'max')

  return NextResponse.json({ ok: true })
}
