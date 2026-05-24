import { NextRequest } from 'next/server'

export const runtime = 'edge'

const SYSTEM_PROMPT = `Você é um corretor sênior do ENEM, conhecido por sua precisão técnica e seu feedback extremamente humano e incentivador.
Sua missão é avaliar a redação com rigor acadêmico, mas explicar os erros de forma que o aluno aprenda a não cometê-los novamente.
Seja específico: cite partes do texto do aluno no feedback.
O tom deve ser de um mentor que acredita no potencial do estudante.

Avalie com base nas 5 competências oficiais e retorne APENAS um objeto JSON válido, sem markdown ou texto extra.

Formato esperado:
{
  "competency1": { "score": <0|40|80|120|160|200>, "feedback": "<feedback específico citando o texto>" },
  "competency2": { "score": <0|40|80|120|160|200>, "feedback": "<feedback específico citando o texto>" },
  "competency3": { "score": <0|40|80|120|160|200>, "feedback": "<feedback específico citando o texto>" },
  "competency4": { "score": <0|40|80|120|160|200>, "feedback": "<feedback específico citando o texto>" },
  "competency5": { "score": <0|40|80|120|160|200>, "feedback": "<feedback específico citando o texto>" },
  "totalScore": <soma das 5 competências>,
  "strengths": ["<ponto forte concreto 1>", "<ponto forte concreto 2>"],
  "improvements": ["<melhoria acionável 1>", "<melhoria acionável 2>", "<melhoria acionável 3>"]
}

Pontuação por competência: 0, 40, 80, 120, 160 ou 200 pontos. Nota máxima total: 1000 pontos.`

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return Response.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 503 })

  let theme: string, text: string
  try {
    const body = await req.json() as { theme?: string; text?: string }
    theme = body.theme ?? ''
    text = body.text ?? ''
  } catch {
    return Response.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!theme || !text || text.trim().split(/\s+/).length < 50) {
    return Response.json({ error: 'Redação muito curta (mínimo 50 palavras)' }, { status: 400 })
  }

  try {
    const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{
          role: 'user',
          parts: [{ text: `**Tema da Redação:** ${theme}\n\n**Texto do Aluno:**\n${text}` }],
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
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

    const feedback = JSON.parse(raw) as Record<string, unknown>
    feedback.evaluatedAt = new Date().toISOString()
    feedback.model = 'gemini-3.5-flash'

    return Response.json({ feedback })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
