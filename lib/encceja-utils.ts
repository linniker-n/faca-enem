import type { DifficultyLevel, SchoolYear, StudyRecommendation } from './types-encceja'

/**
 * Mapeia o ano escolar para o nível de dificuldade recomendado
 */
export function mapYearToDifficulty(year: SchoolYear | undefined): DifficultyLevel {
  switch (year) {
    case '1ano':
      return 'basico'
    case '2ano':
      return 'intermediario'
    case '3ano':
      return 'avancado'
    default:
      return 'basico'
  }
}

/**
 * Retorna a descrição do nível de dificuldade
 */
export function getDifficultyDescription(level: DifficultyLevel): string {
  switch (level) {
    case 'basico':
      return 'Fundamentos e conceitos básicos'
    case 'intermediario':
      return 'Aplicação e análise de conceitos'
    case 'avancado':
      return 'Aprofundamento e síntese'
    default:
      return 'Nível desconhecido'
  }
}

/**
 * Retorna a descrição do ano escolar
 */
export function getYearDescription(year: SchoolYear | undefined): string {
  switch (year) {
    case '1ano':
      return '1º Ano - Fundamentos'
    case '2ano':
      return '2º Ano - Intermediário'
    case '3ano':
      return '3º Ano - Avançado'
    default:
      return 'Não definido'
  }
}

/**
 * Calcula o tempo estimado de estudo em horas
 */
export function calculateEstimatedStudyTime(
  topicsCompleted: number,
  totalTopics: number,
  avgHoursPerTopic: number
): number {
  const remainingTopics = totalTopics - topicsCompleted
  return remainingTopics * avgHoursPerTopic
}

/**
 * Gera uma recomendação de estudo personalizada
 */
export function generateStudyRecommendation(
  currentTopic: string,
  currentDifficulty: DifficultyLevel,
  accuracy: number,
  allTopics: string[]
): StudyRecommendation {
  let nextDifficulty: DifficultyLevel = currentDifficulty
  let nextTopic = currentTopic

  // Se acertou mais de 80%, avança para próximo nível
  if (accuracy > 80 && currentDifficulty !== 'avancado') {
    nextDifficulty = currentDifficulty === 'basico' ? 'intermediario' : 'avancado'
  }

  // Se acertou menos de 60%, repete o nível
  if (accuracy < 60) {
    nextDifficulty = currentDifficulty
  }

  // Se completou todos os níveis do tópico, passa para o próximo
  if (accuracy > 80 && currentDifficulty === 'avancado') {
    const currentIndex = allTopics.indexOf(currentTopic)
    nextTopic = allTopics[currentIndex + 1] || allTopics[0]
    nextDifficulty = 'basico'
  }

  return {
    nextTopic,
    suggestedDifficulty: nextDifficulty,
    reason:
      accuracy > 80
        ? 'Você está indo bem! Vamos aumentar a dificuldade.'
        : accuracy > 60
          ? 'Continue praticando este nível.'
          : 'Vamos revisar este conteúdo.',
    estimatedTimeToComplete: 10,
    relatedTopics: allTopics.filter((t) => t !== nextTopic).slice(0, 3),
  }
}

/**
 * Calcula a porcentagem de progresso do aluno
 */
export function calculateProgressPercentage(
  topicsProgress: Record<
    string,
    {
      basico: { completed: boolean }
      intermediario: { completed: boolean }
      avancado: { completed: boolean }
    }
  >
): number {
  const totalLevels = Object.values(topicsProgress).reduce((sum, topic) => {
    return sum + (topic.basico.completed ? 1 : 0) + (topic.intermediario.completed ? 1 : 0) + (topic.avancado.completed ? 1 : 0)
  }, 0)

  const maxLevels = Object.keys(topicsProgress).length * 3

  return maxLevels > 0 ? Math.round((totalLevels / maxLevels) * 100) : 0
}

/**
 * Retorna os tópicos recomendados para o ano selecionado
 */
export function getRecommendedTopicsForYear(
  year: SchoolYear | undefined,
  allTopics: string[]
): string[] {
  const difficulty = mapYearToDifficulty(year)

  // Para 1º ano (básico), recomenda os primeiros 5 tópicos
  // Para 2º ano (intermediário), recomenda tópicos 6-15
  // Para 3º ano (avançado), recomenda todos

  switch (year) {
    case '1ano':
      return allTopics.slice(0, 5)
    case '2ano':
      return allTopics.slice(5, 15)
    case '3ano':
      return allTopics
    default:
      return allTopics.slice(0, 5)
  }
}
