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
