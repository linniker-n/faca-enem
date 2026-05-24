import type { Subject } from '../types'

export const SUBJECTS: Subject[] = [
  {
    id: 'portugues',
    name: 'Língua Portuguesa',
    area: 'linguagens',
    color: '#3b82f6',
    bgClass: 'bg-blue-500',
    topics: [
      { id: 'gramatica', name: 'Gramática', subjectId: 'portugues' },
      { id: 'interpretacao', name: 'Interpretação de Texto', subjectId: 'portugues' },
      { id: 'generos-textuais', name: 'Gêneros Textuais', subjectId: 'portugues' },
      { id: 'literatura-brasileira', name: 'Literatura Brasileira', subjectId: 'portugues' },
      { id: 'variedades-linguisticas', name: 'Variedades Linguísticas', subjectId: 'portugues' },
    ],
  },
  {
    id: 'ingles',
    name: 'Língua Inglesa',
    area: 'linguagens',
    color: '#6366f1',
    bgClass: 'bg-indigo-500',
    topics: [
      { id: 'compreensao-leitora', name: 'Compreensão Leitora', subjectId: 'ingles' },
      { id: 'vocabulario', name: 'Vocabulário em Contexto', subjectId: 'ingles' },
    ],
  },
  {
    id: 'artes',
    name: 'Arte',
    area: 'linguagens',
    color: '#ec4899',
    bgClass: 'bg-pink-500',
    topics: [
      { id: 'arte-brasileira', name: 'Arte Brasileira', subjectId: 'artes' },
      { id: 'arte-contemporanea', name: 'Arte Contemporânea', subjectId: 'artes' },
      { id: 'patrimonio-cultural', name: 'Patrimônio Cultural', subjectId: 'artes' },
    ],
  },
  {
    id: 'historia',
    name: 'História',
    area: 'humanas',
    color: '#f97316',
    bgClass: 'bg-orange-500',
    topics: [
      { id: 'brasil-colonial', name: 'Brasil Colonial', subjectId: 'historia' },
      { id: 'brasil-imperial', name: 'Brasil Imperial', subjectId: 'historia' },
      { id: 'era-vargas', name: 'Era Vargas e Ditadura', subjectId: 'historia' },
      { id: 'idade-moderna', name: 'Idade Moderna', subjectId: 'historia' },
      { id: 'idade-contemporanea', name: 'Idade Contemporânea', subjectId: 'historia' },
      { id: 'direitos-humanos', name: 'Direitos Humanos', subjectId: 'historia' },
    ],
  },
  {
    id: 'geografia',
    name: 'Geografia',
    area: 'humanas',
    color: '#10b981',
    bgClass: 'bg-emerald-500',
    topics: [
      { id: 'populacao', name: 'População', subjectId: 'geografia' },
      { id: 'agraria', name: 'Questão Agrária', subjectId: 'geografia' },
      { id: 'meio-ambiente', name: 'Meio Ambiente', subjectId: 'geografia' },
      { id: 'globalizacao', name: 'Globalização', subjectId: 'geografia' },
      { id: 'climatologia', name: 'Climatologia', subjectId: 'geografia' },
    ],
  },
  {
    id: 'filosofia',
    name: 'Filosofia',
    area: 'humanas',
    color: '#a78bfa',
    bgClass: 'bg-violet-400',
    topics: [
      { id: 'filosofia-grega', name: 'Filosofia Grega', subjectId: 'filosofia' },
      { id: 'filosofia-moderna', name: 'Filosofia Moderna', subjectId: 'filosofia' },
      { id: 'etica', name: 'Ética e Política', subjectId: 'filosofia' },
    ],
  },
  {
    id: 'sociologia',
    name: 'Sociologia',
    area: 'humanas',
    color: '#fb923c',
    bgClass: 'bg-orange-400',
    topics: [
      { id: 'cultura', name: 'Cultura e Identidade', subjectId: 'sociologia' },
      { id: 'conflitos-sociais', name: 'Conflitos Sociais', subjectId: 'sociologia' },
      { id: 'ciencia-politica', name: 'Ciência Política', subjectId: 'sociologia' },
    ],
  },
  {
    id: 'biologia',
    name: 'Biologia',
    area: 'natureza',
    color: '#22c55e',
    bgClass: 'bg-green-500',
    topics: [
      { id: 'ecologia', name: 'Ecologia', subjectId: 'biologia' },
      { id: 'citologia', name: 'Citologia', subjectId: 'biologia' },
      { id: 'fisiologia', name: 'Fisiologia Humana', subjectId: 'biologia' },
      { id: 'genetica', name: 'Genética', subjectId: 'biologia' },
      { id: 'evolucao', name: 'Evolução', subjectId: 'biologia' },
    ],
  },
  {
    id: 'fisica',
    name: 'Física',
    area: 'natureza',
    color: '#06b6d4',
    bgClass: 'bg-cyan-500',
    topics: [
      { id: 'mecanica', name: 'Mecânica', subjectId: 'fisica' },
      { id: 'eletricidade', name: 'Eletricidade', subjectId: 'fisica' },
      { id: 'ondas', name: 'Ondulatória', subjectId: 'fisica' },
      { id: 'termodinamica', name: 'Termodinâmica', subjectId: 'fisica' },
      { id: 'optica', name: 'Óptica', subjectId: 'fisica' },
    ],
  },
  {
    id: 'quimica',
    name: 'Química',
    area: 'natureza',
    color: '#f59e0b',
    bgClass: 'bg-amber-500',
    topics: [
      { id: 'quimica-geral', name: 'Química Geral', subjectId: 'quimica' },
      { id: 'fisico-quimica', name: 'Físico-Química', subjectId: 'quimica' },
      { id: 'quimica-organica', name: 'Química Orgânica', subjectId: 'quimica' },
      { id: 'estequiometria', name: 'Estequiometria', subjectId: 'quimica' },
    ],
  },
  {
    id: 'matematica',
    name: 'Matemática',
    area: 'matematica',
    color: '#ef4444',
    bgClass: 'bg-red-500',
    topics: [
      { id: 'razao-proporcao', name: 'Razão e Proporção', subjectId: 'matematica' },
      { id: 'porcentagem', name: 'Porcentagem', subjectId: 'matematica' },
      { id: 'geometria-plana', name: 'Geometria Plana', subjectId: 'matematica' },
      { id: 'geometria-espacial', name: 'Geometria Espacial', subjectId: 'matematica' },
      { id: 'estatistica', name: 'Estatística', subjectId: 'matematica' },
      { id: 'funcoes', name: 'Funções (1º e 2º grau)', subjectId: 'matematica' },
      { id: 'progressoes', name: 'Progressões (PA e PG)', subjectId: 'matematica' },
    ],
  },
]

export const AREA_LABELS: Record<string, string> = {
  linguagens: 'Linguagens',
  humanas: 'Ciências Humanas',
  natureza: 'Ciências da Natureza',
  matematica: 'Matemática',
}

export const AREA_COLORS: Record<string, string> = {
  linguagens: '#3b82f6',
  humanas: '#f97316',
  natureza: '#22c55e',
  matematica: '#ef4444',
}

export const AREA_BG: Record<string, string> = {
  linguagens: 'bg-blue-500',
  humanas: 'bg-orange-500',
  natureza: 'bg-green-500',
  matematica: 'bg-red-500',
}

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id)
}

export function getSubjectsByArea(area: string): Subject[] {
  return SUBJECTS.filter((s) => s.area === area)
}
