import type { Flashcard } from './types'

export function sm2Review(card: Flashcard, quality: number): Flashcard {
  const { easeFactor, interval, repetitions } = card

  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  newEF = Math.max(1.3, newEF)

  let newInterval: number
  let newReps: number

  if (quality < 3) {
    newReps = 0
    newInterval = 1
  } else {
    newReps = repetitions + 1
    if (repetitions === 0) newInterval = 1
    else if (repetitions === 1) newInterval = 6
    else newInterval = Math.round(interval * newEF)
  }

  const next = new Date()
  next.setDate(next.getDate() + newInterval)

  return {
    ...card,
    easeFactor: newEF,
    interval: newInterval,
    repetitions: newReps,
    nextReviewDate: next.toISOString().split('T')[0],
  }
}

export function isDueToday(card: Flashcard): boolean {
  const today = new Date().toISOString().split('T')[0]
  return card.nextReviewDate <= today
}

export function newCard(partial: Omit<Flashcard, 'easeFactor' | 'interval' | 'repetitions' | 'nextReviewDate' | 'createdAt'>): Flashcard {
  const today = new Date().toISOString().split('T')[0]
  return {
    ...partial,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: today,
    createdAt: new Date().toISOString(),
  }
}
