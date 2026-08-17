'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Search, Wrench, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/busca', label: 'Busca', icon: Search },
  { href: '/uteis', label: 'Úteis', icon: Wrench },
  { href: '/menu', label: 'Menu', icon: Menu },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleBuscaClick = () => {
    if (pathname === '/busca') {
      // Já está na tela de busca (não numa categoria) — foca o input
      window.dispatchEvent(new CustomEvent('focus-search-input'))
    } else {
      // Navega pra /busca — inclusive vindo de /busca/[slug], que não
      // tem campo de busca nenhum pra focar (clicar não fazia nada)
      router.push('/busca')
    }
  }

  return (
    <nav
      aria-label="Navegação principal"
      className="border-border bg-card fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)

          // Item Busca é especial: clique duplo ativa input, primeiro clique navega
          if (item.label === 'Busca') {
            return (
              <button
                key={item.href}
                onClick={handleBuscaClick}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-all duration-150 ease-standard active:scale-90',
                  active
                    ? 'text-primary-500'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-all duration-150 ease-standard active:scale-90',
                active
                  ? 'text-primary-500'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
