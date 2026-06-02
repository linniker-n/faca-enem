'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Target, Award, AlertCircle } from 'lucide-react'
import type { UserProgress } from '@/lib/types'

interface PerformanceAnalyticsProps {
  progress: UserProgress
}

export function PerformanceAnalytics({ progress }: PerformanceAnalyticsProps) {
  const stats = useMemo(() => {
    let totalCorrect = 0
    let totalAnswered = 0
    let topicCount = 0
    let completedTopics = 0

    Object.values(progress.subjectProgress).forEach((subjectProg) => {
      totalCorrect += subjectProg.correctAnswers
      totalAnswered += subjectProg.totalAnswers
      completedTopics += subjectProg.completedTopics.length

      Object.values(subjectProg.topicProgress).forEach(() => {
        topicCount++
      })
    })

    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
    const completionRate = topicCount > 0 ? Math.round((completedTopics / topicCount) * 100) : 0

    return {
      totalCorrect,
      totalAnswered,
      accuracy,
      completedTopics,
      topicCount,
      completionRate,
      streakDays: progress.streak,
      totalMinutes: progress.totalStudyMinutes,
      level: progress.level.currentLevel,
      totalXP: progress.level.totalXP,
    }
  }, [progress])

  const performanceLevel = useMemo(() => {
    if (stats.accuracy >= 80) return { label: 'Excelente', color: 'text-green-400', bg: 'bg-green-500/10' }
    if (stats.accuracy >= 60) return { label: 'Bom', color: 'text-blue-400', bg: 'bg-blue-500/10' }
    if (stats.accuracy >= 40) return { label: 'Adequado', color: 'text-yellow-400', bg: 'bg-yellow-500/10' }
    return { label: 'Precisa Melhorar', color: 'text-red-400', bg: 'bg-red-500/10' }
  }, [stats.accuracy])

  return (
    <div className="space-y-6">
      {/* Resumo Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Acurácia */}
        <div className={`rounded-lg border border-slate-700 p-4 ${performanceLevel.bg}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Acurácia Geral</p>
            <TrendingUp className={`w-5 h-5 ${performanceLevel.color}`} />
          </div>
          <p className={`text-3xl font-bold ${performanceLevel.color}`}>{stats.accuracy}%</p>
          <p className="text-xs text-slate-400 mt-1">{performanceLevel.label}</p>
        </div>

        {/* Progresso */}
        <div className="rounded-lg border border-slate-700 bg-purple-500/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Progresso</p>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-purple-400">{stats.completionRate}%</p>
          <p className="text-xs text-slate-400 mt-1">
            {stats.completedTopics}/{stats.topicCount} tópicos
          </p>
        </div>

        {/* Nível */}
        <div className="rounded-lg border border-slate-700 bg-orange-500/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Nível</p>
            <Award className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-orange-400">{stats.level}</p>
          <p className="text-xs text-slate-400 mt-1">{stats.totalXP} XP</p>
        </div>

        {/* Sequência */}
        <div className="rounded-lg border border-slate-700 bg-cyan-500/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Sequência</p>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-cyan-400">{stats.streakDays}</p>
          <p className="text-xs text-slate-400 mt-1">dias de estudo</p>
        </div>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Estatísticas Detalhadas</h3>

        <div className="space-y-4">
          {/* Questões Respondidas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-300">Questões Respondidas</p>
              <p className="font-semibold text-white">
                {stats.totalCorrect}/{stats.totalAnswered}
              </p>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-violet-600 h-full transition-all"
                style={{ width: `${stats.accuracy}%` }}
              />
            </div>
          </div>

          {/* Tempo de Estudo */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-300">Tempo Total de Estudo</p>
              <p className="font-semibold text-white">
                {Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m
              </p>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Taxa de Conclusão */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-300">Taxa de Conclusão de Tópicos</p>
              <p className="font-semibold text-white">{stats.completionRate}%</p>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dicas de Melhoria */}
      <div className={`rounded-lg border p-4 flex gap-3 ${
        stats.accuracy < 60
          ? 'bg-red-500/10 border-red-500/30'
          : stats.accuracy < 80
            ? 'bg-yellow-500/10 border-yellow-500/30'
            : 'bg-green-500/10 border-green-500/30'
      }`}>
        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          stats.accuracy < 60
            ? 'text-red-400'
            : stats.accuracy < 80
              ? 'text-yellow-400'
              : 'text-green-400'
        }`} />
        <div>
          <p className="font-semibold text-white mb-1">Dica de Melhoria</p>
          <p className="text-sm text-slate-300">
            {stats.accuracy < 40 && 'Você está começando! Continue praticando e logo verá melhoras significativas.'}
            {stats.accuracy >= 40 && stats.accuracy < 60 && 'Bom progresso! Foque nos tópicos com menor acurácia para melhorar ainda mais.'}
            {stats.accuracy >= 60 && stats.accuracy < 80 && 'Excelente! Você está no caminho certo. Pratique mais para atingir 80%+.'}
            {stats.accuracy >= 80 && 'Parabéns! Você está com um desempenho excelente. Mantenha a consistência!'}
          </p>
        </div>
      </div>
    </div>
  )
}
