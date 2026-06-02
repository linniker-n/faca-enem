'use client'

import { useEffect, useState, useRef } from 'react'
import { AlertCircle, CheckCircle, Clock, TrendingUp, SkipForward } from 'lucide-react'
import type { Question } from '@/lib/types'

interface SimuladoInterfaceProps {
  questions: Question[]
  title: string
  timeLimit: number // em minutos
  onComplete: (results: SimuladoResults) => void
}

export interface SimuladoResults {
  correctAnswers: number
  totalQuestions: number
  accuracy: number
  timeSpent: number
  answers: Record<string, number>
}

type QuizPhase = 'starting' | 'running' | 'review' | 'completed'

export function SimuladoInterface({ questions, title, timeLimit, onComplete }: SimuladoInterfaceProps) {
  const [phase, setPhase] = useState<QuizPhase>('starting')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [timeExpired, setTimeExpired] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const timeLimitSeconds = timeLimit * 60

  // Timer
  useEffect(() => {
    if (phase === 'running' && seconds >= timeLimitSeconds) {
      setTimeExpired(true)
      setPhase('review')
      return
    }

    if (phase === 'running') {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase, seconds, timeLimitSeconds])

  function formatTime(s: number) {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = questions[currentIdx]
  const isAnswered = answers[currentIdx] !== undefined
  const isCorrect = isAnswered && answers[currentIdx] === currentQuestion?.correctIndex

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return
    setAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }))
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setShowExplanation(false)
    } else {
      finishSimulado()
    }
  }

  const handleSkip = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setShowExplanation(false)
    }
  }

  const finishSimulado = () => {
    const correctCount = Object.entries(answers).filter(([idx, answer]) => {
      return answer === questions[parseInt(idx)]?.correctIndex
    }).length

    const accuracy = Math.round((correctCount / questions.length) * 100)

    onComplete({
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      accuracy,
      timeSpent: seconds,
      answers,
    })

    setPhase('completed')
  }

  const correctCount = Object.entries(answers).filter(([idx, answer]) => {
    return answer === questions[parseInt(idx)]?.correctIndex
  }).length

  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0
  const timeRemaining = Math.max(0, timeLimitSeconds - seconds)
  const timeProgress = (seconds / timeLimitSeconds) * 100

  if (phase === 'starting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
            <p className="text-slate-300 mb-6">
              Você está prestes a fazer um simulado com <strong>{questions.length} questões</strong>
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">Tempo Limite</span>
                </div>
                <p className="text-2xl font-bold text-white">{timeLimit} min</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm">Pontuação Mínima</span>
                </div>
                <p className="text-2xl font-bold text-white">60%</p>
              </div>
            </div>

            <button
              onClick={() => {
                setPhase('running')
                setSeconds(0)
              }}
              className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Começar Simulado
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'running' && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header com Timer */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-slate-400 text-sm">
                Questão {currentIdx + 1} de {questions.length}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-violet-600 h-full transition-all"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Clock className="w-5 h-5" />
                <span className={timeRemaining < 300 ? 'text-red-400 font-bold' : ''}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <p className="text-sm text-slate-400">{accuracy}% acerto</p>
            </div>
          </div>

          {/* Barra de progresso do tempo */}
          <div className="mb-6">
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  timeProgress > 80 ? 'bg-red-500' : timeProgress > 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${timeProgress}%` }}
              />
            </div>
          </div>

          {/* Questão */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion.text}</h2>

            {/* Opções */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentIdx] === idx
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

            {/* Explicação */}
            {showExplanation && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  <strong>Explicação:</strong> {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-3">
              {!isAnswered && (
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <SkipForward size={18} />
                  Pular
                </button>
              )}
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  {currentIdx < questions.length - 1 ? 'Próxima' : 'Finalizar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
