import { NextResponse } from 'next/server'
import { validarFotoPerfil, uploadFotoPerfil } from '@/lib/perfil-foto-upload'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const form = await request.formData().catch(() => null)
  const foto = form?.get('foto')
  if (!(foto instanceof File)) {
    return NextResponse.json({ error: 'Nenhuma foto enviada' }, { status: 400 })
  }

  const erroFoto = validarFotoPerfil(foto)
  if (erroFoto) {
    return NextResponse.json({ error: erroFoto }, { status: 400 })
  }

  const { url, erro } = await uploadFotoPerfil(supabase, foto, user.id)
  if (erro || !url) {
    return NextResponse.json({ error: erro }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ foto_url: url })
    .eq('id', user.id)

  if (updateError) {
    return NextResponse.json(
      { error: 'Foto enviada, mas não foi possível salvar. Tente novamente.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ url })
}
