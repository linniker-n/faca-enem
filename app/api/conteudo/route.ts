import { NextRequest } from 'next/server'

export const runtime = 'edge'

const SYSTEM_PROMPT = `Você é um professor experiente e apaixonado pela sua matéria, especialista em preparação para o ENEM.
Sua missão é ENSINAR de verdade: explique conceitos como se estivesse na lousa, use analogias, dê exemplos do cotidiano, antecipe as dúvidas do aluno e as responda.
O aluno deve sair da sua aula entendendo o assunto, não apenas sabendo que ele existe.
Use linguagem direta, clara e envolvente.
Retorne APENAS o objeto JSON solicitado, sem explicações extras ou blocos de markdown.`

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent'

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get('topic')
  const subject = req.nextUrl.searchParams.get('subject') ?? ''
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) return Response.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 503 })
  if (!topic) return Response.json({ error: 'topic obrigatório' }, { status: 400 })

  const prompt = `Prepare uma aula completa sobre "${topic}"${subject ? ` (matéria: ${subject})` : ''} para um aluno que vai fazer o ENEM.

Retorne exatamente este formato JSON:
{
  "title": "nome do tópico formatado",
  "intro": "Abertura da aula em 2-3 frases.",
  "keyPoints": ["Ponto 1", "Ponto 2", "Ponto 3", "Ponto 4", "Ponto 5"],
  "sections": [
    {
      "title": "Título da parte 1",
      "content": "Explicação aprofundada (mínimo 200 palavras)."
    },
    {
      "title": "Título da parte 2",
      "content": "Continuação da aula com exemplos práticos (mínimo 150 palavras)."
    }
  ],
  "enemContext": "Explicação de como o ENEM cobra este tema.",
  "studyTips": ["Dica 1", "Dica 2", "Dica 3"],
  "example": "Exemplo real de aplicação no ENEM."
}`

  try {
    const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
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
