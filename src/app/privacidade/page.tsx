import { PageHeader } from '@/components/shared/page-header'

export default function PrivacidadePage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Política de Privacidade" backHref="/menu" />
      <p className="text-muted-foreground text-center text-xs">
        Versão preliminar — texto final revisado com apoio jurídico antes do
        lançamento público (ver seção 13 do CLAUDE.md do projeto).
      </p>

      <div className="text-neutral-text flex flex-col gap-4 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold">1. Quais dados coletamos</h2>
          <p>
            Pra navegar e buscar negócios, não coletamos nenhum dado — não
            é preciso login. Pra cadastrar um negócio, pedimos apenas
            nome, email, telefone e senha. Não coletamos CPF, endereço
            completo, nem data de nascimento.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">2. Como usamos seus dados</h2>
          <p>
            Usamos email e senha pra autenticação da sua conta, e telefone
            e email pra contato sobre o status do seu cadastro. Não usamos
            seus dados pra nenhuma outra finalidade.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">3. O que fica público</h2>
          <p>
            Enquanto seu negócio está com status pendente, nenhuma
            informação sua aparece publicamente — nem foto, nem nome, nem
            categoria. Depois de aprovado, ficam públicos apenas: foto
            principal, foto de capa, nome do negócio, categoria,
            descrição, Instagram e o botão de contato via WhatsApp. Email
            e senha nunca ficam públicos, mesmo depois de aprovado.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">4. Com quem compartilhamos</h2>
          <p>
            Não vendemos nem compartilhamos seus dados com terceiros pra
            fins de marketing. Usamos o Supabase como infraestrutura de
            banco de dados e autenticação — ele processa os dados em
            nosso nome, sob as mesmas regras desta política.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">5. Segurança</h2>
          <p>
            Sua senha nunca é armazenada em texto plano — usamos o sistema
            de autenticação nativo do Supabase, que aplica hash
            criptográfico. Toda comunicação com o app é feita via HTTPS.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">6. Seus direitos (LGPD)</h2>
          <p>
            Você pode solicitar acesso, correção ou exclusão dos seus
            dados a qualquer momento, usando a opção Enviar Sugestão no
            Menu ou removendo sua conta diretamente pelo app quando essa
            função estiver disponível.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">7. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta política conforme o app evolui.
            Mudanças relevantes serão comunicadas dentro do próprio app.
          </p>
        </section>
      </div>
    </main>
  )
}
