import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Normaliza texto pra comparação de busca: só maiúscula/minúscula e
// acento são dobrados — pontuação e espaço ficam como estão, porque
// fazem parte do que a pessoa quis buscar. "estetica" casa com
// "Estética!" (tudo antes do "!"), mas "estetica!" só casa com algo que
// também tenha o "!" (em qualquer combinação de maiúscula/acento)
export function normalizeSearch(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Auto-capitaliza cada palavra (ex: "joão silva" -> "João Silva"), usado
// no campo Nome do cadastro (CLAUDE.md seção 7)
export function capitalizeWords(text: string): string {
  return text.replace(
    /\p{L}+/gu,
    (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
  )
}

// Telefone é salvo só com dígitos no banco (whatsappHref precisa disso
// pro link do wa.me) — essa função formata pra exibição, "(22) 99999-9999"
export function formatarTelefone(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 2) return cleaned
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
}
