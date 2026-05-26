import { SUBJECTS } from './data/subjects'
import { TOPIC_CONTENT } from './data/content'
import { QUESTIONS } from './data/questions'
import type { UserProgress, StudyItem, DailyStudyPlan } from './types'
import { storage } from './storage'

export interface StudyPlan {
  items: StudyItem[]
  totalMinutes: number
  generatedAt: string
}

/**
 * Gera um ID único para um item do plano de estudo
 */
function generateStudyItemId(topicId: string, date: string): string {
  return `${topicId}-${date}`
}

/**
 * Gera plano do dia baseado no desempenho real do aluno
 * Agora com suporte a persistência e consistência durante o dia
 */
export function generateStudyPlan(progress: UserProgress, maxItems = 6): StudyPlan {
  const scored: Array<StudyItem & { score: number }> = []
  const today = new Date().toISOString().split('T')[0]

  for (const subject of SUBJECTS) {
    const sp = progress.subjectProgress[subject.id]
    const totalAnswers = sp?.totalAnswers ?? 0
    const correctAnswers = sp?.correctAnswers ?? 0
    const accuracyPct = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : null

    for (const topic of subject.topics) {
      const content = TOPIC_CONTENT[topic.id]
      const hasContent = !!content
      const hasQuestions = QUESTIONS.some((q) => q.topicId === topic.id)

      // Scoring: maior = maior prioridade
      let score = 0
      let reason: StudyItem['reason']

      if (accuracyPct === null) {
        // Nunca estudou essa matéria
        score = 70
        reason = 'novo'
      } else if (accuracyPct < 40) {
        // Desempenho muito baixo
        score = 100
        reason = 'fraco'
      } else if (accuracyPct < 65) {
        // Desempenho médio
        score = 80
        reason = 'reforco'
      } else {
        // Bom desempenho — revisão leve
        score = 30
        reason = 'revisao'
      }

      // Penalizar tópicos estudados hoje
      if (sp?.lastStudied === today) score -= 40

      // Bonificar tópicos com conteúdo disponível
      if (hasContent) score += 10
      if (hasQuestions) score += 5

      // Aleatoriedade leve para variar o plano (mas controlada para consistência)
      // Usamos a data como seed para garantir consistência durante o dia
      const seed = parseInt(today.replace(/-/g, '')) + topic.id.charCodeAt(0)
      score += (seed % 15)

      scored.push({
        id: generateStudyItemId(topic.id, today),
        topicId: topic.id,
        subjectId: subject.id,
        subjectName: subject.name,
        topicName: topic.name,
        subjectColor: subject.color,
        estimatedMinutes: content?.estimatedMinutes ?? 20,
        reason,
        accuracyPct,
        hasContent,
        hasQuestions,
        score,
      })
    }
  }

  // Ordenar por score decrescente
  scored.sort((a, b) => b.score - a.score)

  // Intercalar matérias diferentes (evitar 3 matemáticas seguidas)
  const interleaved = interleaveBySubject(scored, maxItems)

  const items = interleaved.map(({ score: _score, ...item }) => item)
  const totalMinutes = items.reduce((sum, i) => sum + i.estimatedMinutes, 0)

  return { items, totalMinutes, generatedAt: new Date().toISOString() }
}

function interleaveBySubject<T extends { subjectId: string; score: number }>(
  sorted: T[],
  maxItems: number
): T[] {
  const result: T[] = []
  const used = new Set<string>()

  // Primeira passagem: pega o melhor de cada matéria diferente
  for (const item of sorted) {
    if (result.length >= maxItems) break
    if (!used.has(item.subjectId)) {
      result.push(item)
      used.add(item.subjectId)
    }
  }

  // Segunda passagem: completa se necessário
  if (result.length < maxItems) {
    for (const item of sorted) {
      if (result.length >= maxItems) break
      if (!result.includes(item)) result.push(item)
    }
  }

  return result
}

/**
 * Obtém ou gera o plano de estudo do dia
 * Se já existe um plano para hoje, retorna o existente (consistência)
 * Se não existe, gera um novo
 */
export function getTodayStudyPlan(progress: UserProgress): StudyItem[] {
  const today = new Date().toISOString().split('T')[0]

  // Verifica se há um plano persistido para hoje
  const savedPlan = storage.getDailyPlan()
  if (savedPlan && savedPlan.date === today) {
    return savedPlan.items
  }

  // Gera novo plano
  const newPlan = generateStudyPlan(progress, 6)

  // Cria a estrutura de DailyStudyPlan
  const dailyPlan: DailyStudyPlan = {
    date: today,
    items: newPlan.items,
    totalMinutes: newPlan.totalMinutes,
    generatedAt: newPlan.generatedAt,
    completedItems: [],
  }

  // Persiste o plano
  storage.saveDailyPlan(dailyPlan)

  return newPlan.items
}

/**
 * Regenera o plano do dia (força uma nova geração)
 * Útil quando o usuário quer um novo plano
 */
export function regenerateStudyPlan(progress: UserProgress): StudyItem[] {
  const today = new Date().toISOString().split('T')[0]
  const newPlan = generateStudyPlan(progress, 6)

  const dailyPlan: DailyStudyPlan = {
    date: today,
    items: newPlan.items,
    totalMinutes: newPlan.totalMinutes,
    generatedAt: newPlan.generatedAt,
    completedItems: [],
  }

  storage.saveDailyPlan(dailyPlan)
  return newPlan.items
}

export const REASON_LABELS: Record<StudyItem['reason'], { label: string; color: string }> = {
  novo: { label: 'Novo tópico', color: 'text-violet-400' },
  fraco: { label: 'Precisa reforço', color: 'text-red-400' },
  reforco: { label: 'Em desenvolvimento', color: 'text-amber-400' },
  revisao: { label: 'Revisão leve', color: 'text-emerald-400' },
}
