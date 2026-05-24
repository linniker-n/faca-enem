import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

const SYSTEM_PROMPT = `Você é um corretor especializado em redações do ENEM. Avalie a redação com base nas 5 competências oficiais e retorne APENAS um JSON válido (sem markdown, sem texto fora do JSON) com o seguinte formato:

{
  "competency1": { "score": <0|40|80|120|160|200>, "feedback": "<texto>" },
  "competency2": { "score": <0|40|80|120|160|200>, "feedback": "<texto>" },
  "competency3": { "score": <0|40|80|120|160|200>, "feedback": "<texto>" },
  "competency4": { "score": <0|40|80|120|160|200>, "feedback": "<texto>" },
  "competency5": { "score": <0|40|80|120|160|200>, "feedback": "<texto>" },
  "totalScore": <soma das 5 competências>,
  "strengths": ["<ponto forte 1>", "<ponto forte 2>"],
  "improvements": ["<melhoria 1>", "<melhoria 2>", "<melhoria 3>"]
}

Critérios de avaliação:
- Competência I (Domínio da norma culta): Avalie gramática, ortografia, pontuação e sintaxe.
- Competência II (Compreensão da proposta): Avalie se o texto aborda o tema corretamente em estrutura dissertativo-argumentativa.
- Competência III (Organização das ideias): Avalie argumentação, progressão textual e coesão entre parágrafos.
- Competência IV (Coesão textual): Avalie conectivos, articuladores e mecanismos de coesão.
- Competência V (Proposta de intervenção): Avalie se há agente, ação, meio, finalidade e detalhamento, respeitando direitos humanos.

Pontuação por competência: 0, 40, 80, 120, 160 ou 200 pontos.
Nota máxima total: 1000 pontos.
Seja criterioso, justo e didático. O feedback deve ser específico e útil para o estudante melhorar.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 503 })
  }

  let theme: string, text: string
  try {
    const body = await req.json()
    theme = body.theme
    text = body.text
  } catch {
    return Response.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!theme || !text || text.trim().split(/\s+/).length < 50) {
    return Response.json({ error: 'Redação muito curta (mínimo 50 palavras)' }, { status: 400 })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    const result = await model.generateContent(
      `**Tema da Redação:** ${theme}\n\n**Texto do Aluno:**\n${text}`
    )
    const raw = result.response.text()

    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: 'Resposta inválida da IA' }, { status: 500 })
    }

    const feedback = JSON.parse(jsonMatch[0])
    feedback.evaluatedAt = new Date().toISOString()
    feedback.model = 'gemini-1.5-flash'

    return Response.json({ feedback })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
