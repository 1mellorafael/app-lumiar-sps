// wa.me só aceita dígitos com DDI — números vindos do form de cadastro
// chegam formatados ("(21) 98765-4321"), sem o 55 na frente
function whatsappHrefTexto(numero: string, mensagem: string) {
  const digitos = numero.replace(/\D/g, '')
  const comDdi = digitos.startsWith('55') ? digitos : `55${digitos}`
  return `https://wa.me/${comDdi}?text=${encodeURIComponent(mensagem)}`
}

export function whatsappHref(numero: string, nomeNegocio: string) {
  return whatsappHrefTexto(
    numero,
    `Olá! Vi seu negócio "${nomeNegocio}" no app Lumiar/São Pedro da Serra.`
  )
}
