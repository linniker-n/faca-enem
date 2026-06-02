import { useCallback, useMemo } from 'react'
import { ENCCEJA_PROGRESSIVE_QUESTIONS } from '@/lib/data/encceja-progressive-questions'
import { ENCCEJA_PROGRESSIVE_TOPICS } from '@/lib/data/encceja-progressive-topics'
import type { DifficultyLevel, SchoolYear, ProgressiveQuestion } from '@/lib/types-encceja'
import type { Question } from '@/lib/types'
import { mapYearToDifficulty } from '@/lib/encceja-utils'

/**
 * Hook para gerenciar questões progressivas do Encceja
 */
export function useProgressiveQuestions(
  topicId: string | undefined,
  subjectId: string | undefined,
  schoolYear: SchoolYear | undefined,
  isEncceja: boolean
) {
  const difficulty = useMemo(() => mapYearToDifficulty(schoolYear), [schoolYear])

  // Filtra questões progressivas por tópico, matéria e dificuldade
  const progressiveQuestions = useMemo(() => {
    if (!isEncceja || !topicId || !subjectId) return []

    return ENCCEJA_PROGRESSIVE_QUESTIONS.filter((q) => {
      const topicMatch = q.topicId === topicId
      const subjectMatch = q.subjectId === subjectId
      const difficultyMatch = q.difficultyLevel === difficulty

      return topicMatch && subjectMatch && difficultyMatch
    })
  }, [topicId, subjectId, difficulty, isEncceja])

  // Converte questões progressivas para o formato padrão
  const convertedQuestions = useMemo(() => {
    return progressiveQuestions.map((pq) => ({
      id: pq.id,
      text: pq.text,
      options: pq.options,
      correctIndex: pq.correctIndex,
      explanation: pq.explanation,
      topicId: pq.topicId,
      subjectId: pq.subjectId,
      source: pq.source as 'encceja',
      sourceYear: pq.sourceYear,
      examType: 'encceja' as const,
      educationLevel: 'medio' as const,
      difficulty: (
        pq.difficultyLevel === 'basico' ? 'easy' : pq.difficultyLevel === 'intermediario' ? 'medium' : 'hard'
      ) as 'easy' | 'medium' | 'hard',
    } as Question))
  }, [progressiveQuestions])

  // Obtém informações do tópico
  const topicInfo = useMemo(() => {
    if (!topicId) return null

    const topic = ENCCEJA_PROGRESSIVE_TOPICS.find((t) => t.id === topicId)
    if (!topic) return null

    return {
      name: topic.name,
      description: topic.levels[difficulty]?.description || '',
      keyPoints: topic.levels[difficulty]?.keyPoints || [],
      estimatedHours: topic.levels[difficulty]?.estimatedHours || 0,
      difficulty,
    }
  }, [topicId, difficulty])

  // Obtém questões de outros níveis para revisão
  const reviewQuestions = useCallback(
    (targetDifficulty: DifficultyLevel) => {
      if (!topicId || !subjectId) return []

      return ENCCEJA_PROGRESSIVE_QUESTIONS.filter((q) => {
        const topicMatch = q.topicId === topicId
        const subjectMatch = q.subjectId === subjectId
        const difficultyMatch = q.difficultyLevel === targetDifficulty

        return topicMatch && subjectMatch && difficultyMatch
      })
    },
    [topicId, subjectId]
  )

  return {
    questions: convertedQuestions,
    progressiveQuestions,
    topicInfo,
    difficulty,
    reviewQuestions,
    hasQuestions: convertedQuestions.length > 0,
  }
}
