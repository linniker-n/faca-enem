'use client'

import Link from 'next/link'
import { BookOpen, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { ENCCEJA_PROGRESSIVE_TOPICS } from '@/lib/data/encceja-progressive-topics'
import { mapYearToDifficulty, getRecommendedTopicsForYear } from '@/lib/encceja-utils'
import type { SchoolYear } from '@/lib/types-encceja'

interface ProgressiveTopicsListProps {
  schoolYear?: SchoolYear
  topicProgress?: Record<string, { basico: { completed: boolean }; intermediario: { completed: boolean }; avancado: { completed: boolean } }>
}

export function ProgressiveTopicsList({ schoolYear, topicProgress = {} }: ProgressiveTopicsListProps) {
  const difficulty = mapYearToDifficulty(schoolYear)
  const recommendedTopics = getRecommendedTopicsForYear(schoolYear, ENCCEJA_PROGRESSIVE_TOPICS.map((t) => t.id))

  const filteredTopics = ENCCEJA_PROGRESSIVE_TOPICS.filter((topic) => recommendedTopics.includes(topic.id))

  const difficultyColors = {
    basico: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    intermediario: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    avancado: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  }

  const difficultyBadges = {
    basico: 'bg-blue-500/20 text-blue-300',
    intermediario: 'bg-purple-500/20 text-purple-300',
    avancado: 'bg-orange-500/20 text-orange-300',
  }

  const difficultyLabels = {
    basico: 'Básico',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
  }

  return (
    <div className="space-y-4">
      {filteredTopics.map((topic) => {
        const topicLevelData = topicProgress[topic.id]?.[difficulty]
        const isCompleted = topicLevelData?.completed || false
        const estimatedHours = topic.levels[difficulty]?.estimatedHours || 0

        return (
          <Link
            key={topic.id}
            href={`/estudo-encceja/${topic.id}`}
            className={`block bg-gradient-to-br ${difficultyColors[difficulty]} border rounded-lg p-4 md:p-6 hover:border-opacity-100 transition-all hover:shadow-lg hover:shadow-${difficulty === 'basico' ? 'blue' : difficulty === 'intermediario' ? 'purple' : 'orange'}-500/20`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 flex-shrink-0 opacity-70" />
                  <h3 className="text-lg font-semibold text-white">{topic.name}</h3>
                  {isCompleted && (
                    <span className="ml-auto flex-shrink-0 inline-flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-semibold">
                      ✓ Concluído
                    </span>
                  )}
                </div>

                <p className="text-slate-400 text-sm mb-3">{topic.levels[difficulty]?.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm">
                  <span className={`inline-block px-2 py-1 rounded ${difficultyBadges[difficulty]}`}>
                    {difficultyLabels[difficulty]}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{estimatedHours}h</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{topic.levels[difficulty]?.keyPoints.length || 0} tópicos</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </Link>
        )
      })}

      {filteredTopics.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>Nenhum tópico disponível para este nível.</p>
        </div>
      )}
    </div>
  )
}
