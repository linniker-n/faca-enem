import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const SYSTEM_PROMPT = `Você é um professor especialista em preparação para o ENEM.
Sua tarefa é criar materiais de estudo que ENSINAM o conteúdo, não apenas definem.
Um aluno que lê seu material deve sair sabendo o assunto, não apenas saber o que é.
Retorne APENAS JSON válido, sem markdown, sem texto fora do JSON.`

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get('topic')
  const subject = req.nextUrl.searchParams.get('subject') ?? ''
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) return Response.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 503 })
  if (!topic) return Response.json({ error: 'topic obrigatório' }, { status: 400 })

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    const prompt = `Crie um material de estudo completo sobre "${topic}"${subject ? ` (matéria: ${subject})` : ''} voltado para o ENEM.

Retorne exatamente este JSON (sem texto fora dele):
{
  "title": "nome do tópico formatado",
  "intro": "Introdução em 2-3 frases que explica o conceito de forma simples e direta.",
  "keyPoints": [
    "Ponto essencial 1 que o aluno deve memorizar",
    "Ponto essencial 2",
    "Ponto essencial 3",
    "Ponto essencial 4",
    "Ponto essencial 5"
  ],
  "sections": [
    {
      "title": "Título da seção principal (ex: Como funciona, Conceitos fundamentais, Regras principais)",
      "content": "Conteúdo educacional detalhado. Explique as regras, fórmulas, conceitos. Mínimo de 150 palavras. Use linguagem clara e didática. Separe parágrafos com linha em branco."
    },
    {
      "title": "Título da segunda seção (ex: Tipos e classificações, Aplicações, Exemplos)",
      "content": "Mais conteúdo detalhado com exemplos e explicações práticas. Mínimo de 100 palavras."
    }
  ],
  "enemContext": "Explique especificamente como o ENEM aborda este tema: quais aspectos mais cobrados, interdisciplinaridade, tipos de questão, contexto social/histórico/científico que costuma aparecer.",
  "studyTips": [
    "Dica prática de estudo 1",
    "Dica prática de estudo 2",
    "Dica de memorização ou revisão"
  ],
  "example": "Um exemplo prático, fórmula com explicação, ou descrição de uma questão típica do ENEM sobre este tema com a abordagem de resolução."
}`

    const result = await model.generateContent(prompt)
    const raw = result.response.text()

    // Extrai JSON mesmo se vier dentro de bloco markdown (```json ... ```)
    let jsonStr: string | null = null
    const mdMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (mdMatch) {
      jsonStr = mdMatch[1]
    } else {
      const objMatch = raw.match(/\{[\s\S]*\}/)
      if (objMatch) jsonStr = objMatch[0]
    }

    if (!jsonStr) return Response.json({ error: 'Resposta inválida da IA' }, { status: 500 })

    let content: unknown
    try {
      content = JSON.parse(jsonStr)
    } catch {
      // Tenta sanitizar o JSON antes de falhar
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
