'use client'

import type { UserProgress, StudyCycle, Flashcard, SimuladoSession, Essay, DailyStudyPlan, UserLevel } from './types'
import { calculateLevel } from './xp-config'

/**
 * Chaves de armazenamento com suporte a múltiplos usuários
 * Formato: facenem:{userId}:{dataType}
 */
function getKeys(userId: string) {
  return {
    progress: `facenem:${userId}:progress`,
    cycles: `facenem:${userId}:cycles`,
    flashcards: `facenem:${userId}:flashcards`,
    simulados: `facenem:${userId}:simulados`,
    essays: `facenem:${userId}:essays`,
    dailyPlan: `facenem:${userId}:daily-plan`,
  }
}

/**
 * Obtém o ID do usuário atual (por enquanto, usa um ID padrão)
 * Em produção, seria obtido do contexto de autenticação
 */
function getCurrentUserId(): string {
  if (typeof window === 'undefined') return 'default-user'
  const userId = localStorage.getItem('facenem:userId')
  if (userId) return userId
  // Gera um ID único para o usuário
  const newUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('facenem:userId', newUserId)
  return newUserId
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

const defaultLevel: UserLevel = {
  currentLevel: 1,
  totalXP: 0,
  xpForNextLevel: 500,
  xpInCurrentLevel: 0,
}

const defaultProgress: UserProgress = {
  userId: '',
  examType: undefined as any, // Sem valor padrão para forçar seleção
  educationLevel: undefined,
  streak: 0,
  lastStudyDate: null,
  totalStudyMinutes: 0,
  subjectProgress: {},
  completedSessions: 0,
  level: defaultLevel,
  dailyStudyPlan: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const storage = {
  /**
   * Obtém o ID do usuário atual
   */
  getCurrentUserId: getCurrentUserId,

  /**
   * Obtém o progresso do usuário atual
   */
  getProgress: (): UserProgress => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    let p = get<UserProgress>(keys.progress, { ...defaultProgress, userId })
    if (!p.userId) p.userId = userId
    if (!p.level) p.level = defaultLevel
    if (!p.createdAt) p.createdAt = new Date().toISOString()
    if (!p.updatedAt) p.updatedAt = new Date().toISOString()
    return p
  },

  /**
   * Salva o progresso do usuário atual
   */
  saveProgress: (p: UserProgress) => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const updated = { ...p, userId, updatedAt: new Date().toISOString() }
    set(keys.progress, updated)
  },

  /**
   * Obtém o plano de estudo do dia atual
   */
  getDailyPlan: (): DailyStudyPlan | null => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const plan = get<DailyStudyPlan | null>(keys.dailyPlan, null)
    const today = new Date().toISOString().split('T')[0]

    // Se o plano é de outro dia, retorna null
    if (plan && plan.date !== today) {
      return null
    }
    return plan
  },

  /**
   * Salva o plano de estudo do dia atual
   */
  saveDailyPlan: (plan: DailyStudyPlan) => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    set(keys.dailyPlan, plan)
  },

  /**
   * Marca um item do plano como concluído
   */
  completeStudyItem: (itemId: string) => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const plan = get<DailyStudyPlan | null>(keys.dailyPlan, null)
    if (plan && !plan.completedItems.includes(itemId)) {
      plan.completedItems.push(itemId)
      set(keys.dailyPlan, plan)
    }
  },

  /**
   * Obtém os ciclos de estudo do usuário
   */
  getCycles: (): StudyCycle[] => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const cycles = get<StudyCycle[]>(keys.cycles, [])
    // Garante que todos os ciclos têm userId
    return cycles.map((c) => ({ ...c, userId }))
  },

  /**
   * Salva os ciclos de estudo do usuário
   */
  saveCycles: (c: StudyCycle[]) => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const updated = c.map((cycle) => ({ ...cycle, userId }))
    set(keys.cycles, updated)
  },

  /**
   * Obtém os flashcards do usuário
   */
  getFlashcards: (): Flashcard[] => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const cards = get<Flashcard[]>(keys.flashcards, [])
    // Garante que todos os flashcards têm userId
    return cards.map((c) => ({ ...c, userId }))
  },

  /**
   * Salva os flashcards do usuário
   */
  saveFlashcards: (f: Flashcard[]) => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const updated = f.map((card) => ({ ...card, userId }))
    set(keys.flashcards, updated)
  },

  /**
   * Obtém os simulados do usuário
   */
  getSimulados: (): SimuladoSession[] => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const simulados = get<SimuladoSession[]>(keys.simulados, [])
    // Garante que todos os simulados têm userId
    return simulados.map((s) => ({ ...s, userId }))
  },

  /**
   * Salva os simulados do usuário
   */
  saveSimulados: (s: SimuladoSession[]) => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const updated = s.map((simulado) => ({ ...simulado, userId }))
    set(keys.simulados, updated)
  },

  /**
   * Obtém as redações do usuário
   */
  getEssays: (): Essay[] => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const essays = get<Essay[]>(keys.essays, [])
    // Garante que todos os ensaios têm userId
    return essays.map((e) => ({ ...e, userId }))
  },

  /**
   * Salva as redações do usuário
   */
  saveEssays: (e: Essay[]) => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    const updated = e.map((essay) => ({ ...essay, userId }))
    set(keys.essays, updated)
  },

  /**
   * Atualiza a sequência de dias de estudo
   */
  updateStreak: () => {
    const p = storage.getProgress()
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0]

    let streak = p.streak
    if (p.lastStudyDate === today) return
    if (p.lastStudyDate === yesterday) streak += 1
    else streak = 1

    storage.saveProgress({ ...p, streak, lastStudyDate: today })
  },

  /**
   * Registra uma resposta correta/incorreta e atualiza XP
   * Agora também atualiza progresso por tópico
   */
  recordCorrect: (subjectId: string, topicId: string, correct: boolean, xpGained: number = 0) => {
    const p = storage.getProgress()
    const sp = p.subjectProgress[subjectId] ?? {
      completedTopics: [],
      correctAnswers: 0,
      totalAnswers: 0,
      lastStudied: null,
      topicProgress: {},
    }

    // Atualiza progresso por tópico
    const tp = sp.topicProgress?.[topicId] ?? {
      topicId,
      completedCount: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      lastStudied: null,
      averageAccuracy: 0,
    }

    tp.correctAnswers += correct ? 1 : 0
    tp.totalAnswers += 1
    tp.lastStudied = new Date().toISOString().split('T')[0]
    tp.averageAccuracy = Math.round((tp.correctAnswers / tp.totalAnswers) * 100)

    // Atualiza progresso por matéria
    sp.correctAnswers += correct ? 1 : 0
    sp.totalAnswers += 1
    sp.lastStudied = new Date().toISOString().split('T')[0]
    sp.topicProgress = { ...sp.topicProgress, [topicId]: tp }

    // Atualiza XP total
    const newTotalXP = p.level.totalXP + xpGained
    const levelInfo = calculateLevel(newTotalXP)

    const newLevel: UserLevel = {
      currentLevel: levelInfo.level,
      totalXP: newTotalXP,
      xpForNextLevel: levelInfo.xpForNext,
      xpInCurrentLevel: levelInfo.xpInCurrent,
    }

    storage.saveProgress({
      ...p,
      subjectProgress: {
        ...p.subjectProgress,
        [subjectId]: sp,
      },
      level: newLevel,
    })
  },

  /**
   * Adiciona tempo estudado
   */
  addStudyTime: (minutes: number) => {
    const p = storage.getProgress()
    storage.saveProgress({
      ...p,
      totalStudyMinutes: p.totalStudyMinutes + minutes,
    })
  },

  /**
   * Incrementa sessões completadas
   */
  incrementCompletedSessions: () => {
    const p = storage.getProgress()
    storage.saveProgress({
      ...p,
      completedSessions: p.completedSessions + 1,
    })
  },

  /**
   * Limpa todos os dados do usuário (útil para testes ou reset)
   */
  clearUserData: () => {
    const userId = getCurrentUserId()
    const keys = getKeys(userId)
    Object.values(keys).forEach((key) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
      }
    })
  },

  /**
   * Muda para um novo usuário
   */
  switchUser: (newUserId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('facenem:userId', newUserId)
    }
  },
}
