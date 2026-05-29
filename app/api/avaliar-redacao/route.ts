import { NextRequest } from 'next/server'

export const runtime = 'edge'

const SYSTEM_PROMPT = `Você é um corretor sênior do ENEM, conhecido por sua precisão técnica e seu feedback extremamente humano e incentivador.
Sua missão é avaliar a redação com rigor acadêmico, mas explicar os erros de forma que o aluno aprenda a não cometê-los novamente.
Seja específico: cite partes do texto do aluno no feedback.
O tom deve ser de um mentor que acredita no potencial do estudante.

IMPORTANTE: Você DEVE retornar APENAS um objeto JSON válido, sem markdown, sem código, sem explicações. Apenas o JSON puro.

Avalie com base nas 5 competências oficiais e retorne um objeto JSON com esta estrutura exata:
{
  "competency1": { "score": 160, "feedback": "Feedback aqui" },
  "competency2": { "score": 120, "feedback": "Feedback aqui" },
  "competency3": { "score": 80, "feedback": "Feedback aqui" },
  "competency4": { "score": 40, "feedback": "Feedback aqui" },
  "competency5": { "score": 200, "feedback": "Feedback aqui" },
  "totalScore": 600,
  "strengths": ["ponto forte 1", "ponto forte 2"],
  "improvements": ["melhoria 1", "melhoria 2", "melhoria 3"]
}

Regras:
- Pontuação por competência: 0, 40, 80, 120, 160 ou 200 pontos
- Nota máxima total: 1000 pontos
- Feedback deve ser concreto e citar partes do texto
- Use APENAS aspas duplas (") em todo o JSON
- NÃO use quebras de linha dentro dos valores de feedback
- Se precisar de quebra de linha no feedback, use espaço em branco normal`

const OPENAI_API = 'https://api.openai.com/v1/chat/completions'

/**
 * Extrai JSON de uma string que pode conter markdown, espaços, ou caracteres especiais
 * Usa uma estratégia de busca de chaves conhecidas para localizar o JSON válido
 */
function extractJsonFromResponse(text: string): string {
  // Tenta remover markdown fences primeiro
  let cleaned = text.trim()
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
  }

  // Tenta parse direto
  try {
    JSON.parse(cleaned)
    return cleaned
  } catch {
    // Estratégia 1: Encontrar o primeiro { e o último } e extrair tudo entre eles
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')
    
    if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
      const extracted = cleaned.substring(firstBrace, lastBrace + 1)
      try {
        JSON.parse(extracted)
        return extracted
      } catch {
        // Continua para próxima estratégia
      }
    }

    // Estratégia 2: Remover caracteres de controle problemáticos (mantendo espaços)
    let sanitized = cleaned
      .split('\n')
      .map(line => line.trim())
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/,\s+}/g, '}')
      .replace(/,\s+]/g, ']')

    try {
      JSON.parse(sanitized)
      return sanitized
    } catch {
      // Continua para próxima estratégia
    }

    // Estratégia 3: Escapar aspas duplas não escapadas dentro de strings
    // Procura por padrões como: "chave": "valor com "aspas" dentro"
    sanitized = cleaned.replace(/"([^"]*)":\s*"([^"]*)"([^,}\]]*)/g, (match, key, value, rest) => {
      // Escapa aspas dentro do valor
      const escapedValue = value.replace(/"/g, '\\"')
      return `"${key}": "${escapedValue}"${rest}`
    })

    try {
      JSON.parse(sanitized)
      return sanitized
    } catch {
      // Continua para próxima estratégia
    }

    // Estratégia 4: Remover tudo que não seja JSON válido
    // Mantém apenas caracteres que podem estar em JSON
    sanitized = cleaned
      .replace(/[\r\n\t]/g, ' ')
      .replace(/\s+/g, ' ')

    try {
      JSON.parse(sanitized)
      return sanitized
    } catch {
      // Se tudo falhar, retorna o original
      return cleaned
    }
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return Response.json({ error: 'OPENAI_API_KEY não configurada' }, { status: 503 })

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
    const res = await fetch(OPENAI_API, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `**Tema da Redação:** ${theme}\n\n**Texto do Aluno:**\n${text}`
          }
        ],
        temperature: 0.2,
        max_tokens: 2048,
        response_format: { type: 'json_object' }
      }),
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      const msg = (errBody as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`
      return Response.json({ error: `OpenAI: ${msg}` }, { status: 500 })
    }

    type OpenAIResponse = {
      choices?: { message?: { content?: string } }[]
    }
    const json = (await res.json()) as OpenAIResponse
    const raw = json.choices?.[0]?.message?.content ?? ''

    if (!raw) return Response.json({ error: 'Resposta vazia do OpenAI' }, { status: 500 })

    // Extrai JSON da resposta
    const jsonString = extractJsonFromResponse(raw)

    let feedback: Record<string, unknown>
    try {
      feedback = JSON.parse(jsonString) as Record<string, unknown>
    } catch (parseErr) {
      const parseErrMsg = parseErr instanceof Error ? parseErr.message : 'Erro ao parsear JSON'
      console.error('Raw response:', raw)
      console.error('Extracted JSON:', jsonString)
      console.error('Parse error:', parseErrMsg)
      return Response.json({ 
        error: `Falha ao processar resposta do OpenAI: ${parseErrMsg}`,
        debug: { raw: raw.substring(0, 500), extracted: jsonString.substring(0, 500) }
      }, { status: 500 })
    }

    // Validação básica da estrutura
    if (!feedback.competency1 || !feedback.totalScore) {
      return Response.json({ 
        error: 'Resposta do OpenAI não contém estrutura esperada',
        debug: { received: feedback }
      }, { status: 500 })
    }

    feedback.evaluatedAt = new Date().toISOString()
    feedback.model = 'gpt-4.1-mini'

    return Response.json({ feedback })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
