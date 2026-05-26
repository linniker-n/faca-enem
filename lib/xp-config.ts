import type { XPConfig, LevelConfig } from './types'

/**
 * Configuração de XP para diferentes atividades
 * Ajuste estes valores para balancear a progressão do jogo
 */
export const XP_CONFIG: XPConfig = {
  questionCorrect: 10, // XP por questão correta
  questionIncorrect: 2, // XP por questão incorreta (incentiva tentar)
  sessionCompleted: 50, // XP por sessão de estudo concluída
  topicCompleted: 100, // XP por tópico completamente dominado
  simuladoCompleted: 150, // XP por simulado concluído
  essaySubmitted: 75, // XP por redação submetida
}

/**
 * Configuração de níveis
 * Cada nível requer progressivamente mais XP
 * Baseado em progressão exponencial suave
 */
export const LEVEL_CONFIG: LevelConfig[] = [
  { level: 1, requiredXP: 0, title: 'Iniciante' },
  { level: 2, requiredXP: 500, title: 'Aprendiz' },
  { level: 3, requiredXP: 1200, title: 'Estudante' },
  { level: 4, requiredXP: 2200, title: 'Dedicado' },
  { level: 5, requiredXP: 3500, title: 'Proficiente' },
  { level: 6, requiredXP: 5000, title: 'Avançado' },
  { level: 7, requiredXP: 6800, title: 'Especialista' },
  { level: 8, requiredXP: 8800, title: 'Mestre' },
  { level: 9, requiredXP: 11000, title: 'Sábio' },
  { level: 10, requiredXP: 13500, title: 'Lendário' },
]

/**
 * Calcula o nível atual baseado no XP total
 */
export function calculateLevel(totalXP: number): { level: number; xpForNext: number; xpInCurrent: number } {
  let currentLevel = 1
  let nextLevelXP = LEVEL_CONFIG[1]?.requiredXP ?? 500

  for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_CONFIG[i].requiredXP) {
      currentLevel = LEVEL_CONFIG[i].level
      nextLevelXP = LEVEL_CONFIG[i + 1]?.requiredXP ?? LEVEL_CONFIG[i].requiredXP + 5000
      break
    }
  }

  const currentLevelXP = LEVEL_CONFIG.find((l) => l.level === currentLevel)?.requiredXP ?? 0
  const xpInCurrent = totalXP - currentLevelXP
  const xpForNext = nextLevelXP - currentLevelXP

  return { level: currentLevel, xpForNext, xpInCurrent }
}

/**
 * Obtém o título do nível
 */
export function getLevelTitle(level: number): string {
  return LEVEL_CONFIG.find((l) => l.level === level)?.title ?? 'Desconhecido'
}

/**
 * Calcula XP ganho em uma sessão de questões
 */
export function calculateSessionXP(correctCount: number, totalCount: number): number {
  const correctXP = correctCount * XP_CONFIG.questionCorrect
  const incorrectXP = (totalCount - correctCount) * XP_CONFIG.questionIncorrect
  return correctXP + incorrectXP
}
