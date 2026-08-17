export function whatsappHref(numero: string, nomeNegocio: string) {
  const mensagem = encodeURIComponent(
    `Olá! Vi seu negócio "${nomeNegocio}" no app Lumiar/São Pedro da Serra.`
  )
  return `https://wa.me/${numero}?text=${mensagem}`
}
