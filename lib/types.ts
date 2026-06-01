export type Area = 'linguagens' | 'humanas' | 'natureza' | 'matematica'
export type ExamType = 'enem' | 'encceja'
export type EducationLevel = 'fundamental' | 'medio'

export interface Topic {
  id: string
  name: string
  subjectId: string
}

export interface Subject {
  id: string
  name: string
  area: Area
  color: string
  bgClass: string
  topics: Topic[]
}

/**
 * Sistema de Níveis do Aluno
 * - XP é acumulado por atividades (questões corretas, sessões concluídas, etc)
 * - Nível é calculado a partir do XP total
 * - Cada nível requer progressivamente mais XP
 */
export interface UserLevel {
  currentLevel: number
  totalXP: number
  xpForNextLevel: number // XP necessário para atingir o próximo nível
  xpInCurrentLevel: number // XP acumulado no nível atual
}

/**
 * Progresso por tópico específico
 * Rastreia desempenho granular para cada tópico, não apenas por matéria
 */
export interface TopicProgress {
  topicId: string
  completedCount: number // Quantas vezes o tópico foi estudado
  correctAnswers: number
  totalAnswers: number
  lastStudied: string | null
  averageAccuracy: number // Acurácia média neste tópico
}

/**
 * Progresso por matéria
 * Agregação de todos os tópicos da matéria
 */
export interface SubjectProgress {
  completedTopics: string[] // IDs dos tópicos concluídos
  correctAnswers: number
  totalAnswers: number
  lastStudied: string | null
  topicProgress: Record<string, TopicProgress> // Progresso granular por tópico
}

/**
 * Plano de estudo de um dia específico
 * Persistido para garantir consistência durante o dia
 */
export interface DailyStudyPlan {
  date: string // ISO date (YYYY-MM-DD)
  items: StudyItem[]
  totalMinutes: number
  generatedAt: string
  completedItems: string[] // IDs dos itens completados
}

/**
 * Item individual do plano de estudo
 */
export interface StudyItem {
  id: string // Identificador único para rastrear conclusão
  topicId: string
  subjectId: string
  subjectName: string
  topicName: string
  subjectColor: string
  estimatedMinutes: number
  reason: 'novo' | 'fraco' | 'reforco' | 'revisao'
  accuracyPct: number | null
  hasContent: boolean
  hasQuestions: boolean
  completedAt?: string // Timestamp quando foi concluído
}

/**
 * Progresso geral do usuário
 * Agora com suporte a múltiplos usuários via userId
 */
export interface UserProgress {
  userId: string // Identificador único do usuário
  examType: ExamType // ENEM ou Encceja
  educationLevel?: EducationLevel // Fundamental ou Médio (para Encceja)
  streak: number
  lastStudyDate: string | null
  totalStudyMinutes: number
  subjectProgress: Record<string, SubjectProgress>
  completedSessions: number
  level: UserLevel
  dailyStudyPlan: DailyStudyPlan | null // Plano do dia atual, persistido
  createdAt: string
  updatedAt: string
}

export interface StudyCycle {
  id: string
  userId: string // Suporte a múltiplos usuários
  name: string
  subjects: CycleSubjectConfig[]
  createdAt: string
  currentPosition: number
  completedSessions: number
}

export interface CycleSubjectConfig {
  subjectId: string
  minutesPerSession: number
  priority: 'high' | 'medium' | 'low'
}

export interface Flashcard {
  id: string
  userId: string // Suporte a múltiplos usuários
  front: string
  back: string
  subjectId: string
  topicId: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  createdAt: string
}

/**
 * Questão com suporte a múltiplas bancas e anos
 */
export interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  subjectId: string
  topicId: string
  year?: number
  difficulty: 'easy' | 'medium' | 'hard'
  source?: 'enem' | 'fuvest' | 'unicamp' | 'usp' | 'puc' | 'ita' | 'ime' | 'ufmg' | 'ufba' | 'encceja' | 'other'
  sourceYear?: number // Ano da prova específica
  examType?: ExamType // ENEM ou Encceja
  educationLevel?: EducationLevel // Fundamental ou Médio (para Encceja)
}

export interface SimuladoSession {
  id: string
  userId: string // Suporte a múltiplos usuários
  type: 'full' | 'area' | 'topico'
  areaFilter?: Area
  subjectFilter?: string
  totalQuestions: number
  answers: Record<string, number>
  startedAt: string
  completedAt?: string
  score?: number
  triScore?: number
  correctCount?: number
  xpEarned?: number // XP ganho neste simulado
}

export interface Essay {
  id: string
  userId: string // Suporte a múltiplos usuários
  theme: string
  text: string
  createdAt: string
  feedback?: EssayFeedback
}

export interface CompetencyEval {
  score: number
  feedback: string
}

export interface EssayFeedback {
  competency1: CompetencyEval
  competency2: CompetencyEval
  competency3: CompetencyEval
  competency4: CompetencyEval
  competency5: CompetencyEval
  totalScore: number
  strengths: string[]
  improvements: string[]
  evaluatedAt: string
}

/**
 * Configuração de XP para diferentes atividades
 */
export interface XPConfig {
  questionCorrect: number // XP por questão correta
  questionIncorrect: number // XP por questão incorreta (menor)
  sessionCompleted: number // XP por sessão concluída
  topicCompleted: number // XP por tópico concluído
  simuladoCompleted: number // XP por simulado concluído
  essaySubmitted: number // XP por redação submetida
}

/**
 * Configuração de níveis
 * Define quantos XP são necessários para cada nível
 */
export interface LevelConfig {
  level: number
  requiredXP: number // XP total necessário para atingir este nível
  title: string // Nome do nível (ex: "Iniciante", "Intermediário", etc)
}
