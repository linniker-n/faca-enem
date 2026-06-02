'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ENCCEJA_PROGRESSIVE_QUESTIONS } from '@/lib/data/encceja-progressive-questions'
import { ENCCEJA_PROGRESSIVE_TOPICS } from '@/lib/data/encceja-progressive-topics'
import { storage } from '@/lib/storage'
import { mapYearToDifficulty } from '@/lib/encceja-utils'
import { SimuladoInterface, type SimuladoResults } from '@/components/SimuladoInterface'
import type { UserProgress, Question } from '@/lib/types'
import { Loader2, ArrowLeft, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function SimuladoPage() {
  const params = useParams()
  const router = useRouter()
  const simuladoId = params.id as string

  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [simuladoTitle, setSimuladoTitle] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState<SimuladoResults | null>(null)

  useEffect(() => {
    const p = storage.getProgress()

    if (!p.examType || p.examType !== 'encceja') {
      router.push('/modalidade')
      return
    }

    setProgress(p)

    // Processa o ID do simulado
    const difficulty = mapYearToDifficulty(p.schoolYear)

    if (simuladoId.startsWith('simulado-area-')) {
      // Simulado por área
      const areaMap: Record<string, string> = {
        'simulado-area-matematica': 'matematica-em',
        'simulado-area-linguagens': 'portugues-em',
        'simulado-area-natureza': 'biologia-em',
        'simulado-area-humanas': 'historia-em',
      }

      const subjectId = areaMap[simuladoId]
      const areaTitle = simuladoId.replace('simulado-area-', '').toUpperCase()

      if (subjectId) {
        const filtered = ENCCEJA_PROGRESSIVE_QUESTIONS.filter(
          (q) => q.subjectId === subjectId && q.difficultyLevel === difficulty
        ).slice(0, 30).map((q) => ({
          ...q,
          difficulty: (q.difficultyLevel === 'basico' ? 'easy' : q.difficultyLevel === 'intermediario' ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
          examType: 'encceja' as const,
          educationLevel: 'medio' as const,
          source: q.source as 'encceja',
        } as Question))

        setQuestions(filtered)
        setSimuladoTitle(`Simulado: ${areaTitle}`)
      }
    } else if (simuladoId.startsWith('simulado-')) {
      // Simulado por tópico
      const topicoId = simuladoId.replace('simulado-', '')
      const topic = ENCCEJA_PROGRESSIVE_TOPICS.find((t) => t.id === topicoId)

      if (topic) {
        const filtered = ENCCEJA_PROGRESSIVE_QUESTIONS.filter(
          (q) => q.topicId === topicoId && q.difficultyLevel === difficulty
        ).slice(0, 10).map((q) => ({
          ...q,
          difficulty: (q.difficultyLevel === 'basico' ? 'easy' : q.difficultyLevel === 'intermediario' ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
          examType: 'encceja' as const,
          educationLevel: 'medio' as const,
          source: q.source as 'encceja',
        } as Question))

        setQuestions(filtered)
        setSimuladoTitle(`Simulado: ${topic.name}`)
      }
    }

    setLoaded(true)
  }, [simuladoId, router])

  const handleComplete = (simuladoResults: SimuladoResults) => {
    setResults(simuladoResults)

    // Salva resultado no localStorage
    const sessionId = `simulado-${Date.now()}`
    const resultData = {
      sessionId,
      simuladoId,
      title: simuladoTitle,
      ...simuladoResults,
      completedAt: new Date().toISOString(),
    }

    try {
      const existing = JSON.parse(localStorage.getItem('simulado_results') || '[]')
      existing.push(resultData)
      localStorage.setItem('simulado_results', JSON.stringify(existing))
    } catch {}
  }

  if (!loaded || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/simulados" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-6">
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Simulado não encontrado</h2>
            <p className="text-slate-300">Desculpe, não conseguimos encontrar este simulado.</p>
          </div>
        </div>
      </div>
    )
  }

  if (results) {
    const passed = results.accuracy >= 60

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/simulados" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-6">
            <ArrowLeft size={20} />
            Voltar
          </Link>

          <div className={`rounded-xl border p-8 text-center mb-8 ${
            passed
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-orange-500/10 border-orange-500/30'
          }`}>
            <div className="text-6xl font-bold mb-4">
              <span className={passed ? 'text-green-400' : 'text-orange-400'}>
                {results.accuracy}%
              </span>
            </div>

            <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-300' : 'text-orange-300'}`}>
              {passed ? '✓ Parabéns!' : 'Continue estudando!'}
            </h2>

            <p className={`text-lg mb-6 ${passed ? 'text-green-300' : 'text-orange-300'}`}>
              Você acertou <strong>{results.correctAnswers}</strong> de <strong>{results.totalQuestions}</strong> questões
            </p>

            <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
              <p className="text-slate-300 text-sm">
                {passed
                  ? 'Excelente desempenho! Você está preparado para avançar para o próximo nível.'
                  : 'Revise o conteúdo e tente novamente. Você vai melhorar!'}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResults(null)
                  setQuestions([])
                  setLoaded(false)
                  window.location.reload()
                }}
                className="flex-1 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Refazer Simulado
              </button>
              <Link
                href="/simulados"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-all text-center"
              >
                Voltar aos Simulados
              </Link>
            </div>
          </div>

          {/* Detalhes por questão */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={24} />
              Detalhes das Respostas
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((q, idx) => {
                const userAnswer = results.answers[idx]
                const isCorrect = userAnswer === q.correctIndex

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <p className="font-semibold text-white mb-2">
                      {idx + 1}. {isCorrect ? '✓' : '✗'} {q.text.substring(0, 60)}...
                    </p>
                    <p className={`text-sm ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                      {isCorrect ? 'Resposta correta' : `Sua resposta: ${q.options[userAnswer] || 'Não respondida'}`}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SimuladoInterface
      questions={questions}
      title={simuladoTitle}
      timeLimit={questions.length > 15 ? 90 : 30}
      onComplete={handleComplete}
    />
  )
}
