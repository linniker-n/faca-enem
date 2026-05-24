'use client'

import type { UserProgress, StudyCycle, Flashcard, SimuladoSession, Essay } from './types'

const KEYS = {
  progress: 'facenem:progress',
  cycles: 'facenem:cycles',
  flashcards: 'facenem:flashcards',
  simulados: 'facenem:simulados',
  essays: 'facenem:essays',
}

function get<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

const defaultProgress: UserProgress = {
  streak: 0,
  lastStudyDate: null,
  totalStudyMinutes: 0,
  subjectProgress: {},
  completedSessions: 0,
}

export const storage = {
  getProgress: (): UserProgress => get(KEYS.progress, defaultProgress),
  saveProgress: (p: UserProgress) => set(KEYS.progress, p),

  getCycles: (): StudyCycle[] => get(KEYS.cycles, []),
  saveCycles: (c: StudyCycle[]) => set(KEYS.cycles, c),

  getFlashcards: (): Flashcard[] => get(KEYS.flashcards, []),
  saveFlashcards: (f: Flashcard[]) => set(KEYS.flashcards, f),

  getSimulados: (): SimuladoSession[] => get(KEYS.simulados, []),
  saveSimulados: (s: SimuladoSession[]) => set(KEYS.simulados, s),

  getEssays: (): Essay[] => get(KEYS.essays, []),
  saveEssays: (e: Essay[]) => set(KEYS.essays, e),

  updateStreak: () => {
    const p = get<UserProgress>(KEYS.progress, defaultProgress)
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0]

    let streak = p.streak
    if (p.lastStudyDate === today) return
    if (p.lastStudyDate === yesterday) streak += 1
    else streak = 1

    set(KEYS.progress, { ...p, streak, lastStudyDate: today })
  },

  recordCorrect: (subjectId: string, correct: boolean) => {
    const p = get<UserProgress>(KEYS.progress, defaultProgress)
    const sp = p.subjectProgress[subjectId] ?? { completedTopics: [], correctAnswers: 0, totalAnswers: 0, lastStudied: null }
    set(KEYS.progress, {
      ...p,
      subjectProgress: {
        ...p.subjectProgress,
        [subjectId]: {
          ...sp,
          correctAnswers: sp.correctAnswers + (correct ? 1 : 0),
          totalAnswers: sp.totalAnswers + 1,
          lastStudied: new Date().toISOString().split('T')[0],
        },
      },
    })
  },
}
