// wa.me só aceita dígitos com DDI — números vindos do form de cadastro
// chegam formatados ("(21) 98765-4321"), sem o 55 na frente
export function whatsappHref(numero: string, nomeNegocio: string) {
  const digitos = numero.replace(/\D/g, '')
  const comDdi = digitos.startsWith('55') ? digitos : `55${digitos}`
  const mensagem = encodeURIComponent(
    `Olá! Vi seu negócio "${nomeNegocio}" no app Lumiar/São Pedro da Serra.`
  )
  return `https://wa.me/${comDdi}?text=${mensagem}`
}
