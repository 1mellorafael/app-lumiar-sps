import { FOTO_MAX_BYTES, FOTO_TIPOS_ACEITOS } from '@/lib/validations/negocio'
import { extensaoPor } from '@/lib/negocio-foto-upload'
import type { SupabaseClient } from '@supabase/supabase-js'

export function validarFotoPerfil(file: File | null) {
  if (!file || file.size === 0) return null // opcional — cadastro leve
  if (!FOTO_TIPOS_ACEITOS.includes(file.type)) {
    return 'Formato de imagem inválido (use JPG, PNG ou WEBP)'
  }
  if (file.size > FOTO_MAX_BYTES) {
    return 'Imagem muito grande (máximo 5MB)'
  }
  return null
}

// perfil-fotos é bucket público — retorna a URL pública direto.
export async function uploadFotoPerfil(
  supabase: SupabaseClient,
  file: File,
  userId: string
): Promise<{ url: string | null; erro: string | null }> {
  const caminho = `${userId}/${Date.now()}.${extensaoPor(file.type)}`
  const { error } = await supabase.storage
    .from('perfil-fotos')
    .upload(caminho, file, { contentType: file.type })

  if (error) {
    return { url: null, erro: 'Não foi possível enviar a foto. Tente novamente.' }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('perfil-fotos').getPublicUrl(caminho)

  return { url: publicUrl, erro: null }
}
