'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogIn, LogOut, Briefcase, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Nunca recebe/exibe email — CLAUDE.md seção 10: "Dados privados (email)
// nunca aparecem nem pro próprio dono na tela de Perfil".
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
        <LogIn className="text-primary-500 size-4" />
        <h2 className="text-neutral-text text-sm font-semibold">Conta</h2>
      </div>
      {loggedIn ? (
        <>
          {totalNegocios > 0 ? (
            // "Cadastrar outro negócio" mora dentro dessa tela (Fase 3
            // item 10, ainda não construída) — não compete aqui no Menu
            <Button variant="ghost" className="justify-start" size="sm" disabled>
              <Briefcase className="mr-2 size-4" />
              Meus negócios ({totalNegocios})
            </Button>
          ) : (
            <Button variant="ghost" className="justify-start" size="sm" asChild>
              <Link href="/cadastro-negocio">
                <PlusCircle className="mr-2 size-4" />
                Cadastrar negócio
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
