import { NextRequest } from 'next/server'

export const runtime = 'edge'

const SYSTEM_PROMPT = `Você é um professor lendário, especialista absoluto em preparação para o ENEM.
Sua voz é empática, entusiasmada e extremamente didática.
Você não apenas entrega informação; você constrói conhecimento.
Use analogias brilhantes, conecte o tema com a realidade do aluno e antecipe aquelas dúvidas que todo mundo tem.
Sua aula deve ser fluida, como se você estivesse conversando diretamente com o estudante, incentivando-o a cada parágrafo.
Retorne APENAS o JSON solicitado, mas com conteúdo rico e extenso dentro das strings.`

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent'

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get('topic')
  const subject = req.nextUrl.searchParams.get('subject') ?? ''
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) return Response.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 503 })
  if (!topic) return Response.json({ error: 'topic obrigatório' }, { status: 400 })

  const prompt = `Professor, prepare uma aula magistral sobre "${topic}"${subject ? ` da matéria de ${subject}` : ''}.

A aula deve seguir rigorosamente este formato JSON, mas o conteúdo deve ser profundo:

{
  "title": "Um título criativo e chamativo para a aula",
  "intro": "Uma introdução envolvente (3-4 frases) que mostre por que este tema é fascinante e essencial para o ENEM.",
  "keyPoints": [
    "Conceito fundamental 1 explicado de forma clara",
    "Conceito fundamental 2",
    "Conceito fundamental 3",
    "Conceito fundamental 4",
    "Conceito fundamental 5"
  ],
  "sections": [
    {
      "title": "Mergulhando no Conceito: [Subtítulo Criativo]",
      "content": "Aqui você deve dar um show de didática. Explique a base do tema, use uma analogia poderosa do dia a dia. Não economize nas palavras (mínimo 250 palavras). Divida bem as ideias em parágrafos usando '\\n\\n'."
    },
    {
      "title": "Aplicações e Desafios: [Subtítulo Criativo]",
      "content": "Como isso se manifesta no mundo real? Quais são os desdobramentos? Explique processos passo a passo. Seja o mentor que o aluno precisa para entender a complexidade do tema de forma simples (mínimo 200 palavras). Use '\\n\\n' para separar parágrafos."
    }
  ],
  "enemContext": "Análise cirúrgica: Como o ENEM cobra isso? Quais são as 'pegadinhas' clássicas? O que o aluno deve priorizar na hora da prova?",
  "studyTips": [
    "Dica de ouro para nunca mais esquecer",
    "Sugestão de como revisar este tema",
    "Conexão interdisciplinar"
  ],
  "example": "Descreva uma situação-problema típica do ENEM sobre este tema. Explique o raciocínio lógico necessário para chegar à resposta correta."
}`

  try {
    const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 8192,
          response_mime_type: 'application/json',
        },
      }),
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      const msg = (errBody as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`
      return Response.json({ error: `Gemini: ${msg}` }, { status: 500 })
    }

    type GeminiResponse = {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    }
    const json = (await res.json()) as GeminiResponse
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    if (!raw) return Response.json({ error: 'Resposta vazia do Gemini' }, { status: 500 })

    return Response.json({ content: JSON.parse(raw) })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
