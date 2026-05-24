import type { Question } from './types'

const DIFFICULTY_WEIGHT = { easy: 0.8, medium: 1.0, hard: 1.3 }

export function calculateTRI(
  answers: { question: Question; selectedIndex: number | null }[]
): number {
  if (answers.length === 0) return 0

  let weightedCorrect = 0
  let totalWeight = 0

  for (const { question, selectedIndex } of answers) {
    const w = DIFFICULTY_WEIGHT[question.difficulty]
    totalWeight += w
    if (selectedIndex === question.correctIndex) {
      weightedCorrect += w
    }
  }

  const rawRatio = weightedCorrect / totalWeight
  const triScore = Math.round(rawRatio * 1000)
  return Math.min(1000, Math.max(0, triScore))
}

export function triToNota(triScore: number): number {
  return Math.round((triScore / 1000) * 1000)
}

export function scoreLabel(pct: number): string {
  if (pct >= 0.9) return 'Excelente'
  if (pct >= 0.7) return 'Bom'
  if (pct >= 0.5) return 'Regular'
  if (pct >= 0.3) return 'Abaixo da média'
  return 'Precisa melhorar'
}
