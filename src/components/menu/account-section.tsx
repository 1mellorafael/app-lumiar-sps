'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogIn, LogOut, Briefcase, User, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Este componente em si não lida com email — quem mostra nome/telefone/
// email é a tela /perfil (CLAUDE.md seção 10)
export function AccountSection({
  loggedIn,
  totalNegocios,
}: {
  loggedIn: boolean
  totalNegocios: number
}) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center gap-2">
        {loggedIn ? (
          <User className="text-primary-500 size-4" />
        ) : (
          <LogIn className="text-primary-500 size-4" />
        )}
        <h2 className="text-neutral-text text-sm font-semibold">
          {loggedIn ? 'Meu Perfil' : 'Conta'}
        </h2>
      </div>
      {loggedIn ? (
        <>
          <Button variant="ghost" className="justify-start" size="sm" asChild>
            <Link href="/perfil">
              <User className="mr-2 size-4" />
              Meus dados
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" size="sm" asChild>
            <Link href="/postar">
              <Megaphone className="mr-2 size-4" />
              Publicar post
            </Link>
          </Button>
          {totalNegocios > 0 && (
            // "Cadastrar outro negócio" mora dentro dessa tela — não
            // compete aqui no Menu (decisão de 17/08). Quando ainda não
            // tem nenhum, o convite pra cadastrar mora numa seção
            // separada mais abaixo (ver menu/page.tsx) — junto de "Meus
            // dados" parecia forçar o cadastro de negócio (feedback de
            // 18/08)
            <Button variant="ghost" className="justify-start" size="sm" asChild>
              <Link href="/meus-negocios">
                <Briefcase className="mr-2 size-4" />
                Meus negócios ({totalNegocios})
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            className="justify-start"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut className="mr-2 size-4" />
            {loggingOut ? 'Saindo...' : 'Sair'}
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" className="justify-start" size="sm" asChild>
            <Link href="/login">Fazer login</Link>
          </Button>
          <Button variant="ghost" className="justify-start" size="sm" asChild>
            <Link href="/cadastro">Criar conta</Link>
          </Button>
        </>
      )}
    </section>
  )
}
