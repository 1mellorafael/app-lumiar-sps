import { Resend } from 'resend'

// Sem a key configurada (RESEND_API_KEY em .env.local), envio de email
// vira no-op — nunca deve travar um fluxo (cadastro, etc) por causa de
// email transacional falhando ou não configurado ainda.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = 'App Lumiar/São Pedro da Serra <onboarding@resend.dev>'

export async function enviarEmailBoasVindas(email: string, nome: string) {
  if (!resend) return

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Bem-vindo(a) ao App de Lumiar/São Pedro da Serra!',
    html: `
      <p>Oi, ${nome}!</p>
      <p>Sua conta no app de Lumiar/São Pedro da Serra já está pronta.</p>
      <p>Por aqui você acompanha eventos, cursos, anúncios e avisos da comunidade,
      e pode cadastrar seu negócio pra aparecer pra quem procura por aqui.</p>
      <p>Qualquer dúvida, é só responder este email.</p>
    `,
  })
}

export async function enviarEmailUsuario(email: string, username: string) {
  if (!resend) return

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Seu usuário no App de Lumiar/São Pedro da Serra',
    html: `
      <p>Oi!</p>
      <p>Você pediu pra lembrar seu usuário de login. É:</p>
      <p style="font-size: 18px; font-weight: bold;">${username}</p>
      <p>Se não foi você quem pediu, pode ignorar este email.</p>
    `,
  })
}
