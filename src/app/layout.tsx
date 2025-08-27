import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Arena Sobral App',
  description: 'Arena Sobral Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}