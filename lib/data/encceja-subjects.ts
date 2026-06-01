import type { Subject } from '../types'

// ========== ENCCEJA ENSINO FUNDAMENTAL ==========
export const ENCCEJA_FUNDAMENTAL_SUBJECTS: Subject[] = [
  // Ciências Naturais
  {
    id: 'ciencias-naturais',
    name: 'Ciências Naturais',
    area: 'natureza',
    color: '#22c55e',
    bgClass: 'bg-green-500',
    topics: [
      { id: 'ciencia-atividade-humana', name: 'A Ciência como Atividade Humana', subjectId: 'ciencias-naturais' },
      { id: 'ciencia-tecnologia-riscos', name: 'Ciência e Tecnologia: Benefícios e Riscos', subjectId: 'ciencias-naturais' },
      { id: 'natureza-preservacao-vida', name: 'Compreender a Natureza e Preservar a Vida', subjectId: 'ciencias-naturais' },
      { id: 'saude-direito-cidadao', name: 'A Saúde é um Direito do Cidadão', subjectId: 'ciencias-naturais' },
      { id: 'corpo-respeito', name: 'Conhecendo e Respeitando o Próprio Corpo', subjectId: 'ciencias-naturais' },
    ],
  },
  // Matemática
  {
    id: 'matematica-ef',
    name: 'Matemática',
    area: 'matematica',
    color: '#ef4444',
    bgClass: 'bg-red-500',
    topics: [
      { id: 'arte-raciocinar', name: 'A Arte de Raciocinar', subjectId: 'matematica-ef' },
      { id: 'numeros-usos-significados', name: 'Os Números: Seus Usos e Significados', subjectId: 'matematica-ef' },
      { id: 'medidas-realidade', name: 'As Medidas e a Compreensão da Realidade', subjectId: 'matematica-ef' },
      { id: 'proporcionalidade', name: 'Proporcionalidade: Uma Ideia Fundamental', subjectId: 'matematica-ef' },
      { id: 'algebra-funcoes', name: 'A Álgebra: Suas Funções e Seus Usos', subjectId: 'matematica-ef' },
    ],
  },
  // Linguagens (Português, Inglês, Artes, Educação Física)
  {
    id: 'portugues-ef',
    name: 'Língua Portuguesa',
    area: 'linguagens',
    color: '#3b82f6',
    bgClass: 'bg-blue-500',
    topics: [
      { id: 'interligando-linguagens', name: 'Interligando as Linguagens', subjectId: 'portugues-ef' },
      { id: 'compreensao-linguas-estrangeiras', name: 'Compreendendo as Línguas Estrangeiras', subjectId: 'portugues-ef' },
      { id: 'corpo-sociedade', name: 'Corpo e Sociedade', subjectId: 'portugues-ef' },
      { id: 'arte-olhos-vida', name: 'Arte: Olhos para a Vida', subjectId: 'portugues-ef' },
      { id: 'ler-viver-texto', name: 'Ler e Viver o Texto Literário', subjectId: 'portugues-ef' },
    ],
  },
  {
    id: 'ingles-ef',
    name: 'Língua Inglesa',
    area: 'linguagens',
    color: '#6366f1',
    bgClass: 'bg-indigo-500',
    topics: [
      { id: 'compreensao-reading', name: 'Compreensão de Leitura', subjectId: 'ingles-ef' },
      { id: 'vocabulario-contexto', name: 'Vocabulário em Contexto', subjectId: 'ingles-ef' },
    ],
  },
  {
    id: 'artes-ef',
    name: 'Artes',
    area: 'linguagens',
    color: '#ec4899',
    bgClass: 'bg-pink-500',
    topics: [
      { id: 'arte-brasileira-ef', name: 'Arte Brasileira', subjectId: 'artes-ef' },
      { id: 'arte-contemporanea-ef', name: 'Arte Contemporânea', subjectId: 'artes-ef' },
    ],
  },
  // História e Geografia
  {
    id: 'historia-ef',
    name: 'História',
    area: 'humanas',
    color: '#f97316',
    bgClass: 'bg-orange-500',
    topics: [
      { id: 'confrontos-sociais-territorio', name: 'Confrontos Sociais e Território Nacional', subjectId: 'historia-ef' },
      { id: 'mudancas-espaco-geografico', name: 'Mudanças no Espaço Geográfico do Brasil', subjectId: 'historia-ef' },
      { id: 'valor-memoria', name: 'O Valor da Memória', subjectId: 'historia-ef' },
      { id: 'cidadania-democracia', name: 'Cidadania e Democracia', subjectId: 'historia-ef' },
      { id: 'movimentos-politicos-direitos', name: 'Movimentos Políticos pelos Direitos dos Índios', subjectId: 'historia-ef' },
    ],
  },
  {
    id: 'geografia-ef',
    name: 'Geografia',
    area: 'humanas',
    color: '#10b981',
    bgClass: 'bg-emerald-500',
    topics: [
      { id: 'populacao-ef', name: 'População', subjectId: 'geografia-ef' },
      { id: 'questao-agraria-ef', name: 'Questão Agrária', subjectId: 'geografia-ef' },
      { id: 'meio-ambiente-ef', name: 'Meio Ambiente', subjectId: 'geografia-ef' },
      { id: 'globalizacao-ef', name: 'Globalização', subjectId: 'geografia-ef' },
    ],
  },
]

// ========== ENCCEJA ENSINO MÉDIO ==========
export const ENCCEJA_MEDIO_SUBJECTS: Subject[] = [
  // Ciências da Natureza (Química, Física, Biologia)
  {
    id: 'quimica-em',
    name: 'Química',
    area: 'natureza',
    color: '#f59e0b',
    bgClass: 'bg-amber-500',
    topics: [
      { id: 'quimica-geral-em', name: 'Química Geral', subjectId: 'quimica-em' },
      { id: 'fisico-quimica-em', name: 'Físico-Química', subjectId: 'quimica-em' },
      { id: 'quimica-organica-em', name: 'Química Orgânica', subjectId: 'quimica-em' },
      { id: 'estequiometria-em', name: 'Estequiometria', subjectId: 'quimica-em' },
    ],
  },
  {
    id: 'fisica-em',
    name: 'Física',
    area: 'natureza',
    color: '#06b6d4',
    bgClass: 'bg-cyan-500',
    topics: [
      { id: 'mecanica-em', name: 'Mecânica', subjectId: 'fisica-em' },
      { id: 'eletricidade-em', name: 'Eletricidade', subjectId: 'fisica-em' },
      { id: 'ondas-em', name: 'Ondulatória', subjectId: 'fisica-em' },
      { id: 'termodinamica-em', name: 'Termodinâmica', subjectId: 'fisica-em' },
      { id: 'optica-em', name: 'Óptica', subjectId: 'fisica-em' },
    ],
  },
  {
    id: 'biologia-em',
    name: 'Biologia',
    area: 'natureza',
    color: '#22c55e',
    bgClass: 'bg-green-500',
    topics: [
      { id: 'ecologia-em', name: 'Ecologia', subjectId: 'biologia-em' },
      { id: 'citologia-em', name: 'Citologia', subjectId: 'biologia-em' },
      { id: 'fisiologia-em', name: 'Fisiologia Humana', subjectId: 'biologia-em' },
      { id: 'genetica-em', name: 'Genética', subjectId: 'biologia-em' },
      { id: 'evolucao-em', name: 'Evolução', subjectId: 'biologia-em' },
    ],
  },
  // Matemática
  {
    id: 'matematica-em',
    name: 'Matemática',
    area: 'matematica',
    color: '#ef4444',
    bgClass: 'bg-red-500',
    topics: [
      { id: 'matematica-construcao-humana', name: 'A Matemática: Uma Construção da Humanidade', subjectId: 'matematica-em' },
      { id: 'logica-argumentacao', name: 'Lógica e Argumentação', subjectId: 'matematica-em' },
      { id: 'convivendo-numeros', name: 'Convivendo com os Números', subjectId: 'matematica-em' },
      { id: 'realidade-formas', name: 'Nossa Realidade e as Formas que nos Rodeiam', subjectId: 'matematica-em' },
      { id: 'medidas-usos', name: 'Medidas e seus Usos', subjectId: 'matematica-em' },
    ],
  },
  // Linguagens
  {
    id: 'portugues-em',
    name: 'Língua Portuguesa',
    area: 'linguagens',
    color: '#3b82f6',
    bgClass: 'bg-blue-500',
    topics: [
      { id: 'publicidade-entretenimento', name: 'Publicidade, Entretenimento e Outros Sistemas', subjectId: 'portugues-em' },
      { id: 'linguas-estrangeiras-sociedade', name: 'As Línguas Estrangeiras Modernas em Nossa Sociedade', subjectId: 'portugues-em' },
      { id: 'corpo-volta', name: 'Quero o Meu Corpo de Volta!', subjectId: 'portugues-em' },
      { id: 'arte-cotidiano', name: 'A Arte no Cotidiano do Homem', subjectId: 'portugues-em' },
      { id: 'palavras-arte', name: 'Quando as Palavras Resolvem Fazer Arte', subjectId: 'portugues-em' },
    ],
  },
  {
    id: 'ingles-em',
    name: 'Língua Inglesa',
    area: 'linguagens',
    color: '#6366f1',
    bgClass: 'bg-indigo-500',
    topics: [
      { id: 'compreensao-leitora-em', name: 'Compreensão Leitora', subjectId: 'ingles-em' },
      { id: 'vocabulario-contexto-em', name: 'Vocabulário em Contexto', subjectId: 'ingles-em' },
    ],
  },
  {
    id: 'artes-em',
    name: 'Artes',
    area: 'linguagens',
    color: '#ec4899',
    bgClass: 'bg-pink-500',
    topics: [
      { id: 'arte-brasileira-em', name: 'Arte Brasileira', subjectId: 'artes-em' },
      { id: 'arte-contemporanea-em', name: 'Arte Contemporânea', subjectId: 'artes-em' },
      { id: 'patrimonio-cultural-em', name: 'Patrimônio Cultural', subjectId: 'artes-em' },
    ],
  },
  // Ciências Humanas
  {
    id: 'historia-em',
    name: 'História',
    area: 'humanas',
    color: '#f97316',
    bgClass: 'bg-orange-500',
    topics: [
      { id: 'cultura-memoria-identidade', name: 'Cultura, Memória e Identidade', subjectId: 'historia-em' },
      { id: 'construcao-territorio', name: 'A Construção do Território', subjectId: 'historia-em' },
      { id: 'natureza-humanidade', name: 'O que Estamos Fazendo com a Natureza?', subjectId: 'historia-em' },
      { id: 'estado-direito', name: 'Estado e Direito', subjectId: 'historia-em' },
      { id: 'cidadania-em', name: 'Cidadania', subjectId: 'historia-em' },
    ],
  },
  {
    id: 'geografia-em',
    name: 'Geografia',
    area: 'humanas',
    color: '#10b981',
    bgClass: 'bg-emerald-500',
    topics: [
      { id: 'populacao-em', name: 'População', subjectId: 'geografia-em' },
      { id: 'questao-agraria-em', name: 'Questão Agrária', subjectId: 'geografia-em' },
      { id: 'meio-ambiente-em', name: 'Meio Ambiente', subjectId: 'geografia-em' },
      { id: 'globalizacao-em', name: 'Globalização', subjectId: 'geografia-em' },
      { id: 'climatologia-em', name: 'Climatologia', subjectId: 'geografia-em' },
    ],
  },
  {
    id: 'filosofia-em',
    name: 'Filosofia',
    area: 'humanas',
    color: '#a78bfa',
    bgClass: 'bg-violet-400',
    topics: [
      { id: 'filosofia-grega-em', name: 'Filosofia Grega', subjectId: 'filosofia-em' },
      { id: 'filosofia-moderna-em', name: 'Filosofia Moderna', subjectId: 'filosofia-em' },
      { id: 'etica-politica-em', name: 'Ética e Política', subjectId: 'filosofia-em' },
    ],
  },
  {
    id: 'sociologia-em',
    name: 'Sociologia',
    area: 'humanas',
    color: '#fb923c',
    bgClass: 'bg-orange-400',
    topics: [
      { id: 'cultura-identidade-em', name: 'Cultura e Identidade', subjectId: 'sociologia-em' },
      { id: 'conflitos-sociais-em', name: 'Conflitos Sociais', subjectId: 'sociologia-em' },
      { id: 'ciencia-politica-em', name: 'Ciência Política', subjectId: 'sociologia-em' },
    ],
  },
]

export function getEncejaSubjects(educationLevel: 'fundamental' | 'medio'): Subject[] {
  return educationLevel === 'fundamental' ? ENCCEJA_FUNDAMENTAL_SUBJECTS : ENCCEJA_MEDIO_SUBJECTS
}
