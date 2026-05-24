import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'FAÇA ENEM — Plataforma de Estudos',
  description: 'Prepare-se para o ENEM com técnicas científicas de aprendizagem',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  )
}
