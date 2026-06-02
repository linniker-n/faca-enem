import type { ProgressiveQuestion } from './types-encceja'

/**
 * Tipos para sistema de simulados
 */

export type SimuladoType = 'area' | 'topico' | 'completo'

export interface SimuladoConfig {
  id: string
  type: SimuladoType
  title: string
  description: string
  areaId?: string // Para simulados por área
  topicoId?: string // Para simulados por tópico
  totalQuestions: number
  timeLimit: number // em minutos
  passingScore: number // porcentagem mínima para passar
}

export interface SimuladoSession {
  id: string
  userId: string
  simuladoId: string
  startedAt: string
  finishedAt?: string
  answers: Record<string, number> // questionId -> selectedOptionIndex
  score: number
  accuracy: number
  timeSpent: number // em segundos
  status: 'in_progress' | 'completed' | 'abandoned'
}

export interface SimuladoResult {
  sessionId: string
  simuladoId: string
  title: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  score: number
  passingScore: number
  passed: boolean
  timeSpent: number
  completedAt: string
  detailedResults: {
    questionId: string
    correct: boolean
    userAnswer: number
    correctAnswer: number
    explanation: string
  }[]
}

export interface SimuladoStats {
  totalSimulados: number
  completedSimulados: number
  averageAccuracy: number
  bestScore: number
  worstScore: number
  lastSimuladoDate?: string
  simuladosByArea: Record<string, { completed: number; averageAccuracy: number }>
}
