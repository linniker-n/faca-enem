'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  RefreshCw,
  CreditCard,
  ClipboardList,
  PenLine,
  BarChart2,
  GraduationCap,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/estudo', label: 'Estudar', icon: BookOpen, highlight: true },
  { href: '/ciclos', label: 'Ciclos de Estudo', icon: RefreshCw },
  { href: '/flashcards', label: 'Flashcards', icon: CreditCard },
  { href: '/simulado', label: 'Simulado', icon: ClipboardList },
  { href: '/redacao', label: 'Redação', icon: PenLine },
  { href: '/desempenho', label: 'Desempenho', icon: BarChart2 },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-16 lg:w-60 h-screen bg-slate-900 border-r border-slate-800 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 lg:px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <GraduationCap size={18} className="text-white" />
        </div>
        <span className="hidden lg:block font-bold text-white text-sm leading-tight">
          FAÇA<br />
          <span className="text-violet-400">ENEM</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon, highlight }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-all duration-150 group ${
                active
                  ? 'bg-violet-600 text-white'
                  : highlight
                  ? 'text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon
                size={18}
                className={`shrink-0 ${active ? 'text-white' : ''}`}
              />
              <span className="hidden lg:block text-sm font-medium truncate">{label}</span>
              {highlight && !active && (
                <span className="hidden lg:block ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                  novo
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800">
        <p className="hidden lg:block text-xs text-slate-600 text-center leading-tight">
          Técnicas baseadas em<br />evidências científicas
        </p>
      </div>
    </aside>
  )
}
