'use client'

import { useState, useEffect } from 'react'
import { BarChart2, TrendingUp, Target, Flame, Clock, Award } from 'lucide-react'
import { storage } from '@/lib/storage'
import { SUBJECTS, AREA_LABELS, AREA_COLORS } from '@/lib/data/subjects'
import { isDueToday } from '@/lib/sm2'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'
import type { UserProgress, SimuladoSession, Flashcard } from '@/lib/types'

const AREA_ORDER = ['linguagens', 'humanas', 'natureza', 'matematica']

export default function DesempenhoPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [simulados, setSimulados] = useState<SimuladoSession[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setProgress(storage.getProgress())
    setSimulados(storage.getSimulados())
    setFlashcards(storage.getFlashcards())
    setLoaded(true)
  }, [])

  const areaStats = AREA_ORDER.map((area) => {
    const subs = SUBJECTS.filter((s) => s.area === area)
    const totalTopics = subs.reduce((sum, s) => sum + s.topics.length, 0)
    const completedTopics = subs.reduce((sum, s) => (progress?.subjectProgress[s.id]?.completedTopics.length ?? 0) + sum, 0)
    const totalAnswers = subs.reduce((sum, s) => sum + (progress?.subjectProgress[s.id]?.totalAnswers ?? 0), 0)
    const correctAnswers = subs.reduce((sum, s) => sum + (progress?.subjectProgress[s.id]?.correctAnswers ?? 0), 0)
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0
    const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
    return { area, label: AREA_LABELS[area], pct, accuracy, totalAnswers, correctAnswers, color: AREA_COLORS[area] }
  })

  const subjectStats = SUBJECTS.map((sub) => {
    const sp = progress?.subjectProgress[sub.id]
    const total = sp?.totalAnswers ?? 0
    const correct = sp?.correctAnswers ?? 0
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
    return { name: sub.name.split(' ')[0], accuracy, total, correct, color: sub.color, area: sub.area }
  }).filter((s) => s.total > 0)

  const radarData = AREA_ORDER.map((area) => {
    const stat = areaStats.find((s) => s.area === area)!
    return { subject: AREA_LABELS[area].split(' ')[0], accuracy: stat.accuracy }
  })

  const simuladoChartData = simulados.slice(0, 10).reverse().map((s, i) => ({
    name: `#${i + 1}`,
    score: s.score ?? 0,
    tri: Math.round((s.triScore ?? 0) / 10),
  }))

  const dueCards = flashcards.filter(isDueToday).length
  const reviewedCards = flashcards.filter((c) => c.repetitions > 0).length
  const avgInterval = flashcards.length > 0
    ? Math.round(flashcards.reduce((s, c) => s + c.interval, 0) / flashcards.length)
    : 0

  const totalCorrect = Object.values(progress?.subjectProgress ?? {}).reduce((s, sp) => s + sp.correctAnswers, 0)
  const totalAnswers = Object.values(progress?.subjectProgress ?? {}).reduce((s, sp) => s + sp.totalAnswers, 0)
  const globalAccuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart2 size={24} className="text-pink-400" /> Desempenho
        </h1>
        <p className="text-slate-400 text-sm mt-1">Análise completa do seu progresso de estudos</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Flame, label: 'Sequência', value: progress?.streak ?? 0, unit: 'dias', color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { icon: Target, label: 'Acertos globais', value: globalAccuracy, unit: '%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: TrendingUp, label: 'Simulados', value: simulados.length, unit: 'realizados', color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { icon: Clock, label: 'Flashcards', value: flashcards.length, unit: 'criados', color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map(({ icon: Icon, label, value, unit, color, bg }) => (
          <div key={label} className={`${bg} border border-slate-800 rounded-xl p-4`}>
            <Icon size={18} className={`${color} mb-2`} />
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label} ({unit})</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Progresso por área */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Acertos por Área</h2>
          {areaStats.every((s) => s.totalAnswers === 0) ? (
            <p className="text-slate-500 text-sm text-center py-6">Resolva questões para ver o desempenho</p>
          ) : (
            <div className="space-y-3">
              {areaStats.map(({ area, label, accuracy, totalAnswers, correctAnswers, color }) => (
                <div key={area}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-sm text-white">{label}</span>
                    </div>
                    <span className="text-xs text-slate-400">{correctAnswers}/{totalAnswers} ({accuracy}%)</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${accuracy}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Radar por área */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Radar de Competências</h2>
          {totalAnswers === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Sem dados ainda</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Radar name="Acertos" dataKey="accuracy" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gráfico de simulados */}
      {simulados.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-white mb-4">Evolução nos Simulados</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={simuladoChartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#f1f5f9' }}
                itemStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="score" name="Acertos %" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {/* Tabela histórico */}
          <div className="mt-4 space-y-1.5">
            {simulados.slice(0, 5).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 text-sm">
                <span className="text-slate-600 w-6">#{simulados.length - i}</span>
                <span className="text-slate-400 flex-1">
                  {s.areaFilter ? AREA_LABELS[s.areaFilter] : 'Geral'} — {s.totalQuestions} questões
                </span>
                <span className={`font-medium w-12 text-right ${(s.score ?? 0) >= 70 ? 'text-emerald-400' : (s.score ?? 0) >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {s.score}%
                </span>
                <span className="text-violet-400 w-16 text-right">TRI {s.triScore}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desempenho por matéria */}
      {subjectStats.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-white mb-4">Acertos por Matéria</h2>
          <ResponsiveContainer width="100%" height={Math.max(180, subjectStats.length * 28)}>
            <BarChart data={subjectStats} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={60} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v) => [`${v}%`, 'Acertos']}
              />
              <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                {subjectStats.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats de flashcards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Flashcards — Repetição Espaçada</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total criados', value: flashcards.length },
            { label: 'Revisados', value: reviewedCards },
            { label: 'Para hoje', value: dueCards },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
        {flashcards.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {SUBJECTS.filter((s) => flashcards.some((c) => c.subjectId === s.id)).map((sub) => {
              const subCards = flashcards.filter((c) => c.subjectId === sub.id)
              const due = subCards.filter(isDueToday).length
              return (
                <div key={sub.id} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: sub.color }} />
                  <span className="text-slate-300 flex-1 text-xs">{sub.name}</span>
                  <span className="text-xs text-slate-500">{subCards.length} cards</span>
                  {due > 0 && <span className="text-xs text-blue-400">{due} para revisar</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
