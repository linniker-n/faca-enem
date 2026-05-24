import { NextRequest } from 'next/server'

export const runtime = 'edge'

const SYSTEM_PROMPT = `Você é um professor experiente e apaixonado pela sua matéria, especialista em preparação para o ENEM.
Sua missão é ENSINAR de verdade: explique conceitos como se estivesse na lousa, use analogias, dê exemplos do cotidiano, antecipe as dúvidas do aluno e as responda.
Não defina — ensine. Não liste — explique. O aluno deve sair da sua aula entendendo o assunto, não apenas sabendo que ele existe.
Use linguagem direta, clara e envolvente, como um professor que quer que o aluno aprenda de verdade.
Retorne APENAS JSON válido, sem markdown, sem texto fora do JSON.`

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get('topic')
  const subject = req.nextUrl.searchParams.get('subject') ?? ''
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) return Response.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 503 })
  if (!topic) return Response.json({ error: 'topic obrigatório' }, { status: 400 })

  const prompt = `Prepare uma aula completa sobre "${topic}"${subject ? ` (matéria: ${subject})` : ''} para um aluno que vai fazer o ENEM.

Aja como um professor na frente da turma: explique os conceitos passo a passo, use analogias do dia a dia, antecipe dúvidas comuns e as responda dentro do texto. Não apenas defina — ensine.

Retorne exatamente este JSON (sem texto fora dele):
{
  "title": "nome do tópico formatado",
  "intro": "Abertura da aula em 2-3 frases que desperta a curiosidade e situa o aluno no tema, como um professor que começa explicando por que aquilo importa.",
  "keyPoints": [
    "Ideia central 1 que o aluno deve gravar (explique brevemente, não só nomeie)",
    "Ideia central 2",
    "Ideia central 3",
    "Ideia central 4",
    "Ideia central 5"
  ],
  "sections": [
    {
      "title": "Título da primeira parte da aula (ex: Como funciona na prática, Entendendo os conceitos, O que você precisa saber)",
      "content": "Explicação aprofundada como um professor ensinando: use analogias, exemplos concretos, quebre o conceito em partes simples. Mínimo de 200 palavras. Separe parágrafos com linha em branco."
    },
    {
      "title": "Título da segunda parte (ex: Exemplos e aplicações, Por que isso acontece, Como resolver na prova)",
      "content": "Continue a aula com exemplos práticos, raciocínio passo a passo, e conexões com o mundo real. Mínimo de 150 palavras."
    }
  ],
  "enemContext": "Como professor, explique o que o ENEM realmente cobra neste tema: aspectos mais frequentes, como as questões são formuladas, quais armadilhas os alunos costumam cair, e o contexto (social, histórico, científico) que costuma aparecer.",
  "studyTips": [
    "Dica prática de fixação do conteúdo",
    "Como revisar este tema de forma eficiente",
    "Técnica de memorização ou conexão com outros temas"
  ],
  "example": "Um exemplo real de como este tema aparece no ENEM: descreva a situação-problema típica, o raciocínio necessário para resolver e a resposta. Se houver fórmula, explique cada parte dela."
}`

  try {
    const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
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

    // Extrai JSON mesmo se vier dentro de bloco markdown (```json ... ```)
    let jsonStr: string | null = null
    const mdMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (mdMatch) {
      jsonStr = mdMatch[1]
    } else {
      const objMatch = raw.match(/\{[\s\S]*\}/)
      if (objMatch) jsonStr = objMatch[0]
    }

    if (!jsonStr) return Response.json({ error: 'JSON não encontrado na resposta da IA' }, { status: 500 })

    let content: unknown
    try {
      content = JSON.parse(jsonStr)
    } catch {
      const sanitized = jsonStr.replace(/[\x00-\x1F\x7F]/g, ' ')
      try {
        content = JSON.parse(sanitized)
      } catch {
        return Response.json({ error: 'JSON inválido na resposta da IA' }, { status: 500 })
      }
    }

    return Response.json({ content })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
