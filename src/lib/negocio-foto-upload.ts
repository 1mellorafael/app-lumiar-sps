import { FOTO_MAX_BYTES, FOTO_TIPOS_ACEITOS } from '@/lib/validations/negocio'
import type { SupabaseClient } from '@supabase/supabase-js'

export function extensaoPor(mime: string) {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  return 'jpg'
}

export function validarFoto(file: File | null, obrigatoria: boolean, label: string) {
  if (!file || file.size === 0) {
    return obrigatoria ? `${label} é obrigatória` : null
  }
  if (!FOTO_TIPOS_ACEITOS.includes(file.type)) {
    return 'Formato de imagem inválido (use JPG, PNG ou WEBP)'
  }
  if (file.size > FOTO_MAX_BYTES) {
    return 'Imagem muito grande (máximo 5MB)'
  }
  return null
}

export async function uploadFoto(
  supabase: SupabaseClient,
  file: File,
  userId: string,
  prefixo: 'principal' | 'capa'
): Promise<{ caminho: string | null; erro: string | null }> {
  const caminho = `${userId}/${prefixo}-${Date.now()}.${extensaoPor(file.type)}`
  const { error } = await supabase.storage
    .from('prestador-fotos')
    .upload(caminho, file, { contentType: file.type })

  if (error) {
    return {
      caminho: null,
      erro: `Não foi possível enviar a foto ${prefixo === 'principal' ? 'principal' : 'de capa'}. Tente novamente.`,
    }
  }
  return { caminho, erro: null }
}
