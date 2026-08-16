import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { BottomNav } from '@/components/layout/bottom-nav'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'App de Lumiar',
  description:
    'Conecta prestadores de serviço a clientes em Lumiar e São Pedro da Serra',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lumiar',
  },
}

export const viewport = {
  themeColor: '#0F6E5C',
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
