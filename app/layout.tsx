import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'FAÇA ENEM — Plataforma de Estudos',
  description: 'Prepare-se para o ENEM e Encceja com técnicas científicas de aprendizagem',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover',
  themeColor: '#0f172a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 antialiased flex-col md:flex-row">
        <Navbar />
        <main className="flex-1 overflow-y-auto w-full">{children}</main>
      </body>
    </html>
  )
}
