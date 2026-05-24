'use client'

import { useState, useEffect, useRef } from 'react'
import { ClipboardList, Timer, CheckCircle, XCircle, ChevronRight, RotateCcw, ArrowLeft } from 'lucide-react'
import { storage } from '@/lib/storage'
import { QUESTIONS, getRandomQuestions } from '@/lib/data/questions'
import { SUBJECTS, AREA_LABELS } from '@/lib/data/subjects'
import { calculateTRI } from '@/lib/tri'
import type { Question, SimuladoSession } from '@/lib/types'

type Phase = 'config' | 'quiz' | 'result'

const AREA_OPTIONS = ['linguagens', 'humanas', 'natureza', 'matematica']

export default function SimuladoPage() {
  const [phase, setPhase] = useState<Phase>('config')
  const [sessions, setSessions] = useState<SimuladoSession[]>([])

  // Config
  const [questionCount, setQuestionCount] = useState(10)
  const [areaFilter, setAreaFilter] = useState<string>('all')

  // Quiz
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Result
  const [result, setResult] = useState<SimuladoSession | null>(null)

  useEffect(() => {
    setSessions(storage.getSimulados())
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  function startSimulado() {
    const subjectFilter = areaFilter === 'all'
      ? undefined
      : SUBJECTS.filter((s) => s.area === areaFilter).map((s) => s.id)
    const qs = getRandomQuestions(questionCount, subjectFilter)
    if (qs.length === 0) return
    setQuestions(qs)
    setCurrentIdx(0)
    setAnswers({})
    setShowExplanation(false)
    setSeconds(0)
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    setPhase('quiz')
  }

  function selectAnswer(questionId: string, idx: number) {
    if (answers[questionId] !== undefined) return
    setAnswers((prev) => ({ ...prev, [questionId]: idx }))
    setShowExplanation(true)
  }

  function nextQuestion() {
    if (currentIdx + 1 >= questions.length) {
      finishSimulado()
    } else {
      setCurrentIdx((i) => i + 1)
      setShowExplanation(false)
    }
  }

  function finishSimulado() {
    if (timerRef.current) clearInterval(timerRef.current)

    const answerData = questions.map((q) => ({
      question: q,
      selectedIndex: answers[q.id] ?? null,
    }))
    const triScore = calculateTRI(answerData)
    const correctCount = answerData.filter((a) => a.selectedIndex === a.question.correctIndex).length

    const session: SimuladoSession = {
      id: Math.random().toString(36).slice(2),
      type: areaFilter === 'all' ? 'full' : 'area',
      areaFilter: areaFilter === 'all' ? undefined : areaFilter as SimuladoSession['areaFilter'],
      totalQuestions: questions.length,
      answers,
      startedAt: new Date(Date.now() - seconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      score: Math.round((correctCount / questions.length) * 100),
      triScore,
      correctCount,
    }

    const updated = [session, ...sessions]
    setSessions(updated)
    storage.saveSimulados(updated)

    questions.forEach((q) => {
      storage.recordCorrect(q.subjectId, answers[q.id] === q.correctIndex)
    })

    setResult(session)
    setPhase('result')
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  // CONFIG PHASE
  if (phase === 'config') {
    return (
      <div className="p-6 max-w-2xl mx-auto fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList size={24} className="text-emerald-400" /> Simulado
          </h1>
          <p className="text-slate-400 text-sm mt-1">Questões de provas anteriores do ENEM com correção por TRI.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Configurar Simulado</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide mb-2 block">Número de questões</label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                      questionCount === n
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide mb-2 block">Área do conhecimento</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAreaFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                    areaFilter === 'all' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  Todas as áreas
                </button>
                {AREA_OPTIONS.map((area) => (
                  <button
                    key={area}
                    onClick={() => setAreaFilter(area)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                      areaFilter === area ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {AREA_LABELS[area]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startSimulado}
            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-lg transition"
          >
            Iniciar Simulado
          </button>
        </div>

        {/* Nota sobre TRI */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 flex gap-3">
          <div className="text-slate-500 shrink-0 mt-0.5">ℹ</div>
          <div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-slate-300 font-medium">Sobre a pontuação TRI:</span> A nota exibida usa ponderação por dificuldade (fácil=0,8×, médio=1,0×, difícil=1,3×), inspirada na TRI do ENEM real. Em simulados curtos (5–20 questões), a precisão é menor que no ENEM oficial com 45 questões por área. Use como referência de desempenho relativo, não como previsão exata da sua nota.
            </p>
          </div>
        </div>

        {/* Histórico */}
        {sessions.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Histórico Recente</h2>
            <div className="space-y-2">
              {sessions.slice(0, 5).map((s) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {s.areaFilter ? AREA_LABELS[s.areaFilter] : 'Geral'} — {s.totalQuestions} questões
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(s.completedAt!).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${(s.score ?? 0) >= 70 ? 'text-emerald-400' : (s.score ?? 0) >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {s.score}%
                    </p>
                    <p className="text-xs text-slate-500">TRI: {s.triScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // QUIZ PHASE
  if (phase === 'quiz') {
    const q = questions[currentIdx]
    const selected = answers[q.id]
    const LETTERS = ['A', 'B', 'C', 'D', 'E']
    const subject = SUBJECTS.find((s) => s.id === q.subjectId)

    return (
      <div className="p-6 max-w-2xl mx-auto fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase('config') }} className="text-slate-500 hover:text-white transition">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 h-2 bg-slate-800 rounded-full">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Timer size={16} />
            <span className="text-sm font-mono">{formatTime(seconds)}</span>
          </div>
          <span className="text-sm text-slate-400">{currentIdx + 1}/{questions.length}</span>
        </div>

        {/* Questão */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            {subject && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: subject.color + '20', color: subject.color }}>
                {subject.name}
              </span>
            )}
            {q.year && <span className="text-xs text-slate-500">ENEM {q.year}</span>}
            <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${
              q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' :
              q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400' :
              'bg-red-500/10 text-red-400'
            }`}>
              {q.difficulty === 'easy' ? 'Fácil' : q.difficulty === 'medium' ? 'Médio' : 'Difícil'}
            </span>
          </div>
          <p className="text-white leading-relaxed">{q.text}</p>
        </div>

        {/* Alternativas */}
        <div className="space-y-2 mb-4">
          {q.options.map((opt, idx) => {
            const isSelected = selected === idx
            const isCorrect = idx === q.correctIndex
            let cls = 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600'
            if (selected !== undefined) {
              if (isCorrect) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
              else if (isSelected) cls = 'border-red-500 bg-red-500/10 text-red-300'
              else cls = 'border-slate-800 bg-slate-900/50 text-slate-500 opacity-60'
            }
            return (
              <button
                key={idx}
                onClick={() => selectAnswer(q.id, idx)}
                disabled={selected !== undefined}
                className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition ${cls}`}
              >
                <span className="font-bold shrink-0 text-sm mt-0.5">{LETTERS[idx]}</span>
                <span className="text-sm leading-relaxed">{opt}</span>
                {selected !== undefined && isCorrect && <CheckCircle size={16} className="text-emerald-400 shrink-0 ml-auto mt-0.5" />}
                {selected !== undefined && isSelected && !isCorrect && <XCircle size={16} className="text-red-400 shrink-0 ml-auto mt-0.5" />}
              </button>
            )
          })}
        </div>

        {/* Explicação */}
        {showExplanation && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-4 fade-in">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Explicação</p>
            <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {selected !== undefined && (
          <button
            onClick={nextQuestion}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
          >
            {currentIdx + 1 >= questions.length ? 'Ver resultado' : 'Próxima questão'}
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    )
  }

  // RESULT PHASE
  if (phase === 'result' && result) {
    const correctCount = result.correctCount ?? 0
    const pct = result.score ?? 0
    const scoreColor = pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'

    const questionResults = questions.map((q) => ({
      question: q,
      selected: result.answers[q.id],
      correct: result.answers[q.id] === q.correctIndex,
    }))

    const bySubject: Record<string, { correct: number; total: number }> = {}
    questionResults.forEach(({ question, correct }) => {
      if (!bySubject[question.subjectId]) bySubject[question.subjectId] = { correct: 0, total: 0 }
      bySubject[question.subjectId].total++
      if (correct) bySubject[question.subjectId].correct++
    })

    return (
      <div className="p-6 max-w-2xl mx-auto fade-in">
        <div className="text-center mb-8">
          <div className={`text-6xl font-bold ${scoreColor} mb-2`}>{pct}%</div>
          <p className="text-slate-400">{correctCount} de {result.totalQuestions} corretas</p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-violet-400">{result.triScore}</p>
              <p className="text-xs text-slate-500">Nota TRI</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{formatTime(seconds)}</p>
              <p className="text-xs text-slate-500">Tempo</p>
            </div>
          </div>
        </div>

        {/* Por matéria */}
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Desempenho por matéria</h2>
        <div className="space-y-2 mb-6">
          {Object.entries(bySubject).map(([subjectId, stats]) => {
            const subject = SUBJECTS.find((s) => s.id === subjectId)
            const acc = Math.round((stats.correct / stats.total) * 100)
            if (!subject) return null
            return (
              <div key={subjectId} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: subject.color }} />
                <span className="text-sm text-white flex-1">{subject.name}</span>
                <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${acc}%`, background: subject.color }} />
                </div>
                <span className="text-xs text-slate-400 w-10 text-right">{stats.correct}/{stats.total}</span>
              </div>
            )
          })}
        </div>

        {/* Gabarito */}
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Gabarito</h2>
        <div className="space-y-2 mb-6">
          {questionResults.map(({ question, correct }, idx) => {
            const LETTERS = ['A', 'B', 'C', 'D', 'E']
            return (
              <div key={question.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-start gap-3">
                <span className="text-slate-500 text-sm w-5 shrink-0">{idx + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">{question.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">Sua resp: <span className={correct ? 'text-emerald-400' : 'text-red-400'}>{LETTERS[result.answers[question.id]] ?? '—'}</span></span>
                    {!correct && <span className="text-xs text-slate-500">Correta: <span className="text-emerald-400">{LETTERS[question.correctIndex]}</span></span>}
                  </div>
                </div>
                {correct ? <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />}
              </div>
            )
          })}
        </div>

        <button
          onClick={() => setPhase('config')}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition"
        >
          <RotateCcw size={18} /> Novo Simulado
        </button>
      </div>
    )
  }

  return null
}
