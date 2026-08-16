'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogIn, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AccountSection({ email }: { email: string | null }) {
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
      {email ? (
        <>
          <p className="text-muted-foreground px-2 text-xs">{email}</p>
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
        <Button variant="ghost" className="justify-start" size="sm" asChild>
          <Link href="/login">Fazer login</Link>
        </Button>
      )}
    </section>
  )
}
