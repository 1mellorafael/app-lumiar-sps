import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/layout/bottom-nav'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'App de Lumiar',
  description:
    'Conecta prestadores de serviço a clientes em Lumiar e São Pedro da Serra',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <div className="pb-16">{children}</div>
        <BottomNav />
      </body>
    </html>
  )
}
