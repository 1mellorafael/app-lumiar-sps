import { PageHeader } from '@/components/shared/page-header'

export default function TermosPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Termos de Uso" backHref="/menu" />
      <p className="text-muted-foreground text-center text-xs">
        Versão preliminar — texto final revisado com apoio jurídico antes do
        lançamento público (ver seção 13 do CLAUDE.md do projeto).
      </p>

      <div className="text-neutral-text flex flex-col gap-4 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold">1. O que é o app</h2>
          <p>
            O App de Lumiar/São Pedro da Serra é uma plataforma gratuita que
            conecta negócios locais a moradores das duas
            localidades. Não cobramos comissão de negócios nem de
            clientes. A navegação é livre e sem necessidade de login —
            login só é exigido pra cadastrar um negócio.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">2. Exclusividade regional</h2>
          <p>
            A plataforma é destinada a negócios de Lumiar e
            São Pedro da Serra. Cadastros de fora dessa região podem ser
            removidos a qualquer momento, sem aviso prévio.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">3. Sua conta</h2>
          <p>
            Pra cadastrar um negócio, pedimos nome, email, telefone e
            senha. Você é responsável por manter essas informações
            corretas e atualizadas, e por não compartilhar sua senha com
            terceiros.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">4. Cadastro de negócio e aprovação</h2>
          <p>
            Todo negócio cadastrado entra com status pendente e passa por
            aprovação manual antes de ficar visível publicamente.
            Reservamo-nos o direito de rejeitar ou remover um cadastro que
            viole estes termos, contenha informação falsa, ou não pertença
            à região atendida pelo app.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">5. Conduta esperada</h2>
          <p>
            Espera-se que negócios e usuários se tratem com respeito e
            forneçam informações verdadeiras. Não é permitido usar a
            plataforma pra golpes, spam, ou conteúdo ofensivo.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">6. O que o app não faz</h2>
          <p>
            O app funciona como uma ponte de contato: o botão de WhatsApp
            leva direto pra conversa entre cliente e negócio. Combinação
            de preço, execução do serviço, pagamento e qualidade do
            atendimento são de responsabilidade exclusiva das partes
            envolvidas — o app não participa dessa relação nem garante
            resultado.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">7. Alterações nestes termos</h2>
          <p>
            Podemos atualizar estes termos conforme o app evolui. Mudanças
            relevantes serão comunicadas dentro do próprio app.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">8. Dúvidas</h2>
          <p>
            Use a opção Enviar Sugestão no Menu pra entrar em contato sobre
            estes termos.
          </p>
        </section>
      </div>
    </main>
  )
}
