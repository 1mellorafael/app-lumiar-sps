import Link from 'next/link'
import { Settings, Share2, Smartphone, MessageSquare, HelpCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AccountSection } from '@/components/menu/account-section'
import { createClient } from '@/lib/supabase/server'

export default async function MenuPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="mx-auto flex max-w-md flex-col gap-2 p-4">
      <h1 className="text-primary-500 mb-2 text-lg font-bold">Menu</h1>

      <AccountSection email={user?.email ?? null} />

      {/* Seção App */}
      <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <Smartphone className="text-primary-500 size-4" />
          <h2 className="text-neutral-text text-sm font-semibold">App</h2>
        </div>
        <Button variant="ghost" className="justify-start" size="sm">
          <Smartphone className="mr-2 size-4" />
          Adicionar à tela inicial
        </Button>
        <Button variant="ghost" className="justify-start" size="sm">
          <Share2 className="mr-2 size-4" />
          Compartilhar
        </Button>
      </section>

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
