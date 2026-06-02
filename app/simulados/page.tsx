'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, BarChart3, Clock, Target, TrendingUp } from 'lucide-react'
import { ENCCEJA_PROGRESSIVE_TOPICS } from '@/lib/data/encceja-progressive-topics'
import { storage } from '@/lib/storage'
import { mapYearToDifficulty } from '@/lib/encceja-utils'
import type { UserProgress } from '@/lib/types'

interface SimuladoCard {
  id: string
  title: string
  description: string
  type: 'area' | 'topico'
  areaId?: string
  topicoId?: string
  questionCount: number
  timeLimit: number
  difficulty: string
}

export default function SimuladosPage() {
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

  const difficulty = mapYearToDifficulty(progress.schoolYear)

  // Cria cards de simulado por tópico
  const simuladoCards: SimuladoCard[] = ENCCEJA_PROGRESSIVE_TOPICS.map((topic) => ({
    id: `simulado-${topic.id}`,
    title: `Simulado: ${topic.name}`,
    description: topic.levels[difficulty]?.description || '',
    type: 'topico',
    topicoId: topic.id,
    questionCount: 10,
    timeLimit: 30,
    difficulty: difficulty,
  }))

  // Adiciona simulados por área
  const areaSimulados: SimuladoCard[] = [
    {
      id: 'simulado-area-matematica',
      title: 'Simulado Completo: Matemática',
      description: 'Teste seus conhecimentos em todas as áreas da matemática',
      type: 'area',
      areaId: 'matematica',
      questionCount: 30,
      timeLimit: 90,
      difficulty: difficulty,
    },
    {
      id: 'simulado-area-linguagens',
      title: 'Simulado Completo: Linguagens',
      description: 'Questões de Português, Inglês, Artes e Educação Física',
      type: 'area',
      areaId: 'linguagens',
      questionCount: 30,
      timeLimit: 90,
      difficulty: difficulty,
    },
    {
      id: 'simulado-area-natureza',
      title: 'Simulado Completo: Ciências da Natureza',
      description: 'Questões de Biologia, Química e Física',
      type: 'area',
      areaId: 'natureza',
      questionCount: 30,
      timeLimit: 90,
      difficulty: difficulty,
    },
    {
      id: 'simulado-area-humanas',
      title: 'Simulado Completo: Ciências Humanas',
      description: 'Questões de História, Geografia, Filosofia e Sociologia',
      type: 'area',
      areaId: 'humanas',
      questionCount: 30,
      timeLimit: 90,
      difficulty: difficulty,
    },
  ]

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
            <h1 className="text-3xl md:text-4xl font-bold text-white">Simulados</h1>
            <p className="text-slate-400 mt-2">Teste seus conhecimentos e prepare-se para a prova</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Ano: {progress.schoolYear}</p>
            <p className="text-slate-400 text-sm">Nível: {difficulty}</p>
          </div>
        </div>

        {/* Simulados por Área */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 size={24} />
            Simulados Completos por Área
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areaSimulados.map((simulado) => (
              <Link
                key={simulado.id}
                href={`/simulados/${simulado.id}`}
                className="group bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700 hover:border-violet-500/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-violet-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {simulado.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-2">{simulado.description}</p>
                  </div>
                  <Play className="w-6 h-6 text-violet-400 flex-shrink-0 ml-4 group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Target className="w-4 h-4" />
                    <span>{simulado.questionCount} questões</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{simulado.timeLimit} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>Nível {simulado.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Simulados por Tópico */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Target size={24} />
            Simulados por Tópico
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {simuladoCards.map((simulado) => (
              <Link
                key={simulado.id}
                href={`/simulados/${simulado.id}`}
                className="group bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700 hover:border-violet-500/50 rounded-lg p-4 transition-all hover:shadow-lg hover:shadow-violet-500/20"
              >
                <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors mb-2 line-clamp-2">
                  {simulado.title}
                </h3>
                <p className="text-slate-400 text-xs mb-3 line-clamp-2">{simulado.description}</p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded">
                    {simulado.questionCount} questões
                  </span>
                  <span className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded flex items-center gap-1">
                    <Clock size={12} />
                    {simulado.timeLimit}min
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
