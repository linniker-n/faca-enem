'use client'

import { useState, useEffect } from 'react'
import { PenLine, Send, ChevronLeft, Star, AlertCircle, CheckCircle, Clock, Lightbulb } from 'lucide-react'
import { storage } from '@/lib/storage'
import { ESSAY_THEMES } from '@/lib/data/essay-themes'
import type { Essay, EssayFeedback, CompetencyEval } from '@/lib/types'

type Phase = 'themes' | 'write' | 'loading' | 'feedback' | 'history'

const COMPETENCIES = [
  {
    key: 'competency1' as const,
    label: 'Competência I',
    title: 'Domínio da Norma Culta',
    desc: 'Gramática, ortografia e pontuação',
  },
  {
    key: 'competency2' as const,
    label: 'Competência II',
    title: 'Compreensão da Proposta',
    desc: 'Abordagem do tema e estrutura dissertativo-argumentativa',
  },
  {
    key: 'competency3' as const,
    label: 'Competência III',
    title: 'Organização das Ideias',
    desc: 'Argumentação, coerência e progressão textual',
  },
  {
    key: 'competency4' as const,
    label: 'Competência IV',
    title: 'Coesão e Coerência',
    desc: 'Conectivos e articulação entre as partes do texto',
  },
  {
    key: 'competency5' as const,
    label: 'Competência V',
    title: 'Proposta de Intervenção',
    desc: 'Agente, ação, meio, finalidade, detalhamento e direitos humanos',
  },
]

async function evaluateWithClaude(text: string, theme: string): Promise<EssayFeedback> {
  const res = await fetch('/api/avaliar-redacao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, theme }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Erro ${res.status}`)
  }
  const { feedback } = await res.json()
  return feedback as EssayFeedback
}

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 200) * 100
  const color = score >= 160 ? '#22c55e' : score >= 120 ? '#f59e0b' : score >= 80 ? '#f97316' : '#ef4444'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-sm font-bold w-12 text-right" style={{ color }}>{score}/200</span>
    </div>
  )
}

export default function RedacaoPage() {
  const [phase, setPhase] = useState<Phase>('themes')
  const [essays, setEssays] = useState<Essay[]>([])
  const [selectedTheme, setSelectedTheme] = useState<(typeof ESSAY_THEMES)[0] | null>(null)
  const [text, setText] = useState('')
  const [currentEssay, setCurrentEssay] = useState<Essay | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setEssays(storage.getEssays())
    setLoaded(true)
  }, [])

  function selectTheme(theme: typeof ESSAY_THEMES[0]) {
    setSelectedTheme(theme)
    setText('')
    setPhase('write')
  }

  const [evalError, setEvalError] = useState<string | null>(null)

  async function submitEssay() {
    if (!selectedTheme || !text.trim()) return
    setPhase('loading')
    setEvalError(null)
    try {
      const feedback = await evaluateWithClaude(text, selectedTheme.title)
      const essay: Essay = {
        id: Math.random().toString(36).slice(2),
        theme: selectedTheme.title,
        text,
        createdAt: new Date().toISOString(),
        feedback,
      }
      const updated = [essay, ...essays]
      setEssays(updated)
      storage.saveEssays(updated)
      setCurrentEssay(essay)
      setPhase('feedback')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido'
      setEvalError(msg)
      setPhase('write')
    }
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const charCount = text.length

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // LOADING
  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white font-medium">Analisando sua redação...</p>
        <p className="text-slate-400 text-sm">Avaliando as 5 competências do ENEM</p>
      </div>
    )
  }

  // FEEDBACK
  if (phase === 'feedback' && currentEssay?.feedback) {
    const fb = currentEssay.feedback
    const total = fb.totalScore
    const totalPct = Math.round((total / 1000) * 100)
    const scoreColor = total >= 800 ? 'text-emerald-400' : total >= 600 ? 'text-amber-400' : 'text-red-400'

    return (
      <div className="p-6 max-w-2xl mx-auto fade-in">
        <button onClick={() => setPhase('themes')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition text-sm">
          <ChevronLeft size={16} /> Voltar aos temas
        </button>

        {/* Score total */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Nota estimada ENEM</p>
          <p className={`text-6xl font-bold ${scoreColor} mb-1`}>{total}</p>
          <p className="text-slate-400 text-sm">de 1000 pontos</p>
          <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${totalPct}%`, background: total >= 800 ? '#22c55e' : total >= 600 ? '#f59e0b' : '#ef4444' }}
            />
          </div>
        </div>

        {/* Competências */}
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Avaliação por Competência</h2>
        <div className="space-y-3 mb-6">
          {COMPETENCIES.map((comp) => {
            const eval_ = fb[comp.key] as CompetencyEval
            return (
              <div key={comp.key} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-slate-500">{comp.label}</p>
                    <p className="text-sm font-medium text-white">{comp.title}</p>
                  </div>
                </div>
                <ScoreBar score={eval_.score} />
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{eval_.feedback}</p>
              </div>
            )
          })}
        </div>

        {/* Pontos fortes */}
        {fb.strengths.length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <p className="text-sm font-medium text-emerald-400">Pontos fortes</p>
            </div>
            <ul className="space-y-1">
              {fb.strengths.map((s, i) => (
                <li key={i} className="text-xs text-slate-300">• {s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Melhorias */}
        {fb.improvements.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} className="text-amber-400" />
              <p className="text-sm font-medium text-amber-400">O que melhorar</p>
            </div>
            <ul className="space-y-1">
              {fb.improvements.map((s, i) => (
                <li key={i} className="text-xs text-slate-300">• {s}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => { setPhase('write'); setText('') }}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-medium transition"
        >
          Reescrever redação
        </button>
      </div>
    )
  }

  // WRITE
  if (phase === 'write' && selectedTheme) {
    return (
      <div className="p-6 max-w-3xl mx-auto fade-in h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setPhase('themes')} className="text-slate-500 hover:text-white transition">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Tema</p>
            <p className="text-white font-medium text-sm leading-snug">{selectedTheme.title}</p>
            {selectedTheme.year && <p className="text-xs text-slate-500">ENEM {selectedTheme.year}</p>}
          </div>
        </div>

        {/* Textos motivadores */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Textos motivadores</p>
          <div className="space-y-2">
            {selectedTheme.motivatingTexts.map((t, i) => (
              <p key={i} className="text-xs text-slate-300 italic border-l-2 border-slate-600 pl-3">{t}</p>
            ))}
          </div>
        </div>

        {/* Dicas */}
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Lightbulb size={14} className="text-violet-400" />
            <p className="text-xs font-medium text-violet-400">Dicas para este tema</p>
          </div>
          <ul className="space-y-1">
            {selectedTheme.tips.map((t, i) => (
              <li key={i} className="text-xs text-slate-300">• {t}</li>
            ))}
          </ul>
        </div>

        {/* Error banner */}
        {evalError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-3 flex items-start gap-2">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{evalError}</p>
          </div>
        )}

        {/* Textarea */}
        <div className="flex-1 flex flex-col min-h-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva sua redação aqui. Lembre-se: introdução, dois parágrafos de desenvolvimento e conclusão com proposta de intervenção..."
            className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white text-sm resize-none focus:outline-none focus:border-violet-500 placeholder-slate-600 leading-relaxed min-h-48"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-4 text-xs text-slate-500">
              <span><span className={wordCount < 150 ? 'text-red-400' : wordCount > 350 ? 'text-amber-400' : 'text-emerald-400'}>{wordCount}</span> palavras</span>
              <span>{charCount} caracteres</span>
              {wordCount < 150 && <span className="text-red-400 flex items-center gap-1"><AlertCircle size={10} /> mínimo 150 palavras</span>}
            </div>
            <button
              onClick={submitEssay}
              disabled={wordCount < 100 || !text.trim()}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              <Send size={16} /> Enviar para correção
            </button>
          </div>
        </div>
      </div>
    )
  }

  // THEMES (home)
  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PenLine size={24} className="text-orange-400" /> Redação
          </h1>
          <p className="text-slate-400 text-sm mt-1">Correção automática pelas 5 competências do ENEM</p>
        </div>
        {essays.length > 0 && (
          <button
            onClick={() => setPhase('history')}
            className="flex items-center gap-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-sm transition"
          >
            <Clock size={16} /> Histórico ({essays.length})
          </button>
        )}
      </div>

      {/* Competências */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
        <p className="text-sm font-medium text-slate-300 mb-3">As 5 competências avaliadas</p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {COMPETENCIES.map((comp, i) => (
            <div key={comp.key} className="text-center p-2">
              <div className="w-8 h-8 rounded-full bg-orange-600/20 border border-orange-600/30 flex items-center justify-center mx-auto mb-1">
                <span className="text-xs font-bold text-orange-400">{i + 1}</span>
              </div>
              <p className="text-xs text-slate-400 leading-snug">{comp.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Temas */}
      <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Escolha um tema</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ESSAY_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => selectTheme(theme)}
            className="bg-slate-900 border border-slate-800 hover:border-orange-500/30 hover:bg-orange-500/5 rounded-xl p-5 text-left transition group"
          >
            {theme.year && (
              <span className="text-xs bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded-full mb-2 inline-block">
                ENEM {theme.year}
              </span>
            )}
            <p className="text-sm font-medium text-white leading-snug group-hover:text-orange-100 transition">
              {theme.title}
            </p>
            <div className="flex items-center gap-1 mt-2 text-slate-500">
              <Star size={12} />
              <span className="text-xs">{theme.motivatingTexts.length} textos motivadores</span>
            </div>
          </button>
        ))}
      </div>

      {/* Histórico inline */}
      {essays.length > 0 && phase === 'history' && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Redações enviadas</h2>
          <div className="space-y-3">
            {essays.map((essay) => {
              const total = essay.feedback?.totalScore ?? 0
              const color = total >= 800 ? 'text-emerald-400' : total >= 600 ? 'text-amber-400' : 'text-red-400'
              return (
                <div key={essay.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white leading-snug">{essay.theme}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(essay.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    {essay.feedback && (
                      <span className={`text-xl font-bold ${color}`}>{essay.feedback.totalScore}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
