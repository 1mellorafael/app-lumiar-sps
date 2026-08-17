import Link from 'next/link'
import {
  Settings,
  MessageSquare,
  HelpCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AccountSection } from '@/components/menu/account-section'
import { AppSection } from '@/components/menu/app-section'
import { createClient } from '@/lib/supabase/server'

export default async function MenuPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // "Cadastrar negócio" só faz sentido pra quem ainda não tem nenhum —
  // uma vez que tem, a ação de adicionar mais um vive dentro de "Meus
  // Negócios", não como item concorrente no Menu principal
  const { data: negociosDoUsuario } = user
    ? await supabase.from('negocios').select('id').eq('profile_id', user.id)
    : { data: null }
  const totalNegocios = negociosDoUsuario?.length ?? 0

  const { data: profile } = user
    ? await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    : { data: null }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-2 p-4">
      <AccountSection loggedIn={!!user} totalNegocios={totalNegocios} />

      {profile?.is_admin && (
        <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary-500 size-4" />
            <h2 className="text-neutral-text text-sm font-semibold">Admin</h2>
          </div>
          <Button variant="ghost" className="justify-start" size="sm" asChild>
            <Link href="/admin">Aprovar cadastros</Link>
          </Button>
        </section>
      )}

      <AppSection />

      {/* Seção Configurações */}
      <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <Settings className="text-primary-500 size-4" />
          <h2 className="text-neutral-text text-sm font-semibold">Configurações</h2>
        </div>
        <Button variant="ghost" className="justify-start" size="sm">
          Tema (claro/escuro)
        </Button>
        <Button variant="ghost" className="justify-start" size="sm">
          Idioma (PT/EN)
        </Button>
      </section>

      {/* Seção Feedback */}
      <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-primary-500 size-4" />
          <h2 className="text-neutral-text text-sm font-semibold">Feedback</h2>
        </div>
        <Button variant="ghost" className="justify-start" size="sm">
          Enviar sugestão
        </Button>
        <Button variant="ghost" className="justify-start" size="sm">
          Reportar problema
        </Button>
      </section>

      {/* Seção Sobre */}
      <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="text-primary-500 size-4" />
          <h2 className="text-neutral-text text-sm font-semibold">Sobre</h2>
        </div>
        <Link
          href="/termos"
          className="text-primary-500 hover:text-primary-600 flex items-center gap-2 rounded px-2 py-1 text-xs font-medium"
        >
          <FileText className="size-3" />
          Termos de Uso
        </Link>
        <Link
          href="/privacidade"
          className="text-primary-500 hover:text-primary-600 flex items-center gap-2 rounded px-2 py-1 text-xs font-medium"
        >
          <FileText className="size-3" />
          Política de Privacidade
        </Link>
        <p className="text-muted-foreground px-2 py-1 text-xs">
          Versão 0.1.0 • Lumiar & São Pedro da Serra
        </p>
      </section>
    </main>
  )
}
