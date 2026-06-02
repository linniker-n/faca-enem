'use client'

import { BookOpen, Clock, Target, AlertCircle } from 'lucide-react'
import { getDifficultyDescription } from '@/lib/encceja-utils'
import type { DifficultyLevel } from '@/lib/types-encceja'

interface ProgressiveTopicInfoProps {
  topicName: string
  description: string
  keyPoints: string[]
  estimatedHours: number
  difficulty: DifficultyLevel
}

export function ProgressiveTopicInfo({
  topicName,
  description,
  keyPoints,
  estimatedHours,
  difficulty,
}: ProgressiveTopicInfoProps) {
  const difficultyColors = {
    basico: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    intermediario: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    avancado: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  }

  const difficultyLabels = {
    basico: 'Nível Básico',
    intermediario: 'Nível Intermediário',
    avancado: 'Nível Avançado',
  }

  const difficultyBadgeColors = {
    basico: 'bg-blue-500/20 text-blue-300',
    intermediario: 'bg-purple-500/20 text-purple-300',
    avancado: 'bg-orange-500/20 text-orange-300',
  }

  return (
    <div className={`rounded-xl border p-4 md:p-6 ${difficultyColors[difficulty]}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{topicName}</h2>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${difficultyBadgeColors[difficulty]}`}>
            {difficultyLabels[difficulty]}
          </span>
        </div>
        <BookOpen className="w-6 h-6 md:w-8 md:h-8 opacity-50 flex-shrink-0 ml-4" />
      </div>

      {/* Description */}
      <p className="text-slate-300 mb-4 text-sm md:text-base">{description}</p>

      {/* Estimated Time */}
      <div className="flex items-center gap-2 mb-4 text-sm md:text-base">
        <Clock className="w-4 h-4 md:w-5 md:h-5" />
        <span>Tempo estimado: <strong>{estimatedHours} horas</strong></span>
      </div>

      {/* Key Points */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 md:w-5 md:h-5" />
          <h3 className="font-semibold text-sm md:text-base">Pontos-chave a estudar:</h3>
        </div>
        <ul className="space-y-2 ml-6">
          {keyPoints.map((point, idx) => (
            <li key={idx} className="text-slate-300 text-sm md:text-base flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tip */}
      <div className="mt-4 pt-4 border-t border-current/20 flex gap-3">
        <AlertCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm">
          {difficulty === 'basico' && 'Comece com os conceitos fundamentais. Não se preocupe em memorizar tudo agora.'}
          {difficulty === 'intermediario' && 'Você já conhece os fundamentos. Agora foque em aplicar os conceitos em situações reais.'}
          {difficulty === 'avancado' && 'Você está pronto para desafios! Combine conceitos de diferentes áreas para resolver problemas complexos.'}
        </p>
      </div>
    </div>
  )
}
