import type { ProgressiveTopic } from '../types-encceja'

/**
 * Tópicos com progressão de dificuldade para Encceja Ensino Médio
 * Estruturados para levar o aluno do básico ao avançado
 */

export const ENCCEJA_PROGRESSIVE_TOPICS: ProgressiveTopic[] = [
  // ========== MATEMÁTICA ==========
  {
    id: 'mat-operacoes-basicas',
    name: 'Operações Básicas',
    subjectId: 'matematica-em',
    levels: {
      basico: {
        description: 'Adição, subtração, multiplicação e divisão com números naturais e decimais',
        keyPoints: [
          'Adição e subtração com números inteiros',
          'Multiplicação e divisão simples',
          'Operações com números decimais',
          'Ordem de operações (PEMDAS)',
        ],
        estimatedHours: 8,
      },
      intermediario: {
        description: 'Operações com frações e números racionais',
        keyPoints: [
          'Adição e subtração de frações',
          'Multiplicação e divisão de frações',
          'Conversão entre frações e decimais',
          'Comparação de números racionais',
        ],
        estimatedHours: 10,
      },
      avancado: {
        description: 'Operações com números irracionais e reais',
        keyPoints: [
          'Raízes quadradas e cúbicas',
          'Notação científica',
          'Operações com números em notação científica',
          'Propriedades dos números reais',
        ],
        estimatedHours: 8,
      },
    },
  },
  {
    id: 'mat-porcentagem',
    name: 'Porcentagem e Proporções',
    subjectId: 'matematica-em',
    levels: {
      basico: {
        description: 'Conceitos básicos de porcentagem',
        keyPoints: [
          'O que é porcentagem',
          'Cálculo de porcentagem simples',
          'Aplicações em descontos',
          'Aplicações em acréscimos',
        ],
        estimatedHours: 6,
      },
      intermediario: {
        description: 'Regra de três e proporções',
        keyPoints: [
          'Regra de três simples',
          'Regra de três composta',
          'Grandezas diretamente proporcionais',
          'Grandezas inversamente proporcionais',
        ],
        estimatedHours: 8,
      },
      avancado: {
        description: 'Juros simples e compostos',
        keyPoints: [
          'Juros simples',
          'Juros compostos',
          'Cálculo de montante',
          'Aplicações financeiras',
        ],
        estimatedHours: 8,
      },
    },
  },
  {
    id: 'mat-geometria-plana',
    name: 'Geometria Plana',
    subjectId: 'matematica-em',
    levels: {
      basico: {
        description: 'Figuras geométricas básicas e perímetro',
        keyPoints: [
          'Triângulos, quadrados e retângulos',
          'Cálculo de perímetro',
          'Propriedades básicas de polígonos',
          'Ângulos em figuras planas',
        ],
        estimatedHours: 8,
      },
      intermediario: {
        description: 'Áreas de figuras planas',
        keyPoints: [
          'Área de quadriláteros',
          'Área de triângulos',
          'Área de círculos',
          'Relação entre perímetro e área',
        ],
        estimatedHours: 10,
      },
      avancado: {
        description: 'Geometria analítica',
        keyPoints: [
          'Plano cartesiano',
          'Distância entre pontos',
          'Equação da reta',
          'Posição relativa de retas',
        ],
        estimatedHours: 10,
      },
    },
  },
  {
    id: 'mat-estatistica',
    name: 'Estatística e Gráficos',
    subjectId: 'matematica-em',
    levels: {
      basico: {
        description: 'Leitura e interpretação de gráficos simples',
        keyPoints: [
          'Gráficos de barras',
          'Gráficos de linhas',
          'Tabelas de dados',
          'Interpretação direta de informações',
        ],
        estimatedHours: 6,
      },
      intermediario: {
        description: 'Medidas de tendência central',
        keyPoints: [
          'Média aritmética',
          'Mediana',
          'Moda',
          'Amplitude e variância',
        ],
        estimatedHours: 8,
      },
      avancado: {
        description: 'Probabilidade e análise combinatória',
        keyPoints: [
          'Conceito de probabilidade',
          'Eventos simples e compostos',
          'Permutações e combinações',
          'Análise de dados estatísticos complexos',
        ],
        estimatedHours: 10,
      },
    },
  },

  // ========== LINGUAGENS ==========
  {
    id: 'ling-interpretacao',
    name: 'Interpretação de Texto',
    subjectId: 'portugues-em',
    levels: {
      basico: {
        description: 'Leitura e compreensão de textos simples',
        keyPoints: [
          'Identificação de ideia principal',
          'Informações explícitas no texto',
          'Diferença entre fato e opinião',
          'Vocabulário em contexto',
        ],
        estimatedHours: 8,
      },
      intermediario: {
        description: 'Análise de textos com camadas de significado',
        keyPoints: [
          'Inferências e conclusões',
          'Intenção do autor',
          'Contexto de produção',
          'Figuras de linguagem',
        ],
        estimatedHours: 10,
      },
      avancado: {
        description: 'Crítica textual e análise profunda',
        keyPoints: [
          'Análise de discurso',
          'Identificação de preconceitos',
          'Argumentação e persuasão',
          'Análise de textos multimodais',
        ],
        estimatedHours: 10,
      },
    },
  },
  {
    id: 'ling-generos-textuais',
    name: 'Gêneros Textuais',
    subjectId: 'portugues-em',
    levels: {
      basico: {
        description: 'Identificação de gêneros textuais comuns',
        keyPoints: [
          'Notícia',
          'Carta',
          'Anúncio',
          'Receita',
          'Características de cada gênero',
        ],
        estimatedHours: 6,
      },
      intermediario: {
        description: 'Estrutura e função de gêneros textuais',
        keyPoints: [
          'Crônica',
          'Conto',
          'Poema',
          'Artigo de opinião',
          'Função social de cada gênero',
        ],
        estimatedHours: 8,
      },
      avancado: {
        description: 'Produção de texto dissertativo-argumentativo',
        keyPoints: [
          'Estrutura da redação',
          'Introdução eficaz',
          'Desenvolvimento coerente',
          'Conclusão com proposta de intervenção',
        ],
        estimatedHours: 12,
      },
    },
  },
  {
    id: 'ling-lingua-estrangeira',
    name: 'Língua Inglesa',
    subjectId: 'ingles-em',
    levels: {
      basico: {
        description: 'Vocabulário e estruturas básicas',
        keyPoints: [
          'Saudações e apresentações',
          'Vocabulário cotidiano',
          'Presente simples',
          'Perguntas básicas',
        ],
        estimatedHours: 10,
      },
      intermediario: {
        description: 'Compreensão de textos em inglês',
        keyPoints: [
          'Leitura de textos simples',
          'Identificação de informações-chave',
          'Tempos verbais básicos',
          'Vocabulário temático',
        ],
        estimatedHours: 10,
      },
      avancado: {
        description: 'Análise crítica de textos em inglês',
        keyPoints: [
          'Compreensão de textos complexos',
          'Inferências em inglês',
          'Vocabulário acadêmico',
          'Análise de artigos e notícias',
        ],
        estimatedHours: 10,
      },
    },
  },

  // ========== CIÊNCIAS DA NATUREZA ==========
  {
    id: 'nat-ecologia',
    name: 'Ecologia',
    subjectId: 'biologia-em',
    levels: {
      basico: {
        description: 'Conceitos básicos de ecologia',
        keyPoints: [
          'Cadeias alimentares',
          'Teias alimentares',
          'Níveis tróficos',
          'Biomas brasileiros',
        ],
        estimatedHours: 8,
      },
      intermediario: {
        description: 'Ciclos biogeoquímicos',
        keyPoints: [
          'Ciclo do carbono',
          'Ciclo do nitrogênio',
          'Ciclo da água',
          'Impactos ambientais',
        ],
        estimatedHours: 10,
      },
      avancado: {
        description: 'Sustentabilidade e conservação',
        keyPoints: [
          'Desenvolvimento sustentável',
          'Energias renováveis',
          'Preservação de biomas',
          'Mudanças climáticas',
        ],
        estimatedHours: 10,
      },
    },
  },
  {
    id: 'nat-fisiologia-humana',
    name: 'Fisiologia Humana',
    subjectId: 'biologia-em',
    levels: {
      basico: {
        description: 'Sistemas do corpo humano básicos',
        keyPoints: [
          'Sistema digestório',
          'Sistema respiratório',
          'Sistema circulatório',
          'Funções básicas',
        ],
        estimatedHours: 10,
      },
      intermediario: {
        description: 'Funcionamento detalhado dos sistemas',
        keyPoints: [
          'Nutrição e absorção',
          'Trocas gasosas',
          'Transporte de sangue',
          'Homeostase',
        ],
        estimatedHours: 10,
      },
      avancado: {
        description: 'Saúde e doenças',
        keyPoints: [
          'Doenças infecciosas',
          'Doenças crônicas',
          'Sistema imunológico',
          'Prevenção e tratamento',
        ],
        estimatedHours: 10,
      },
    },
  },
  {
    id: 'nat-quimica-geral',
    name: 'Química Geral',
    subjectId: 'quimica-em',
    levels: {
      basico: {
        description: 'Conceitos fundamentais de química',
        keyPoints: [
          'Matéria e suas propriedades',
          'Estados físicos',
          'Mudanças de estado',
          'Elementos e compostos',
        ],
        estimatedHours: 8,
      },
      intermediario: {
        description: 'Tabela periódica e reações',
        keyPoints: [
          'Organização da tabela periódica',
          'Ligações químicas',
          'Reações químicas simples',
          'Balanceamento de equações',
        ],
        estimatedHours: 10,
      },
      avancado: {
        description: 'Química aplicada',
        keyPoints: [
          'Ácidos e bases',
          'Soluções e concentração',
          'Termoquímica',
          'Química ambiental',
        ],
        estimatedHours: 10,
      },
    },
  },
  {
    id: 'nat-fisica-mecanica',
    name: 'Física - Mecânica',
    subjectId: 'fisica-em',
    levels: {
      basico: {
        description: 'Movimento e força',
        keyPoints: [
          'Conceitos de velocidade e aceleração',
          'Primeira lei de Newton',
          'Força e massa',
          'Movimento uniforme',
        ],
        estimatedHours: 8,
      },
      intermediario: {
        description: 'Dinâmica e energia',
        keyPoints: [
          'Segunda lei de Newton',
          'Terceira lei de Newton',
          'Trabalho e energia',
          'Potência',
        ],
        estimatedHours: 10,
      },
      avancado: {
        description: 'Conservação e sistemas complexos',
        keyPoints: [
          'Conservação de energia',
          'Conservação de momento',
          'Colisões',
          'Rotação e torque',
        ],
        estimatedHours: 10,
      },
    },
  },

  // ========== CIÊNCIAS HUMANAS ==========
  {
    id: 'hum-cidadania',
    name: 'Cidadania e Direitos',
    subjectId: 'historia-em',
    levels: {
      basico: {
        description: 'Conceitos básicos de cidadania',
        keyPoints: [
          'O que é ser cidadão',
          'Direitos e deveres',
          'Declaração Universal dos Direitos Humanos',
          'Cidadania no Brasil',
        ],
        estimatedHours: 6,
      },
      intermediario: {
        description: 'Democracia e participação',
        keyPoints: [
          'Sistemas políticos',
          'Democracia e ditadura',
          'Eleições e voto',
          'Movimentos sociais',
        ],
        estimatedHours: 8,
      },
      avancado: {
        description: 'Política e transformação social',
        keyPoints: [
          'Estado e sociedade civil',
          'Políticas públicas',
          'Desigualdade social',
          'Justiça social',
        ],
        estimatedHours: 8,
      },
    },
  },
  {
    id: 'hum-historia-brasil',
    name: 'História do Brasil',
    subjectId: 'historia-em',
    levels: {
      basico: {
        description: 'Períodos principais da história brasileira',
        keyPoints: [
          'Brasil Colonial',
          'Brasil Império',
          'Proclamação da República',
          'República Velha',
        ],
        estimatedHours: 10,
      },
      intermediario: {
        description: 'Brasil Moderno',
        keyPoints: [
          'Era Vargas',
          'Desenvolvimentismo de JK',
          'Ditadura Militar',
          'Redemocratização',
        ],
        estimatedHours: 10,
      },
      avancado: {
        description: 'Brasil Contemporâneo',
        keyPoints: [
          'Constituição de 1988',
          'Política econômica',
          'Movimentos sociais contemporâneos',
          'Brasil no século XXI',
        ],
        estimatedHours: 8,
      },
    },
  },
  {
    id: 'hum-geografia-brasil',
    name: 'Geografia do Brasil',
    subjectId: 'geografia-em',
    levels: {
      basico: {
        description: 'Características físicas do Brasil',
        keyPoints: [
          'Regiões geográficas',
          'Clima e vegetação',
          'Rios e bacias hidrográficas',
          'Relevo',
        ],
        estimatedHours: 8,
      },
      intermediario: {
        description: 'Geografia humana e econômica',
        keyPoints: [
          'População e demografia',
          'Urbanização',
          'Economia regional',
          'Agricultura e pecuária',
        ],
        estimatedHours: 10,
      },
      avancado: {
        description: 'Questões ambientais e geopolítica',
        keyPoints: [
          'Desmatamento e preservação',
          'Recursos naturais',
          'Geopolítica da Amazônia',
          'Desenvolvimento sustentável',
        ],
        estimatedHours: 10,
      },
    },
  },
  {
    id: 'hum-filosofia',
    name: 'Filosofia',
    subjectId: 'filosofia-em',
    levels: {
      basico: {
        description: 'Introdução ao pensamento filosófico',
        keyPoints: [
          'O que é filosofia',
          'Grandes filósofos antigos',
          'Ética básica',
          'Lógica simples',
        ],
        estimatedHours: 6,
      },
      intermediario: {
        description: 'Filosofia moderna e política',
        keyPoints: [
          'Pensadores modernos',
          'Filosofia política',
          'Contrato social',
          'Liberdade e responsabilidade',
        ],
        estimatedHours: 8,
      },
      avancado: {
        description: 'Ética e filosofia contemporânea',
        keyPoints: [
          'Dilemas éticos',
          'Bioética',
          'Filosofia da tecnologia',
          'Pensamento crítico',
        ],
        estimatedHours: 8,
      },
    },
  },
]
