export type PasswordStrength = 0 | 1 | 2 | 3

export function getPasswordStrength(senha: string): PasswordStrength {
  if (senha.length === 0) return 0

  // Conta quantas classes de caractere aparecem (minúscula, maiúscula,
  // dígito, símbolo) — antes o critério de "dígito OU símbolo" sozinho
  // já contava ponto, então uma senha só de números (ex: "12345678")
  // pontuava "Média" sem nenhuma diversidade real de caractere.
  let classes = 0
  if (/[a-z]/.test(senha)) classes++
  if (/[A-Z]/.test(senha)) classes++
  if (/\d/.test(senha)) classes++
  if (/[^A-Za-z0-9]/.test(senha)) classes++

  let score = 0
  if (senha.length >= 6) score++
  if (senha.length >= 10) score++
  if (classes >= 2) score++
  if (classes >= 3) score++

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
