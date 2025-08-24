import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/mobile.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ArenaSobral - Plataforma de Futebol Amador',
  description: 'Conectando jogadores, times e areninhas em Sobral, Ceará',
  keywords: ['futebol', 'sobral', 'times', 'jogadores', 'areninha'],
  authors: [{ name: 'ArenaSobral Team' }],
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  themeColor: '#1e293b',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ArenaSobral'
  },
  formatDetection: {
    telephone: false
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}