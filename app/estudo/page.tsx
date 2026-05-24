'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen, Clock, RefreshCw, ChevronRight, Target,
  AlertCircle, CheckCircle, Sparkles, Search,
} from 'lucide-react'
import { storage } from '@/lib/storage'
import { generateStudyPlan, REASON_LABELS } from '@/lib/study-plan'
import { AREA_LABELS, SUBJECTS } from '@/lib/data/subjects'
import type { StudyPlan } from '@/lib/study-plan'
import type { UserProgress } from '@/lib/types'

const AREAS = ['linguagens', 'humanas', 'natureza', 'matematica'] as const
const AREA_COLORS: Record<string, string> = {
  linguagens: '#3b82f6', humanas: '#f97316', natureza: '#22c55e', matematica: '#ef4444',
}

export default function EstudoPage() {
  const router = useRouter()
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Tema livre
  const [customTopic, setCustomTopic] = useState('')
  const [customSubject, setCustomSubject] = useState('')

  function loadPlan(p: UserProgress) {
    setPlan(generateStudyPlan(p, 6))
  }

  useEffect(() => {
    const p = storage.getProgress()
    setProgress(p)
    loadPlan(p)
    setLoaded(true)
  }, [])

  function regenerate() {
    if (progress) loadPlan(progress)
  }

  function handleCustomStudy(e: React.FormEvent) {
    e.preventDefault()
    const t = customTopic.trim()
    if (!t) return
    const params = new URLSearchParams({ q: t })
    if (customSubject) params.set('s', customSubject)
    router.push(`/estudo/_livre?${params.toString()}`)
  }

  const REASON_ICON = {
    novo: <Sparkles size={14} className="text-violet-400" />,
    fraco: <AlertCircle size={14} className="text-red-400" />,
    reforco: <Target size={14} className="text-amber-400" />,
    revisao: <CheckCircle size={14} className="text-emerald-400" />,
  }

  if (!loaded || !plan) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const hasProgress = Object.values(progress?.subjectProgress ?? {}).some((sp) => sp.totalAnswers > 0)

  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">

      {/* ── Estudar tema livre ──────────────────────────────────── */}
      <div className="bg-slate-900 border border-violet-500/30 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Search size={16} className="text-violet-400" />
          <h2 className="text-sm font-semibold text-white">Estudar qualquer tema</h2>
          <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full">✦ IA</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">Digite qualquer assunto e a IA vai gerar uma aula completa sobre ele.</p>
        <form onSubmit={handleCustomStudy} className="flex flex-col sm:flex-row gap-2">
          <input
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Ex: Fotossíntese, Segunda Guerra Mundial, Equações do 2º grau..."
            className="flex-1 bg-slate-800 border border-slate-700 focus:border-violet-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none transition"
          />
          <select
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none appearance-none cursor-pointer"
          >
            <option value="">Matéria (opcional)</option>
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!customTopic.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Estudar →
          </button>
        </form>
      </div>

      {/* ── Header plano ───────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen size={24} className="text-violet-400" />
            Plano de Estudo
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {hasProgress
              ? 'Gerado com base no seu desempenho — matérias mais fracas têm prioridade.'
              : 'Seu primeiro plano! Comece por qualquer tópico e o app vai personalizar com o tempo.'}
          </p>
        </div>
        <button
          onClick={regenerate}
          className="flex items-center gap-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-2 rounded-lg text-sm transition"
        >
          <RefreshCw size={14} /> Novo plano
        </button>
      </div>

      {!hasProgress && (
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Sparkles size={18} className="text-violet-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-violet-300">Plano em modo inicial</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Quanto mais você resolver simulados e flashcards, mais inteligente fica o plano — priorizando automaticamente suas matérias mais fracas.
            </p>
          </div>
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{plan.items.length}</p>
          <p className="text-xs text-slate-500 mt-1">tópicos hoje</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{plan.totalMinutes}</p>
          <p className="text-xs text-slate-500 mt-1">minutos estimados</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">
            {[...new Set(plan.items.map((i) => i.subjectId))].length}
          </p>
          <p className="text-xs text-slate-500 mt-1">matérias diferentes</p>
        </div>
      </div>

      {/* Lista de tópicos */}
      <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Tópicos de hoje</h2>
      <div className="space-y-3 mb-8">
        {plan.items.map((item, idx) => {
          const reasonInfo = REASON_LABELS[item.reason]
          return (
            <Link
              key={`${item.subjectId}-${item.topicId}`}
              href={`/estudo/${item.topicId}`}
              className="flex items-center gap-4 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition group"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ background: item.subjectColor + '30', border: `1px solid ${item.subjectColor}60` }}
              >
                <span style={{ color: item.subjectColor }}>{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate mb-0.5">{item.topicName}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-slate-500">{item.subjectName}</span>
                  <div className="flex items-center gap-1">
                    {REASON_ICON[item.reason]}
                    <span className={`text-xs ${reasonInfo.color}`}>{reasonInfo.label}</span>
                  </div>
                  {item.accuracyPct !== null && (
                    <span className="text-xs text-slate-500">{item.accuracyPct}% de acerto</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock size={13} />
                  <span className="text-xs">{item.estimatedMinutes}min</span>
                </div>
                {!item.hasContent && <span className="text-xs text-slate-600">sem material</span>}
                <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-300 transition" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Explorar por área */}
      <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Explorar todas as matérias</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {AREAS.map((area) => {
          const color = AREA_COLORS[area]
          return (
            <Link
              key={area}
              href={`/estudo?area=${area}`}
              className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 text-center transition group"
            >
              <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ background: color + '25', border: `2px solid ${color}50` }} />
              <p className="text-xs font-medium text-slate-300 group-hover:text-white transition">
                {AREA_LABELS[area]}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
