'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BarChart3, TrendingUp } from 'lucide-react'
import { storage } from '@/lib/storage'
import { PerformanceAnalytics } from '@/components/PerformanceAnalytics'
import type { UserProgress } from '@/lib/types'

export default function AnalysisPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const p = storage.getProgress()

    if (!p.examType || p.examType !== 'encceja') {
      window.location.href = '/modalidade'
      return
    }

    setProgress(p)
    setLoaded(true)
  }, [])

  if (!loaded || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-4">
              <ArrowLeft size={20} />
              Voltar
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
              <BarChart3 size={32} />
              Análise de Desempenho
            </h1>
            <p className="text-slate-400 mt-2">Acompanhe seu progresso e identifique áreas para melhorar</p>
          </div>
        </div>

        {/* Analytics */}
        <PerformanceAnalytics progress={progress} />

        {/* Próximos Passos */}
        <div className="mt-8 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={24} />
            Próximos Passos Recomendados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/estudo-encceja"
              className="bg-slate-900/50 hover:bg-slate-900 border border-slate-700 hover:border-violet-500/50 rounded-lg p-4 transition-all"
            >
              <h3 className="font-semibold text-white mb-2">Continuar Estudando</h3>
              <p className="text-sm text-slate-400">Volte aos tópicos e continue sua jornada de aprendizado</p>
            </Link>

            <Link
              href="/simulados"
              className="bg-slate-900/50 hover:bg-slate-900 border border-slate-700 hover:border-violet-500/50 rounded-lg p-4 transition-all"
            >
              <h3 className="font-semibold text-white mb-2">Fazer Simulados</h3>
              <p className="text-sm text-slate-400">Teste seus conhecimentos com simulados completos</p>
            </Link>

            <Link
              href="/"
              className="bg-slate-900/50 hover:bg-slate-900 border border-slate-700 hover:border-violet-500/50 rounded-lg p-4 transition-all"
            >
              <h3 className="font-semibold text-white mb-2">Voltar ao Dashboard</h3>
              <p className="text-sm text-slate-400">Veja sua recomendação personalizada de estudo</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
