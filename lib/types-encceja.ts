/**
 * Tipos específicos para Encceja
 */

export type DifficultyLevel = 'basico' | 'intermediario' | 'avancado'
export type SchoolYear = '1ano' | '2ano' | '3ano'

/**
 * Representa um tópico com progressão de dificuldade
 */
export interface ProgressiveTopic {
  id: string
  name: string
  subjectId: string
  levels: {
    basico: {
      description: string
      keyPoints: string[]
      estimatedHours: number
    }
    intermediario: {
      description: string
      keyPoints: string[]
      estimatedHours: number
    }
    avancado: {
      description: string
      keyPoints: string[]
      estimatedHours: number
    }
  }
}

/**
 * Questão com nível de dificuldade progressivo
 */
export interface ProgressiveQuestion {
  id: string
  topicId: string
  subjectId: string
  difficultyLevel: DifficultyLevel
  schoolYear?: SchoolYear // Para questões específicas de um ano
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  source: 'encceja'
  sourceYear: number
  keywords: string[] // Palavras-chave para busca
}

/**
 * Progresso do aluno no Encceja com rastreamento por nível
 */
export interface EncejaUserProgress {
  userId: string
  selectedYear?: SchoolYear
  currentDifficultyLevel: DifficultyLevel
  topicProgress: Record<string, {
    basico: {
      completed: boolean
      questionsAnswered: number
      correctAnswers: number
      lastStudied: string | null
    }
    intermediario: {
      completed: boolean
      questionsAnswered: number
      correctAnswers: number
      lastStudied: string | null
    }
    avancado: {
      completed: boolean
      questionsAnswered: number
      correctAnswers: number
      lastStudied: string | null
    }
  }>
  estimatedCompletionDate: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Recomendação de estudo personalizada
 */
export interface StudyRecommendation {
  nextTopic: string
  suggestedDifficulty: DifficultyLevel
  reason: string
  estimatedTimeToComplete: number
  relatedTopics: string[]
}
