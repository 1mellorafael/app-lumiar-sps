export type PasswordStrength = 0 | 1 | 2 | 3

export function getPasswordStrength(senha: string): PasswordStrength {
  if (senha.length === 0) return 0

  let score = 0
  if (senha.length >= 6) score++
  if (senha.length >= 10) score++
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) score++
  if (/\d/.test(senha) || /[^A-Za-z0-9]/.test(senha)) score++

  if (score <= 1) return 1
  if (score <= 2) return 2
  return 3
}

export const PASSWORD_STRENGTH_LABEL: Record<PasswordStrength, string> = {
  0: '',
  1: 'Fraca',
  2: 'Média',
  3: 'Forte',
}
