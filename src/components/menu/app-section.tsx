'use client'

import { Smartphone, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInstallPrompt } from '@/lib/use-install-prompt'

export function AppSection() {
  const { installed, promptInstall } = useInstallPrompt()

  return (
    <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <Smartphone className="text-primary-500 size-4" />
        <h2 className="text-neutral-text text-sm font-semibold">App</h2>
      </div>
      {!installed && (
        <Button
          variant="ghost"
          className="justify-start"
          size="sm"
          onClick={promptInstall}
        >
          <Smartphone className="mr-2 size-4" />
          Adicionar à tela inicial
        </Button>
      )}
      <Button variant="ghost" className="justify-start" size="sm">
        <Share2 className="mr-2 size-4" />
        Compartilhar
      </Button>
    </section>
  )
}
