'use client'

import Link from 'next/link'
import { Lightbulb, TrendingUp, BookOpen, Clock, ArrowRight } from 'lucide-react'
import { ENCCEJA_PROGRESSIVE_TOPICS } from '@/lib/data/encceja-progressive-topics'
import { generateStudyRecommendation, mapYearToDifficulty } from '@/lib/encceja-utils'
import type { SchoolYear } from '@/lib/types-encceja'

interface SmartRecommendationProps {
  schoolYear?: SchoolYear
  topicProgress?: Record<
    string,
    {
      basico: { completed: boolean; questionsAnswered: number; correctAnswers: number }
      intermediario: { completed: boolean; questionsAnswered: number; correctAnswers: number }
      avancado: { completed: boolean; questionsAnswered: number; correctAnswers: number }
    }
  >
}

export function SmartRecommendation({ schoolYear, topicProgress = {} }: SmartRecommendationProps) {
  const difficulty = mapYearToDifficulty(schoolYear)

  // Encontra o primeiro tópico não concluído
  const nextTopic = ENCCEJA_PROGRESSIVE_TOPICS.find((topic) => {
    const progress = topicProgress[topic.id]
    return !progress?.[difficulty]?.completed
  })

  if (!nextTopic) {
    return (
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Parabéns!</h3>
        </div>
        <p className="text-green-300">
          Você completou todos os tópicos deste nível! Considere avançar para o próximo nível ou revisar tópicos anteriores.
        </p>
      </div>
    )
  }

  const topicProgress_ = topicProgress[nextTopic.id]?.[difficulty]
  const questionsAnswered = topicProgress_?.questionsAnswered || 0
  const correctAnswers = topicProgress_?.correctAnswers || 0
  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0

  const recommendation = generateStudyRecommendation(
    nextTopic.id,
    difficulty,
    accuracy,
    ENCCEJA_PROGRESSIVE_TOPICS.map((t) => t.id)
  )

  const estimatedHours = nextTopic.levels[difficulty]?.estimatedHours || 0

  return (
    <Link href={`/estudo-encceja/${nextTopic.id}`}>
      <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-6 hover:border-violet-500/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-violet-500/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-violet-500/20 p-3 rounded-lg">
              <Lightbulb className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Próximo Tópico Recomendado</h3>
              <p className="text-sm text-slate-400">{recommendation.reason}</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-violet-400 flex-shrink-0" />
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
          <h4 className="text-xl font-bold text-white mb-2">{nextTopic.name}</h4>
          <p className="text-slate-300 text-sm mb-4">{nextTopic.levels[difficulty]?.description}</p>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <BookOpen className="w-4 h-4" />
              <span>{nextTopic.levels[difficulty]?.keyPoints.length || 0} tópicos</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{estimatedHours}h</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <TrendingUp className="w-4 h-4" />
              <span>{accuracy}% acerto</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-violet-300 font-semibold">Começar agora →</span>
          <div className="flex items-center gap-2">
            {questionsAnswered > 0 && (
              <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-1 rounded">
                {questionsAnswered} questões respondidas
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
