// Mapa de conteúdo por tópico: Wikipedia + YouTube (embed + busca)
// YouTube embed é gratuito sem API — apenas iframe com video ID público
// Wikipedia REST API é gratuita sem chave

export interface TopicContent {
  topicId: string
  subjectId: string
  // Wikipedia: título exato do artigo em pt.wikipedia.org
  wikipedia: string[]
  // YouTube: ID de vídeo específico (embed gratuito) + query de busca (fallback)
  videos: YoutubeVideo[]
  youtubeQuery: string // abre busca no YouTube caso embed falhe
  estimatedMinutes: number
}

export interface YoutubeVideo {
  id: string
  title: string
  channel: string
}

export const TOPIC_CONTENT: Record<string, TopicContent> = {
  // ─── MATEMÁTICA ───────────────────────────────────────────────
  porcentagem: {
    topicId: 'porcentagem',
    subjectId: 'matematica',
    wikipedia: ['Porcentagem', 'Regra de três'],
    videos: [
      { id: 'Ca0fkSHqJKU', title: 'Porcentagem - Conceitos Básicos', channel: 'Professor Ferretto' },
      { id: 'oTEkIz6SFy0', title: 'Porcentagem para o ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'porcentagem aula ENEM matemática',
    estimatedMinutes: 20,
  },
  funcoes: {
    topicId: 'funcoes',
    subjectId: 'matematica',
    wikipedia: ['Função (matemática)', 'Função quadrática'],
    videos: [
      { id: 'bG0FWmjpvCs', title: 'Função do 1º Grau', channel: 'Professor Ferretto' },
      { id: 'Mq46NMQHWWU', title: 'Função do 2º Grau - Parabola', channel: 'Me Salva!' },
    ],
    youtubeQuery: 'funções 1 e 2 grau ENEM vestibular',
    estimatedMinutes: 25,
  },
  'geometria-plana': {
    topicId: 'geometria-plana',
    subjectId: 'matematica',
    wikipedia: ['Geometria plana', 'Área'],
    videos: [
      { id: 'WfGLCMJjXlE', title: 'Geometria Plana - Áreas', channel: 'Professor Ferretto' },
      { id: 'f6FpIDRoMhU', title: 'Geometria para o ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'geometria plana área perímetro ENEM',
    estimatedMinutes: 25,
  },
  'geometria-espacial': {
    topicId: 'geometria-espacial',
    subjectId: 'matematica',
    wikipedia: ['Geometria espacial', 'Sólido geométrico'],
    videos: [
      { id: 'rXXj2S9DNXE', title: 'Geometria Espacial ENEM', channel: 'Professor Ferretto' },
    ],
    youtubeQuery: 'geometria espacial volume ENEM vestibular',
    estimatedMinutes: 25,
  },
  estatistica: {
    topicId: 'estatistica',
    subjectId: 'matematica',
    wikipedia: ['Estatística', 'Média aritmética', 'Mediana'],
    videos: [
      { id: 'IORGOFcJxoU', title: 'Estatística - Média, Moda e Mediana', channel: 'Me Salva!' },
    ],
    youtubeQuery: 'estatística média moda mediana ENEM',
    estimatedMinutes: 20,
  },
  'razao-proporcao': {
    topicId: 'razao-proporcao',
    subjectId: 'matematica',
    wikipedia: ['Razão e proporção', 'Regra de três'],
    videos: [
      { id: 'Qz5k2J5OiBc', title: 'Razão e Proporção ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'razão proporção regra de três ENEM',
    estimatedMinutes: 20,
  },
  progressoes: {
    topicId: 'progressoes',
    subjectId: 'matematica',
    wikipedia: ['Progressão aritmética', 'Progressão geométrica'],
    videos: [
      { id: 'YMFjFGBAfHM', title: 'PA - Progressão Aritmética', channel: 'Professor Ferretto' },
    ],
    youtubeQuery: 'progressão aritmética geométrica PA PG ENEM',
    estimatedMinutes: 20,
  },

  // ─── BIOLOGIA ───────────────────────────────────────────────
  ecologia: {
    topicId: 'ecologia',
    subjectId: 'biologia',
    wikipedia: ['Ecologia', 'Cadeia alimentar', 'Ciclo biogeoquímico'],
    videos: [
      { id: 'XhDqmrK1xoM', title: 'Ecologia - Cadeias e Teia Alimentar', channel: 'Biologia com Samuel Cunha' },
      { id: 'aY4JGnZHVFE', title: 'Ecologia para o ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'ecologia cadeia alimentar ENEM biologia',
    estimatedMinutes: 20,
  },
  citologia: {
    topicId: 'citologia',
    subjectId: 'biologia',
    wikipedia: ['Célula', 'Organela', 'Mitocôndria'],
    videos: [
      { id: 'RY_X5LIBxGc', title: 'Citologia - Estrutura Celular', channel: 'Biologia com Samuel Cunha' },
    ],
    youtubeQuery: 'citologia célula organelas ENEM biologia',
    estimatedMinutes: 20,
  },
  fisiologia: {
    topicId: 'fisiologia',
    subjectId: 'biologia',
    wikipedia: ['Sistema circulatório', 'Sistema digestivo', 'Fisiologia humana'],
    videos: [
      { id: 'ONoQPKSrOPM', title: 'Fisiologia Humana - Sistemas', channel: 'Descomplica' },
    ],
    youtubeQuery: 'fisiologia humana sistemas ENEM biologia',
    estimatedMinutes: 25,
  },
  genetica: {
    topicId: 'genetica',
    subjectId: 'biologia',
    wikipedia: ['Genética', 'Lei de Mendel', 'DNA'],
    videos: [
      { id: 'yd-1klQi1tE', title: 'Genética - Leis de Mendel', channel: 'Biologia com Samuel Cunha' },
    ],
    youtubeQuery: 'genética leis Mendel ENEM biologia',
    estimatedMinutes: 25,
  },
  evolucao: {
    topicId: 'evolucao',
    subjectId: 'biologia',
    wikipedia: ['Evolução biológica', 'Teoria da evolução', 'Charles Darwin'],
    videos: [
      { id: 'bQ3UXM0FQMU', title: 'Evolução - Darwin e Lamarck', channel: 'Descomplica' },
    ],
    youtubeQuery: 'evolução Darwin biologia ENEM',
    estimatedMinutes: 20,
  },

  // ─── FÍSICA ───────────────────────────────────────────────
  mecanica: {
    topicId: 'mecanica',
    subjectId: 'fisica',
    wikipedia: ['Mecânica clássica', 'Leis de Newton', 'Energia potencial'],
    videos: [
      { id: 'yZlMX47rkOc', title: 'Leis de Newton - Física', channel: 'Me Salva!' },
      { id: 'PUhMpIlfrXQ', title: 'Trabalho e Energia', channel: 'Descomplica' },
    ],
    youtubeQuery: 'mecânica leis Newton energia trabalho ENEM física',
    estimatedMinutes: 25,
  },
  eletricidade: {
    topicId: 'eletricidade',
    subjectId: 'fisica',
    wikipedia: ['Circuito elétrico', 'Lei de Ohm', 'Corrente elétrica'],
    videos: [
      { id: 'qLhEjkDEkQI', title: 'Eletricidade - Lei de Ohm', channel: 'Me Salva!' },
    ],
    youtubeQuery: 'eletricidade lei ohm circuitos ENEM física',
    estimatedMinutes: 20,
  },
  ondas: {
    topicId: 'ondas',
    subjectId: 'fisica',
    wikipedia: ['Onda', 'Ondulatória', 'Som'],
    videos: [
      { id: 'Zbc0lTJq5hE', title: 'Ondulatória - Ondas Mecânicas', channel: 'Me Salva!' },
    ],
    youtubeQuery: 'ondulatória ondas som luz ENEM física',
    estimatedMinutes: 20,
  },
  termodinamica: {
    topicId: 'termodinamica',
    subjectId: 'fisica',
    wikipedia: ['Termodinâmica', 'Leis da termodinâmica', 'Máquina térmica'],
    videos: [
      { id: 'KmF3r1y-XCk', title: 'Termodinâmica para o ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'termodinâmica máquina térmica rendimento ENEM',
    estimatedMinutes: 20,
  },
  optica: {
    topicId: 'optica',
    subjectId: 'fisica',
    wikipedia: ['Óptica', 'Reflexão da luz', 'Refração'],
    videos: [
      { id: 'A3N2gRFSHxQ', title: 'Óptica Geométrica ENEM', channel: 'Me Salva!' },
    ],
    youtubeQuery: 'óptica geométrica reflexão refração ENEM',
    estimatedMinutes: 20,
  },

  // ─── QUÍMICA ───────────────────────────────────────────────
  'quimica-geral': {
    topicId: 'quimica-geral',
    subjectId: 'quimica',
    wikipedia: ['Tabela periódica', 'Ligação química', 'Átomo'],
    videos: [
      { id: 'M5sMmZFBzQY', title: 'Tabela Periódica - Química', channel: 'Descomplica' },
    ],
    youtubeQuery: 'química geral tabela periódica ENEM',
    estimatedMinutes: 20,
  },
  'fisico-quimica': {
    topicId: 'fisico-quimica',
    subjectId: 'quimica',
    wikipedia: ['Estequiometria', 'Termoquímica', 'pH'],
    videos: [
      { id: 'hU-7b-E_WBo', title: 'Estequiometria ENEM', channel: 'Me Salva!' },
      { id: 'kVx2cIrUSmk', title: 'pH e pOH - Química', channel: 'Descomplica' },
    ],
    youtubeQuery: 'estequiometria termoquímica pH ENEM química',
    estimatedMinutes: 25,
  },
  'quimica-organica': {
    topicId: 'quimica-organica',
    subjectId: 'quimica',
    wikipedia: ['Química orgânica', 'Hidrocarboneto', 'Função orgânica'],
    videos: [
      { id: 'eZQHKhxRQhI', title: 'Química Orgânica - Funções', channel: 'Me Salva!' },
    ],
    youtubeQuery: 'química orgânica funções hidrocarbonetos ENEM',
    estimatedMinutes: 25,
  },
  estequiometria: {
    topicId: 'estequiometria',
    subjectId: 'quimica',
    wikipedia: ['Estequiometria', 'Mol', 'Reação química'],
    videos: [
      { id: 'hU-7b-E_WBo', title: 'Estequiometria - Cálculos', channel: 'Me Salva!' },
    ],
    youtubeQuery: 'estequiometria cálculos mol ENEM química',
    estimatedMinutes: 25,
  },

  // ─── HISTÓRIA ───────────────────────────────────────────────
  'brasil-colonial': {
    topicId: 'brasil-colonial',
    subjectId: 'historia',
    wikipedia: ['Brasil Colonial', 'Capitanias hereditárias', 'Escravidão no Brasil'],
    videos: [
      { id: 'wl_VFfgRJqU', title: 'Brasil Colonial ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'brasil colonial período colonial ENEM história',
    estimatedMinutes: 20,
  },
  'era-vargas': {
    topicId: 'era-vargas',
    subjectId: 'historia',
    wikipedia: ['Era Vargas', 'Estado Novo', 'Getúlio Vargas'],
    videos: [
      { id: 'NR_YKhN4Vp0', title: 'Era Vargas e Estado Novo', channel: 'Descomplica' },
    ],
    youtubeQuery: 'era Vargas estado novo ditadura ENEM história',
    estimatedMinutes: 20,
  },
  'brasil-imperial': {
    topicId: 'brasil-imperial',
    subjectId: 'historia',
    wikipedia: ['Império do Brasil', 'Dom Pedro II', 'Abolição da escravatura'],
    videos: [
      { id: 'tDFXHc4XHZQ', title: 'Brasil Império ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'brasil império Dom Pedro II abolição ENEM história',
    estimatedMinutes: 20,
  },
  'idade-moderna': {
    topicId: 'idade-moderna',
    subjectId: 'historia',
    wikipedia: ['Idade Moderna', 'Renascimento', 'Reforma Protestante'],
    videos: [
      { id: 'JBIqz_kV4W4', title: 'Idade Moderna ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'idade moderna renascimento reforma protestante ENEM',
    estimatedMinutes: 20,
  },
  'idade-contemporanea': {
    topicId: 'idade-contemporanea',
    subjectId: 'historia',
    wikipedia: ['Revolução Francesa', 'Revolução Industrial', 'Guerra Fria'],
    videos: [
      { id: 'SgWLivbsV_k', title: 'Revolução Francesa e Industrial ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'revolução francesa industrial guerra fria ENEM história',
    estimatedMinutes: 20,
  },
  'direitos-humanos': {
    topicId: 'direitos-humanos',
    subjectId: 'historia',
    wikipedia: ['Direitos humanos', 'Declaração Universal dos Direitos Humanos', 'ONU'],
    videos: [
      { id: '7aDOkVlvObg', title: 'Direitos Humanos ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'direitos humanos ONU ENEM história',
    estimatedMinutes: 15,
  },

  // ─── GEOGRAFIA ───────────────────────────────────────────────
  'meio-ambiente': {
    topicId: 'meio-ambiente',
    subjectId: 'geografia',
    wikipedia: ['Meio ambiente', 'Aquecimento global', 'Efeito estufa'],
    videos: [
      { id: 'VpOEqkXAqMI', title: 'Meio Ambiente e Questões Ambientais ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'meio ambiente aquecimento global efeito estufa ENEM',
    estimatedMinutes: 20,
  },
  globalizacao: {
    topicId: 'globalizacao',
    subjectId: 'geografia',
    wikipedia: ['Globalização', 'Neoliberalismo', 'Geopolítica'],
    videos: [
      { id: 'kFjCq4TFZYM', title: 'Globalização ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'globalização geopolítica ENEM geografia',
    estimatedMinutes: 20,
  },
  populacao: {
    topicId: 'populacao',
    subjectId: 'geografia',
    wikipedia: ['Transição demográfica', 'Densidade demográfica', 'Migração'],
    videos: [
      { id: 'U7NYKK5HKZY', title: 'População e Migração ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'população migração transição demográfica ENEM geografia',
    estimatedMinutes: 20,
  },
  agraria: {
    topicId: 'agraria',
    subjectId: 'geografia',
    wikipedia: ['Reforma agrária no Brasil', 'MST', 'Agronegócio'],
    videos: [
      { id: 'RFqBxP_e4bY', title: 'Questão Agrária ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'questão agrária reforma agrária MST ENEM',
    estimatedMinutes: 20,
  },
  climatologia: {
    topicId: 'climatologia',
    subjectId: 'geografia',
    wikipedia: ['Climatologia', 'Clima', 'El Niño'],
    videos: [
      { id: 'hcXijZY2q9Y', title: 'Climatologia e Climas ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'climatologia climas do brasil ENEM geografia',
    estimatedMinutes: 20,
  },

  // ─── PORTUGUÊS ───────────────────────────────────────────────
  gramatica: {
    topicId: 'gramatica',
    subjectId: 'portugues',
    wikipedia: ['Gramática', 'Sintaxe', 'Morfologia'],
    videos: [
      { id: 'uJf-kFbUMoc', title: 'Gramática para o ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'gramática sintaxe morfologia ENEM português',
    estimatedMinutes: 20,
  },
  interpretacao: {
    topicId: 'interpretacao',
    subjectId: 'portugues',
    wikipedia: ['Interpretação textual', 'Coesão textual', 'Coerência'],
    videos: [
      { id: 'G0fGobxqvck', title: 'Interpretação de Texto ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'interpretação de texto ENEM português dicas',
    estimatedMinutes: 20,
  },
  'generos-textuais': {
    topicId: 'generos-textuais',
    subjectId: 'portugues',
    wikipedia: ['Gênero textual', 'Gênero discursivo', 'Texto dissertativo'],
    videos: [
      { id: 'MCFZ6MBSK8I', title: 'Gêneros Textuais ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'gêneros textuais tipos de texto ENEM',
    estimatedMinutes: 15,
  },
  'literatura-brasileira': {
    topicId: 'literatura-brasileira',
    subjectId: 'portugues',
    wikipedia: ['Literatura brasileira', 'Modernismo no Brasil', 'Realismo no Brasil'],
    videos: [
      { id: 'gChT8sQUgMs', title: 'Literatura Brasileira - Modernismo ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'literatura brasileira modernismo ENEM vestibular',
    estimatedMinutes: 25,
  },
  'variedades-linguisticas': {
    topicId: 'variedades-linguisticas',
    subjectId: 'portugues',
    wikipedia: ['Variação linguística', 'Dialeto', 'Norma culta'],
    videos: [
      { id: 'bME-o0e1F3o', title: 'Variação Linguística ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'variação linguística norma culta ENEM português',
    estimatedMinutes: 15,
  },

  // ─── FILOSOFIA ───────────────────────────────────────────────
  'filosofia-grega': {
    topicId: 'filosofia-grega',
    subjectId: 'filosofia',
    wikipedia: ['Filosofia grega', 'Sócrates', 'Platão', 'Aristóteles'],
    videos: [
      { id: 'YBkNSKEVH48', title: 'Filosofia Grega ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'filosofia grega Sócrates Platão Aristóteles ENEM',
    estimatedMinutes: 20,
  },
  'filosofia-moderna': {
    topicId: 'filosofia-moderna',
    subjectId: 'filosofia',
    wikipedia: ['Filosofia moderna', 'René Descartes', 'Immanuel Kant', 'Iluminismo'],
    videos: [
      { id: 'bBCnVzl6LsA', title: 'Filosofia Moderna ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'filosofia moderna Descartes Kant Iluminismo ENEM',
    estimatedMinutes: 20,
  },
  etica: {
    topicId: 'etica',
    subjectId: 'filosofia',
    wikipedia: ['Ética', 'Moral', 'Política'],
    videos: [
      { id: 'HFzFqk-s9yo', title: 'Ética e Política ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'ética política filosofia ENEM',
    estimatedMinutes: 15,
  },

  // ─── SOCIOLOGIA ───────────────────────────────────────────────
  cultura: {
    topicId: 'cultura',
    subjectId: 'sociologia',
    wikipedia: ['Cultura', 'Identidade cultural', 'Etnocentrismo'],
    videos: [
      { id: 'maCi-NmGBYA', title: 'Cultura e Identidade ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'cultura identidade etnocentrismo sociologia ENEM',
    estimatedMinutes: 15,
  },
  'conflitos-sociais': {
    topicId: 'conflitos-sociais',
    subjectId: 'sociologia',
    wikipedia: ['Desigualdade social', 'Movimentos sociais', 'Racismo estrutural'],
    videos: [
      { id: 'gHPLJOAFR6g', title: 'Conflitos Sociais e Desigualdade ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'conflitos sociais desigualdade movimentos sociais ENEM',
    estimatedMinutes: 15,
  },
  'ciencia-politica': {
    topicId: 'ciencia-politica',
    subjectId: 'sociologia',
    wikipedia: ['Ciência política', 'Democracia', 'Estado'],
    videos: [
      { id: 'PJBpbvX4AVY', title: 'Ciência Política e Estado ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'ciência política democracia estado ENEM sociologia',
    estimatedMinutes: 15,
  },

  // ─── INGLÊS ───────────────────────────────────────────────
  'compreensao-leitora': {
    topicId: 'compreensao-leitora',
    subjectId: 'ingles',
    wikipedia: ['Língua inglesa', 'Reading comprehension'],
    videos: [
      { id: 'EVCxhSdKj58', title: 'Inglês para o ENEM - Leitura', channel: 'Descomplica' },
    ],
    youtubeQuery: 'inglês ENEM leitura compreensão vestibular',
    estimatedMinutes: 20,
  },
  vocabulario: {
    topicId: 'vocabulario',
    subjectId: 'ingles',
    wikipedia: ['Vocabulário', 'False cognate'],
    videos: [
      { id: 'VnKYV-V8T50', title: 'Vocabulário Inglês ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'vocabulário inglês ENEM falsos cognatos',
    estimatedMinutes: 15,
  },

  // ─── ARTES ───────────────────────────────────────────────
  'arte-brasileira': {
    topicId: 'arte-brasileira',
    subjectId: 'artes',
    wikipedia: ['Arte no Brasil', 'Semana de Arte Moderna', 'Tarsila do Amaral'],
    videos: [
      { id: 'GBOmSt1MlN8', title: 'Arte Brasileira ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'arte brasileira modernismo semana arte moderna ENEM',
    estimatedMinutes: 15,
  },
  'arte-contemporanea': {
    topicId: 'arte-contemporanea',
    subjectId: 'artes',
    wikipedia: ['Arte contemporânea', 'Arte moderna'],
    videos: [
      { id: 'nPBQ0i_Ykso', title: 'Arte Contemporânea ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'arte contemporânea moderna ENEM',
    estimatedMinutes: 15,
  },
  'patrimonio-cultural': {
    topicId: 'patrimonio-cultural',
    subjectId: 'artes',
    wikipedia: ['Patrimônio cultural', 'UNESCO', 'Patrimônio histórico'],
    videos: [
      { id: 'RQXBMTV1X20', title: 'Patrimônio Cultural ENEM', channel: 'Descomplica' },
    ],
    youtubeQuery: 'patrimônio cultural material imaterial UNESCO ENEM',
    estimatedMinutes: 15,
  },
}

export function getTopicContent(topicId: string): TopicContent | null {
  return TOPIC_CONTENT[topicId] ?? null
}

// Busca resumo da Wikipedia PT — usa apenas /page/summary que suporta CORS
// /page/mobile-sections bloqueia CORS em produção, por isso não é usado aqui
export async function fetchWikipediaSummary(articleTitle: string): Promise<{
  title: string
  extract: string
  sections: { title: string; content: string }[]
  thumbnail?: string
  pageUrl: string
} | null> {
  try {
    const encoded = encodeURIComponent(articleTitle)
    const res = await fetch(
      `https://pt.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
      { headers: { Accept: 'application/json' } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title,
      extract: data.extract ?? '',
      sections: [], // seções disponíveis apenas via proxy server-side
      thumbnail: data.thumbnail?.source,
      pageUrl: data.content_urls?.desktop?.page ?? `https://pt.wikipedia.org/wiki/${encoded}`,
    }
  } catch {
    return null
  }
}
