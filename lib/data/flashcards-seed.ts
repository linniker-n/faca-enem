import type { Flashcard } from '../types'

function makeCard(id: string, subjectId: string, topicId: string, front: string, back: string): Flashcard {
  const today = new Date().toISOString().split('T')[0]
  return {
    id,
    userId: 'seed-user',
    subjectId,
    topicId,
    front,
    back,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: today,
    createdAt: new Date().toISOString(),
  }
}

export const SEED_FLASHCARDS: Flashcard[] = [
  makeCard('f1', 'matematica', 'porcentagem', 'Como calcular 15% de 200?', '15% de 200 = 200 × 0,15 = 30'),
  makeCard('f2', 'matematica', 'funcoes', 'O que é discriminante (Δ) de uma função quadrática?', 'Δ = b² – 4ac. Se Δ > 0: duas raízes reais distintas. Δ = 0: uma raiz real. Δ < 0: sem raízes reais.'),
  makeCard('f3', 'matematica', 'geometria-plana', 'Qual a área de um círculo?', 'A = π × r², onde r é o raio.'),
  makeCard('f4', 'matematica', 'estatistica', 'Diferença entre média, moda e mediana.', 'Média: soma ÷ total. Moda: valor mais frequente. Mediana: valor central da série ordenada.'),
  makeCard('f5', 'biologia', 'ecologia', 'O que é fotossíntese?', 'Processo pelo qual plantas, algas e cianobactérias convertem luz solar, CO₂ e H₂O em glicose e O₂. 6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂'),
  makeCard('f6', 'biologia', 'ecologia', 'O que são cadeias alimentares?', 'Sequências que mostram a transferência de energia entre organismos: Produtor → Consumidor primário → Consumidor secundário → Decompositor.'),
  makeCard('f7', 'biologia', 'citologia', 'Função do núcleo celular?', 'Controla todas as atividades celulares, armazena o material genético (DNA) e coordena a síntese de proteínas.'),
  makeCard('f8', 'biologia', 'genetica', 'O que é mitose vs meiose?', 'Mitose: divisão celular que produz 2 células geneticamente idênticas (2n). Meiose: produz 4 células haploides (n) — gametas.'),
  makeCard('f9', 'fisica', 'mecanica', 'Enuncie a 2ª Lei de Newton.', 'F = m × a. A força resultante sobre um objeto é igual ao produto de sua massa pela aceleração.'),
  makeCard('f10', 'fisica', 'eletricidade', 'O que é a Lei de Ohm?', 'V = R × I. A tensão (V) é igual ao produto da resistência (R) pela corrente elétrica (I).'),
  makeCard('f11', 'fisica', 'ondas', 'Como calcular o comprimento de onda?', 'λ = v / f. Onde v é a velocidade da onda (m/s) e f é a frequência (Hz).'),
  makeCard('f12', 'quimica', 'quimica-organica', 'O que são hidrocarbonetos?', 'Compostos orgânicos formados exclusivamente por carbono e hidrogênio. Ex.: metano (CH₄), eteno (C₂H₄).'),
  makeCard('f13', 'quimica', 'fisico-quimica', 'Defina pH e qual é o pH da água pura?', 'pH = -log[H⁺]. Indica a acidez/basicidade de uma solução. pH da água pura = 7 (neutro).'),
  makeCard('f14', 'historia', 'era-vargas', 'Quais foram as fases do governo Vargas?', '1930-1934: Governo provisório. 1934-1937: Governo constitucional. 1937-1945: Estado Novo (ditatorial). 1951-1954: Governo eleito.'),
  makeCard('f15', 'historia', 'brasil-colonial', 'O que foi o Ciclo do Ouro no Brasil?', 'Período (séc. XVIII) de intensa exploração de ouro em Minas Gerais, que deslocou o eixo econômico do Nordeste para o Sudeste e gerou cidades como Ouro Preto.'),
  makeCard('f16', 'historia', 'direitos-humanos', 'Em que ano foi criada a ONU e qual seu objetivo?', 'Criada em 1945, após a 2ª Guerra Mundial, para promover a paz, segurança internacional e cooperação entre nações.'),
  makeCard('f17', 'geografia', 'meio-ambiente', 'O que é o Protocolo de Kyoto?', 'Acordo internacional de 1997 que estabeleceu metas de redução de gases do efeito estufa para países industrializados.'),
  makeCard('f18', 'geografia', 'populacao', 'O que é transição demográfica?', 'Processo pelo qual países passam de altas taxas de natalidade e mortalidade para baixas taxas, com consequente envelhecimento da população.'),
  makeCard('f19', 'portugues', 'gramatica', 'Quais são as classes de palavras variáveis?', 'Substantivo, adjetivo, artigo, numeral, pronome e verbo. (São variáveis pois flexionam em gênero, número, grau, pessoa, tempo, etc.)'),
  makeCard('f20', 'portugues', 'interpretacao', 'O que é intertextualidade?', 'Relação entre textos, quando um texto faz referência, citação ou alusão a outro texto anterior. Pode ser explícita (citação direta) ou implícita (alusão).'),
  makeCard('f21', 'filosofia', 'filosofia-grega', 'O que é o imperativo categórico de Kant?', '"Age apenas segundo aquela máxima pela qual podes ao mesmo tempo querer que ela se torne lei universal." Princípio ético baseado na razão e no dever.'),
  makeCard('f22', 'sociologia', 'cultura', 'O que é etnocentrismo?', 'Tendência de julgar outras culturas com base nos valores e padrões da própria cultura, considerando-a superior.'),
  makeCard('f23', 'matematica', 'geometria-espacial', 'Qual o volume de um cubo de lado a?', 'V = a³. Ex.: um cubo de lado 3 cm tem volume = 27 cm³.'),
  makeCard('f24', 'biologia', 'fisiologia', 'Qual a função dos rins?', 'Filtram o sangue, eliminam resíduos metabólicos pela urina, regulam o equilíbrio hídrico e a pressão arterial (renina).'),
  makeCard('f25', 'quimica', 'quimica-geral', 'O que é uma reação de oxirredução?', 'Reação em que ocorre transferência de elétrons entre reagentes. O agente redutor cede elétrons (oxida); o agente oxidante recebe (reduz).'),
]
