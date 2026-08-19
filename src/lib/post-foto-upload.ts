import { FOTO_MAX_BYTES, FOTO_TIPOS_ACEITOS } from '@/lib/validations/negocio'
import { extensaoPor } from '@/lib/negocio-foto-upload'
import type { SupabaseClient } from '@supabase/supabase-js'

export function validarFotoPost(file: File | null, obrigatoria: boolean) {
  if (!file || file.size === 0) {
    return obrigatoria ? 'Foto é obrigatória' : null
  }
  if (!FOTO_TIPOS_ACEITOS.includes(file.type)) {
    return 'Formato de imagem inválido (use JPG, PNG ou WEBP)'
  }
  if (file.size > FOTO_MAX_BYTES) {
    return 'Imagem muito grande (máximo 5MB)'
  }
  return null
}

// posts-fotos é bucket público (post não tem estado "pendente" pra
// esconder) — retorna a URL pública direto, sem URL assinada.
export async function uploadFotoPost(
  supabase: SupabaseClient,
  file: File,
  userId: string
): Promise<{ url: string | null; erro: string | null }> {
  const caminho = `${userId}/${Date.now()}.${extensaoPor(file.type)}`
  const { error } = await supabase.storage
    .from('posts-fotos')
    .upload(caminho, file, { contentType: file.type })

  if (error) {
    return { url: null, erro: 'Não foi possível enviar a foto. Tente novamente.' }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('posts-fotos').getPublicUrl(caminho)

  return { url: publicUrl, erro: null }
}
