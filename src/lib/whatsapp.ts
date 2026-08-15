export function whatsappHref(numero: string, nomeServico: string) {
  const mensagem = encodeURIComponent(
    `Olá! Vi seu serviço "${nomeServico}" no app Lumiar/São Pedro da Serra.`
  )
  return `https://wa.me/${numero}?text=${mensagem}`
}
