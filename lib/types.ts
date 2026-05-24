export type Area = 'linguagens' | 'humanas' | 'natureza' | 'matematica'

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

export interface UserProgress {
  streak: number
  lastStudyDate: string | null
  totalStudyMinutes: number
  subjectProgress: Record<string, SubjectProgress>
  completedSessions: number
}

export interface SubjectProgress {
  completedTopics: string[]
  correctAnswers: number
  totalAnswers: number
  lastStudied: string | null
}

export interface StudyCycle {
  id: string
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
}

export interface SimuladoSession {
  id: string
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
}

export interface Essay {
  id: string
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
