export interface EssayTheme {
  id: string
  title: string
  year?: number
  motivatingTexts: string[]
  tips: string[]
}

export const ESSAY_THEMES: EssayTheme[] = [
  {
    id: 'et1',
    title: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
    year: 2022,
    motivatingTexts: [
      'No Brasil, povos e comunidades tradicionais — quilombolas, indígenas, ribeirinhos, pescadores artesanais, entre outros — enfrentam sérias ameaças à sua existência cultural e territorial.',
      '"As populações tradicionais são as guardiãs da diversidade biológica e cultural do planeta." — Ailton Krenak, Ideias para Adiar o Fim do Mundo.',
      'Dados do IBGE (2022) apontam que apenas 12,5% das terras indígenas no Brasil estão completamente demarcadas.',
    ],
    tips: [
      'Defina "comunidades tradicionais" no início da dissertação.',
      'Aborde aspectos culturais, territoriais e de políticas públicas.',
      'A proposta de intervenção deve incluir: agente (poder público/ONGs), ação (demarcação, políticas de preservação), meio, finalidade e detalhamento.',
    ],
  },
  {
    id: 'et2',
    title: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
    year: 2021,
    motivatingTexts: [
      'O registro civil de nascimento é um direito fundamental garantido pela Constituição Federal de 1988 e pela Convenção Internacional sobre os Direitos da Criança.',
      'Cerca de 1% dos nascidos vivos no Brasil ainda não são registrados, concentrando-se principalmente em populações vulneráveis.',
      '"Sem documentos, o indivíduo é juridicamente invisível." — Hannah Arendt, Origens do Totalitarismo.',
    ],
    tips: [
      'Relacione registro civil ao acesso a serviços públicos, saúde e educação.',
      'Cite grupos mais afetados: populações rurais, indígenas, negros.',
      'Proponha ação concreta com os cinco elementos exigidos pelo ENEM.',
    ],
  },
  {
    id: 'et3',
    title: 'O estigma associado às doenças mentais na sociedade brasileira',
    year: 2019,
    motivatingTexts: [
      'A OMS estima que 1 em cada 4 pessoas no mundo será afetada por algum transtorno mental ao longo da vida.',
      '"Estigma é uma marca social que desqualifica o indivíduo perante a comunidade." — Erving Goffman, Estigma.',
      'Pesquisas mostram que o estigma é uma das principais barreiras para a busca de tratamento psiquiátrico no Brasil.',
    ],
    tips: [
      'Explore o preconceito histórico com a loucura (hospitais psiquiátricos).',
      'Mencione a Lei da Reforma Psiquiátrica (10.216/2001).',
      'Proponha campanhas de conscientização e ampliação do CAPS.',
    ],
  },
  {
    id: 'et4',
    title: 'Democratização do acesso ao cinema no Brasil',
    year: 2018,
    motivatingTexts: [
      'O Brasil possui uma das maiores indústrias cinematográficas da América Latina, mas o acesso ao cinema ainda é desigual.',
      'Dados do IBGE indicam que apenas 14% dos brasileiros frequentam cinemas regularmente, concentrados nas classes A e B.',
      '"A cultura é direito de todos, não privilégio de poucos." — Mário de Andrade.',
    ],
    tips: [
      'Aborde desigualdade regional e econômica no acesso à cultura.',
      'Mencione políticas como o Programa Cinema Perto de Você.',
      'Proponha ação com foco em escolas públicas e salas itinerantes.',
    ],
  },
  {
    id: 'et5',
    title: 'A manipulação do comportamento do usuário pelo controle de dados na internet',
    year: 2017,
    motivatingTexts: [
      'O escândalo Cambridge Analytica revelou como dados de milhões de usuários foram usados para influenciar eleições.',
      '"Quem controla a informação, controla o poder." — George Orwell, 1984.',
      'No Brasil, a Lei Geral de Proteção de Dados (LGPD) entrou em vigor em 2020.',
    ],
    tips: [
      'Relacione filtro-bolha, câmaras de eco e democracia.',
      'Aborde a LGPD e a necessidade de regulação.',
      'Inclua reflexão sobre autonomia do usuário e letramento digital.',
    ],
  },
  {
    id: 'et6',
    title: 'Caminhos para combater a intolerância religiosa no Brasil',
    year: 2016,
    motivatingTexts: [
      'A Constituição Federal de 1988 garante a liberdade de consciência e de crença como direito fundamental.',
      'Pesquisas mostram crescimento de casos de intolerância religiosa, especialmente contra religiões de matriz africana.',
      '"A diversidade religiosa é uma riqueza, não uma ameaça." — Leonardo Boff.',
    ],
    tips: [
      'Diferencie intolerância religiosa de crítica legítima à religião.',
      'Citar o Estatuto da Igualdade Racial fortalece o argumento.',
      'Proponha educação intercultural nas escolas públicas.',
    ],
  },
  {
    id: 'et7',
    title: 'Os impactos da solidão no indivíduo contemporâneo',
    year: 2024,
    motivatingTexts: [
      'A OMS declarou a solidão uma epidemia global em 2023, com impactos equivalentes ao tabagismo na saúde.',
      '"O homem é um animal social." — Aristóteles, Política.',
      'Pesquisas indicam que o uso excessivo de redes sociais paradoxalmente aumenta o sentimento de solidão.',
    ],
    tips: [
      'Diferencie solidão (estado emocional) de isolamento (condição física).',
      'Aborde vulneráveis: idosos, jovens, trabalhadores remotos.',
      'Proponha políticas de saúde mental e espaços comunitários.',
    ],
  },
  {
    id: 'et8',
    title: 'Desafios no combate ao racismo estrutural no Brasil',
    motivatingTexts: [
      '"O racismo estrutural é uma decorrência da própria estrutura social." — Silvio Almeida, Racismo Estrutural.',
      'Negros representam mais de 75% das vítimas de homicídio no Brasil, segundo o Atlas da Violência.',
      'A Lei 10.639/2003 tornou obrigatório o ensino de história e cultura afro-brasileira nas escolas.',
    ],
    tips: [
      'Diferencie racismo individual, institucional e estrutural.',
      'Use dados do IBGE sobre desigualdade racial no mercado de trabalho.',
      'Proponha ação afirmativa concreta com os cinco elementos do ENEM.',
    ],
  },
]
