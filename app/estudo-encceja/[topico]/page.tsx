'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  TrendingUp,
} from 'lucide-react'
import { ENCCEJA_PROGRESSIVE_TOPICS } from '@/lib/data/encceja-progressive-topics'
import { storage } from '@/lib/storage'
import { useProgressiveQuestions } from '@/lib/hooks/useProgressiveQuestions'
import { ProgressiveTopicInfo } from '@/components/ProgressiveTopicInfo'
import { mapYearToDifficulty } from '@/lib/encceja-utils'
import type { UserProgress } from '@/lib/types'

type QuizPhase = 'idle' | 'running' | 'done'

export default function EstudoEncejaPage() {
  const params = useParams()
  const router = useRouter()
  const topico = params.topico as string

  // Estado do usuário
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Estado do estudo
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [targetMinutes, setTargetMinutes] = useState(30)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Estado do quiz
  const [quizPhase, setQuizPhase] = useState<QuizPhase>('idle')
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizDone, setQuizDone] = useState(false)

  // Carrega dados do usuário
  useEffect(() => {
    const p = storage.getProgress()

    if (!p.examType || p.examType !== 'encceja') {
      router.push('/modalidade')
      return
    }

    setProgress(p)
    setLoaded(true)
  }, [router])

  // Hook para questões progressivas
  const { questions, topicInfo, difficulty } = useProgressiveQuestions(
    topico,
    '', // subjectId será extraído do tópico
    progress?.schoolYear,
    true
  )

  // Encontra a matéria do tópico
  const topic = ENCCEJA_PROGRESSIVE_TOPICS.find((t) => t.id === topico)
  const subjectId = topic?.subjectId || ''

  // Timer
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [running])

  function formatTime(s: number) {
    return `${Math.floor(s / 60)
      .toString()
      .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  }

  const targetSeconds = targetMinutes * 60
  const timerProgress = Math.min((seconds / targetSeconds) * 100, 100)
  const timerDone = seconds >= targetSeconds

  // Quiz
  const currentQuestion = questions[quizIdx]
  const isAnswered = quizAnswers[quizIdx] !== undefined
  const isCorrect = isAnswered && quizAnswers[quizIdx] === currentQuestion?.correctIndex

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return
    setQuizAnswers((prev) => ({ ...prev, [quizIdx]: optionIdx }))
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (quizIdx < questions.length - 1) {
      setQuizIdx(quizIdx + 1)
      setShowExplanation(false)
    } else {
      setQuizDone(true)
      setQuizPhase('done')
    }
  }

  const handleRestartQuiz = () => {
    setQuizIdx(0)
    setQuizAnswers({})
    setShowExplanation(false)
    setQuizDone(false)
    setQuizPhase('idle')
  }

  const correctCount = Object.entries(quizAnswers).filter(([idx, answer]) => {
    return answer === questions[parseInt(idx)]?.correctIndex
  }).length

  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  if (!loaded || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    )
  }

  if (!topicInfo || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-6">
          <ArrowLeft size={20} />
          Voltar
        </Link>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Tópico não encontrado</h2>
            <p className="text-slate-300">Desculpe, não conseguimos encontrar este tópico.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300">
            <ArrowLeft size={20} />
            <span className="hidden md:inline">Voltar</span>
          </Link>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Ano: {progress.schoolYear}</p>
            <p className="text-slate-400 text-sm">Nível: {difficulty}</p>
          </div>
        </div>

        {/* Topic Info */}
        <div className="mb-8">
          <ProgressiveTopicInfo
            topicName={topicInfo.name}
            description={topicInfo.description}
            keyPoints={topicInfo.keyPoints}
            estimatedHours={topicInfo.estimatedHours}
            difficulty={difficulty}
          />
        </div>

        {/* Timer Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <BookOpen size={20} />
              Tempo de Estudo
            </h3>
            <button
              onClick={() => setTargetMinutes(Math.max(5, targetMinutes - 5))}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded"
            >
              -
            </button>
            <span className="text-2xl font-bold text-violet-400 mx-2">{targetMinutes} min</span>
            <button
              onClick={() => setTargetMinutes(Math.min(120, targetMinutes + 5))}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-violet-600 h-full transition-all"
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
            </div>
            <span className="text-2xl font-mono text-white w-16 text-right">{formatTime(seconds)}</span>
            <button
              onClick={() => setRunning(!running)}
              className="bg-violet-500 hover:bg-violet-600 text-white p-2 rounded-lg transition-colors"
            >
              {running ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={() => {
                setSeconds(0)
                setRunning(false)
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} />
            Pratique com Questões
          </h3>

          {quizPhase === 'idle' && (
            <div className="text-center">
              <p className="text-slate-300 mb-6">
                Você tem <strong>{questions.length} questões</strong> disponíveis para este nível.
              </p>
              <button
                onClick={() => {
                  setQuizPhase('running')
                  setQuizIdx(0)
                  setQuizAnswers({})
                  setShowExplanation(false)
                }}
                className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Começar Quiz
              </button>
            </div>
          )}

          {quizPhase === 'running' && currentQuestion && (
            <div>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">
                    Questão {quizIdx + 1} de {questions.length}
                  </span>
                  <span className="text-sm text-slate-400">{accuracy}% de acerto</span>
                </div>
                <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-violet-600 h-full transition-all"
                    style={{ width: `${((quizIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">{currentQuestion.text}</h4>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = quizAnswers[quizIdx] === idx
                    const isCorrectOption = idx === currentQuestion.correctIndex
                    const showCorrect = isAnswered && isCorrectOption
                    const showWrong = isAnswered && isSelected && !isCorrectOption

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showCorrect
                            ? 'border-green-500 bg-green-500/10'
                            : showWrong
                              ? 'border-red-500 bg-red-500/10'
                              : isSelected
                                ? 'border-violet-500 bg-violet-500/10'
                                : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                        } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                              showCorrect
                                ? 'border-green-500 bg-green-500'
                                : showWrong
                                  ? 'border-red-500 bg-red-500'
                                  : isSelected
                                    ? 'border-violet-500 bg-violet-500'
                                    : 'border-slate-600'
                            }`}
                          >
                            {showCorrect && <CheckCircle size={16} className="text-white" />}
                            {showWrong && <AlertCircle size={16} className="text-white" />}
                          </div>
                          <span className="text-slate-300 flex-1">{option}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <p className="text-blue-300 text-sm">
                    <strong>Explicação:</strong> {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  {quizIdx < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
                </button>
              )}
            </div>
          )}

          {quizPhase === 'done' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl font-bold text-violet-400 mb-2">{accuracy}%</div>
                <p className="text-slate-300 mb-4">
                  Você acertou <strong>{correctCount}</strong> de <strong>{questions.length}</strong> questões
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 mb-6 text-left">
                <p className="text-slate-300 text-sm">
                  {accuracy >= 80 && '🎉 Excelente! Você está pronto para o próximo nível!'}
                  {accuracy >= 60 && accuracy < 80 && '👍 Bom! Continue praticando para melhorar.'}
                  {accuracy < 60 && '📚 Continue estudando este tópico. Você vai melhorar!'}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRestartQuiz}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Refazer Quiz
                </button>
                <Link
                  href="/"
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-all text-center"
                >
                  Voltar ao Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
