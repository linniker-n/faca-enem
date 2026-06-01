'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Flame, CreditCard, ClipboardList, PenLine, RefreshCw, BarChart2, ChevronRight, BookOpen, Sparkles } from 'lucide-react'
import { storage } from '@/lib/storage'
import { SUBJECTS, AREA_LABELS, AREA_COLORS } from '@/lib/data/subjects'
import { isDueToday } from '@/lib/sm2'
import { getTodayStudyPlan, regenerateStudyPlan } from '@/lib/study-plan'
import type { UserProgress, StudyCycle, Flashcard, StudyItem } from '@/lib/types'

const AREA_ORDER = ['linguagens', 'humanas', 'natureza', 'matematica']

export default function Dashboard() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [cycles, setCycles] = useState<StudyCycle[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [todayPlan, setTodayPlan] = useState<StudyItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const p = storage.getProgress()
    
    // Redirecionar para seleção de modalidade se não foi selecionada
    if (!p.examType) {
      window.location.href = '/modalidade'
      return
    }
    
    setProgress(p)
    setCycles(storage.getCycles())
    setFlashcards(storage.getFlashcards())
    // Usa o novo sistema que persiste o plano do dia
    setTodayPlan(getTodayStudyPlan(p))
    storage.updateStreak()
    setLoaded(true)
  }, [])

  const dueCards = flashcards.filter(isDueToday).length
  const activeCycle = cycles[0] ?? null
  const todaySubject = activeCycle
    ? activeCycle.subjects[activeCycle.currentPosition % activeCycle.subjects.length]
    : null
  const todaySubjectData = todaySubject ? SUBJECTS.find((s) => s.id === todaySubject.subjectId) : null

  const areaStats = AREA_ORDER.map((area) => {
    const subs = SUBJECTS.filter((s) => s.area === area)
    const totalTopics = subs.reduce((sum, s) => sum + s.topics.length, 0)
    const completedTopics = subs.reduce((sum, s) => {
      const sp = progress?.subjectProgress[s.id]
      return sum + (sp?.completedTopics.length ?? 0)
    }, 0)
    const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
    const totalAnswers = subs.reduce((sum, s) => sum + (progress?.subjectProgress[s.id]?.totalAnswers ?? 0), 0)
    const correctAnswers = subs.reduce((sum, s) => sum + (progress?.subjectProgress[s.id]?.correctAnswers ?? 0), 0)
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0
    return { area, label: AREA_LABELS[area], pct, accuracy, color: AREA_COLORS[area] }
  })

  const QUICK_LINKS = [
    { href: '/ciclos', icon: RefreshCw, label: 'Ciclos de Estudo', desc: 'Organize sua rotina', color: 'bg-violet-600' },
    { href: '/flashcards', icon: CreditCard, label: 'Flashcards', desc: `${dueCards} para revisar hoje`, color: 'bg-blue-600' },
    { href: '/simulado', icon: ClipboardList, label: 'Simulado', desc: 'Questões ENEM reais', color: 'bg-emerald-600' },
    { href: '/redacao', icon: PenLine, label: 'Redação', desc: 'Correção por IA', color: 'bg-orange-600' },
    { href: '/desempenho', icon: BarChart2, label: 'Desempenho', desc: 'Análise detalhada', color: 'bg-pink-600' },
  ]

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta!</h1>
          <p className="text-slate-400 mt-1">
            {progress?.examType === 'enem' 
              ? 'Vamos continuar sua jornada rumo ao ENEM.'
              : `Vamos continuar sua jornada rumo ao Encceja - Ensino ${progress?.educationLevel === 'fundamental' ? 'Fundamental' : 'Médio'}.`}
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-0">
          {/* Nível e XP */}
          <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3">
            <div className="text-right">
              <p className="text-violet-400 font-bold text-sm md:text-lg leading-none">Nível {progress?.level.currentLevel ?? 1}</p>
              <p className="text-slate-500 text-xs">{progress?.level.totalXP ?? 0} XP</p>
            </div>
          </div>
          {/* Streak */}
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3">
            <Flame size={16} className="text-orange-400 md:hidden" />
            <Flame size={20} className="text-orange-400 hidden md:block" />
            <div className="text-right">
              <p className="text-orange-400 font-bold text-sm md:text-lg leading-none">{progress?.streak ?? 0}</p>
              <p className="text-slate-500 text-xs">dias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progresso de XP */}
      {progress && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-white">Progresso para o próximo nível</p>
            <p className="text-xs text-slate-400">{progress.level.xpInCurrentLevel} / {progress.level.xpForNextLevel} XP</p>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-700"
              style={{ width: `${(progress.level.xpInCurrentLevel / progress.level.xpForNextLevel) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Plano de estudo de hoje */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-violet-400" />
            <h2 className="font-semibold text-white">Plano de hoje</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (progress) {
                  const newPlan = regenerateStudyPlan(progress)
                  setTodayPlan(newPlan)
                }
              }}
              className="text-xs text-slate-400 hover:text-violet-400 flex items-center gap-1 transition"
              title="Gerar novo plano"
            >
              <RefreshCw size={13} />
            </button>
            <Link href="/estudo" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition">
              Ver tudo <ChevronRight size={13} />
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          {todayPlan.map((item) => (
            <Link
              key={`${item.subjectId}-${item.topicId}`}
              href={`/estudo/${item.topicId}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition group"
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.subjectColor }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.topicName}</p>
                <p className="text-xs text-slate-500">{item.subjectName} · {item.estimatedMinutes}min</p>
              </div>
              <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-300 transition shrink-0" />
            </Link>
          ))}
          {todayPlan.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-3">Carregando plano...</p>
          )}
        </div>
      </div>

      {/* Sessão atual do ciclo */}
      {todaySubjectData && (
        <div
          className="rounded-2xl p-5 mb-6 border flex items-center justify-between"
          style={{ borderColor: todaySubjectData.color + '40', background: todaySubjectData.color + '15' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: todaySubjectData.color }}>
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Próxima sessão no ciclo</p>
              <p className="font-semibold text-white">{todaySubjectData.name}</p>
              <p className="text-xs text-slate-400">{todaySubject?.minutesPerSession} min</p>
            </div>
          </div>
          <Link
            href="/ciclos"
            className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg text-white transition"
            style={{ background: todaySubjectData.color }}
          >
            Ver ciclo <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* Alerta de flashcards */}
      {dueCards > 0 && (
        <Link
          href="/flashcards"
          className="flex items-center justify-between bg-blue-600/10 border border-blue-600/20 rounded-2xl p-5 mb-6 hover:bg-blue-600/20 transition"
        >
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-blue-400" />
            <div>
              <p className="font-semibold text-white">{dueCards} flashcard{dueCards > 1 ? 's' : ''} para revisar</p>
              <p className="text-xs text-slate-400">Não perca o intervalo ideal de revisão!</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-blue-400" />
        </Link>
      )}

      {/* Módulos rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 mb-6 md:mb-8">
        {QUICK_LINKS.map(({ href, icon: Icon, label, desc, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all hover:bg-slate-800/50 group"
          >
            <div className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="font-medium text-sm text-white mb-0.5">{label}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Progresso por área */}
      <h2 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Progresso por Área</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
        {areaStats.map(({ area, label, pct, accuracy, color }) => (
          <div key={area} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span className="font-medium text-sm text-white">{label}</span>
              </div>
              <span className="text-xs text-slate-400">{pct}% concluído</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <p className="text-xs text-slate-500">Acertos: {accuracy > 0 ? `${accuracy}%` : '—'}</p>
          </div>
        ))}
      </div>

      {/* Stats globais */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {[
          { label: 'Flashcards criados', value: flashcards.length },
          { label: 'Sessões completas', value: progress?.completedSessions ?? 0 },
          { label: 'Minutos estudados', value: progress?.totalStudyMinutes ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
