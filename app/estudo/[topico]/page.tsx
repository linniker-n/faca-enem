'use client'

import { use, useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Play, Pause, RotateCcw, ExternalLink,
  Video, FileText, ClipboardList, CheckCircle,
  AlertCircle, Loader2, Search,
} from 'lucide-react'
import { SUBJECTS } from '@/lib/data/subjects'
import { getTopicContent, fetchWikipediaSummary } from '@/lib/data/content'
import { QUESTIONS } from '@/lib/data/questions'
import { storage } from '@/lib/storage'
import type { Question } from '@/lib/types'
import type { YTVideo } from '@/app/api/youtube/route'

type Tab = 'artigo' | 'video' | 'quiz'
type QuizPhase = 'idle' | 'running' | 'done'

interface WikiContent {
  title: string
  extract: string
  sections: { title: string; content: string }[]
  thumbnail?: string
  pageUrl: string
}

interface AIContent {
  title: string
  intro: string
  keyPoints: string[]
  sections: { title: string; content: string }[]
  enemContext: string
  studyTips: string[]
  example: string
}

// ── Cache de vídeos no localStorage (24h) ──────────────────────
const YT_CACHE_KEY = 'facenem:yt_cache'
const YT_TTL = 24 * 60 * 60 * 1000

// ── Cache de conteúdo IA no localStorage (7 dias) ──────────────
const AI_CACHE_KEY = 'facenem:ai_cache'
const AI_TTL = 7 * 24 * 60 * 60 * 1000

function getAICache(key: string): AIContent | null {
  try {
    const cache = JSON.parse(localStorage.getItem(AI_CACHE_KEY) ?? '{}')
    const entry = cache[key]
    if (entry && Date.now() - entry.at < AI_TTL) return entry.content
  } catch {}
  return null
}

function setAICache(key: string, content: AIContent) {
  try {
    const cache = JSON.parse(localStorage.getItem(AI_CACHE_KEY) ?? '{}')
    cache[key] = { content, at: Date.now() }
    localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cache))
  } catch {}
}

function getCachedVideos(query: string): YTVideo[] | null {
  try {
    const cache = JSON.parse(localStorage.getItem(YT_CACHE_KEY) ?? '{}')
    const entry = cache[query]
    if (entry && Date.now() - entry.at < YT_TTL) return entry.videos
  } catch {}
  return null
}

function setCachedVideos(query: string, videos: YTVideo[]) {
  try {
    const cache = JSON.parse(localStorage.getItem(YT_CACHE_KEY) ?? '{}')
    cache[query] = { videos, at: Date.now() }
    localStorage.setItem(YT_CACHE_KEY, JSON.stringify(cache))
  } catch {}
}

export default function EstudoTopico({ params }: { params: Promise<{ topico: string }> }) {
  const { topico } = use(params)

  const subject = SUBJECTS.find((s) => s.topics.some((t) => t.id === topico))
  const topic = subject?.topics.find((t) => t.id === topico)
  const content = getTopicContent(topico)

  const [activeTab, setActiveTab] = useState<Tab>('artigo')

  // Timer
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const targetMinutes = content?.estimatedMinutes ?? 20

  // Conteúdo IA (Gemini) — primário
  const [aiContent, setAiContent] = useState<AIContent | null>(null)
  const [aiLoading, setAiLoading] = useState(true)
  const [wikiAsFallback, setWikiAsFallback] = useState(false)

  // Wikipedia — fallback quando IA indisponível
  const [wiki, setWiki] = useState<WikiContent | null>(null)
  const [wikiIdx, setWikiIdx] = useState(0)
  const [wikiLoading, setWikiLoading] = useState(false)
  const [wikiError, setWikiError] = useState(false)

  // YouTube (dinâmico)
  const [ytVideos, setYtVideos] = useState<YTVideo[]>([])
  const [ytLoading, setYtLoading] = useState(false)
  const [ytError, setYtError] = useState('')
  const [ytNoKey, setYtNoKey] = useState(false)
  const [videoIdx, setVideoIdx] = useState(0)

  // Quiz
  const [quizPhase, setQuizPhase] = useState<QuizPhase>('idle')
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizDone, setQuizDone] = useState(false)

  // ── Busca conteúdo via Gemini (primário) ─────────────────────
  const fetchAIContent = useCallback(async () => {
    if (!topic) return
    const cached = getAICache(topico)
    if (cached) { setAiContent(cached); setAiLoading(false); return }

    setAiLoading(true)
    try {
      const res = await fetch(
        `/api/conteudo?topic=${encodeURIComponent(topic.name)}&subject=${encodeURIComponent(subject?.name ?? '')}`
      )
      if (res.status === 503) { setWikiAsFallback(true); return }
      const data = await res.json()
      if (data.content) {
        setAiContent(data.content)
        setAICache(topico, data.content)
      } else {
        setWikiAsFallback(true)
      }
    } catch {
      setWikiAsFallback(true)
    } finally {
      setAiLoading(false)
    }
  }, [topic, subject, topico])

  useEffect(() => { fetchAIContent() }, [fetchAIContent])

  // ── Busca Wikipedia (fallback quando IA indisponível) ─────────
  const fetchWiki = useCallback(async (idx: number) => {
    if (!content?.wikipedia.length) return
    const titles = content.wikipedia
    if (idx >= titles.length) { setWikiError(true); return }
    setWikiLoading(true)
    setWikiError(false)
    const result = await fetchWikipediaSummary(titles[idx])
    if (result) {
      setWiki(result)
    } else {
      fetchWiki(idx + 1)
      setWikiIdx(idx + 1)
    }
    setWikiLoading(false)
  }, [content])

  useEffect(() => { if (wikiAsFallback) fetchWiki(0) }, [wikiAsFallback, fetchWiki])

  // ── Busca YouTube via API route (com cache) ───────────────────
  const fetchVideos = useCallback(async () => {
    const query = content?.youtubeQuery ?? (topic?.name ? `${topic.name} aula ENEM` : '')
    if (!query) return

    // Tenta cache local primeiro
    const cached = getCachedVideos(query)
    if (cached && cached.length > 0) { setYtVideos(cached); return }

    setYtLoading(true)
    setYtError('')
    try {
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}&max=4`)
      const data = await res.json()

      if (data.error?.includes('não configurada')) {
        setYtNoKey(true)
      } else if (data.error) {
        setYtError(data.error)
      } else {
        setYtVideos(data.videos ?? [])
        if (data.videos?.length) setCachedVideos(query, data.videos)
      }
    } catch {
      setYtError('Falha ao buscar vídeos')
    }
    setYtLoading(false)
  }, [content, topic])

  useEffect(() => { fetchVideos() }, [fetchVideos])

  // ── Timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (running) timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    else if (timerRef.current) clearInterval(timerRef.current)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [running])

  function formatTime(s: number) {
    return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  }

  const targetSeconds = targetMinutes * 60
  const timerProgress = Math.min((seconds / targetSeconds) * 100, 100)
  const timerDone = seconds >= targetSeconds

  // ── Quiz ──────────────────────────────────────────────────────
  function startQuiz() {
    const qs = QUESTIONS.filter((q) => q.topicId === topico || q.subjectId === subject?.id)
      .sort(() => Math.random() - 0.5).slice(0, 5)
    if (!qs.length) return
    setQuizQuestions(qs)
    setQuizIdx(0); setQuizAnswers({}); setShowExplanation(false); setQuizDone(false)
    setQuizPhase('running'); setActiveTab('quiz')
  }

  function selectAnswer(questionId: string, idx: number) {
    if (quizAnswers[questionId] !== undefined) return
    setQuizAnswers((prev) => ({ ...prev, [questionId]: idx }))
    setShowExplanation(true)
  }

  function nextQuizQuestion() {
    if (quizIdx + 1 >= quizQuestions.length) {
      quizQuestions.forEach((q) => storage.recordCorrect(q.subjectId, quizAnswers[q.id] === q.correctIndex))
      storage.updateStreak()
      setQuizDone(true); setQuizPhase('done')
    } else {
      setQuizIdx((i) => i + 1); setShowExplanation(false)
    }
  }

  if (!subject || !topic) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
        <AlertCircle size={36} className="text-slate-600" />
        <p className="text-slate-400">Tópico não encontrado.</p>
        <Link href="/estudo" className="text-violet-400 hover:underline text-sm">← Voltar ao plano</Link>
      </div>
    )
  }

  const currentVideo = ytVideos[videoIdx]
  const LETTERS = ['A', 'B', 'C', 'D', 'E']
  const topicQuestions = QUESTIONS.filter((q) => q.topicId === topico || q.subjectId === subject.id)
  const youtubeQuery = content?.youtubeQuery ?? `${topic.name} aula ENEM`

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Topo fixo ─────────────────────────────────────────── */}
      <div className="shrink-0 bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center gap-4">
        <Link href="/estudo" className="text-slate-500 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: subject.color }} />
            <p className="text-xs text-slate-500 truncate">{subject.name}</p>
          </div>
          <p className="text-sm font-semibold text-white truncate">{topic.name}</p>
        </div>
        {/* Timer circular */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle cx="20" cy="20" r="16" fill="none"
                stroke={timerDone ? '#22c55e' : subject.color} strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - timerProgress / 100)}`}
                strokeLinecap="round" className="transition-all duration-1000"
              />
            </svg>
            <button onClick={() => setRunning((r) => !r)}
              className="absolute inset-0 flex items-center justify-center">
              {running ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white" />}
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm font-mono text-white">{formatTime(seconds)}</p>
            <p className="text-xs text-slate-500">{targetMinutes}min meta</p>
          </div>
          <button onClick={() => { setSeconds(0); setRunning(false) }} className="text-slate-600 hover:text-slate-400 transition">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Banner quiz após timer */}
      {timerDone && quizPhase === 'idle' && (
        <div className="shrink-0 bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-400" />
            <p className="text-sm text-emerald-300">Sessão concluída! Que tal testar o que aprendeu?</p>
          </div>
          <button onClick={startQuiz} disabled={topicQuestions.length === 0}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">
            Fazer quiz →
          </button>
        </div>
      )}

      {/* ── Tabs ──────────────────────────────────────────────── */}
      <div className="shrink-0 flex border-b border-slate-800 px-6">
        {([
          { key: 'artigo' as Tab, icon: FileText, label: 'Artigo' },
          { key: 'video' as Tab, icon: Video, label: ytVideos.length > 0 ? `Vídeos (${ytVideos.length})` : 'Vídeos' },
          { key: 'quiz' as Tab, icon: ClipboardList, label: `Quiz (${Math.min(topicQuestions.length, 5)})` },
        ]).map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => {
            setActiveTab(key)
            if (key === 'quiz' && quizPhase === 'idle') startQuiz()
          }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === key ? 'border-violet-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* ── Conteúdo ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* ARTIGO */}
        {activeTab === 'artigo' && (
          <div className="p-6 max-w-3xl mx-auto">

            {/* ── Carregando IA ───────────────────────────────── */}
            {aiLoading && (
              <div className="flex flex-col items-center gap-3 py-16 justify-center">
                <Loader2 size={24} className="animate-spin text-violet-400" />
                <p className="text-slate-400 text-sm">Gerando material de estudo com IA...</p>
              </div>
            )}

            {/* ── Conteúdo gerado por Gemini ──────────────────── */}
            {!aiLoading && aiContent && (
              <article className="fade-in space-y-5">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold text-white leading-snug">{aiContent.title}</h2>
                  <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2.5 py-1 rounded-full shrink-0 ml-3 mt-0.5">✦ IA</span>
                </div>

                {/* Introdução */}
                <p className="text-slate-300 text-sm leading-relaxed">{aiContent.intro}</p>

                {/* Pontos essenciais */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Pontos Essenciais para o ENEM</h3>
                  <ul className="space-y-2">
                    {aiContent.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-violet-400 font-bold shrink-0">{i + 1}.</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Seções de conteúdo */}
                {aiContent.sections.map((section, i) => (
                  <div key={i} className="border-t border-slate-800 pt-4">
                    <h3 className="text-sm font-semibold text-white mb-3">{section.title}</h3>
                    <div className="space-y-2">
                      {section.content.split('\n\n').filter((p) => p.trim()).map((p, j) => (
                        <p key={j} className="text-slate-300 text-sm leading-relaxed">{p.trim()}</p>
                      ))}
                    </div>
                  </div>
                ))}

                {/* No ENEM */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-amber-400 mb-2">Como cai no ENEM</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{aiContent.enemContext}</p>
                </div>

                {/* Exemplo */}
                {aiContent.example && (
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Exemplo Prático</h3>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{aiContent.example}</p>
                  </div>
                )}

                {/* Dicas de estudo */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-emerald-400 mb-2">Dicas de Estudo</h3>
                  <ul className="space-y-1.5">
                    {aiContent.studyTips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-emerald-400 shrink-0">→</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recuperação ativa */}
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                  <p className="text-xs text-violet-300 font-medium mb-1">Recuperação Ativa</p>
                  <p className="text-xs text-slate-400">Após ler, feche os olhos e resuma o conteúdo em voz alta. Depois teste na aba <strong className="text-slate-300">Quiz</strong>.</p>
                </div>
              </article>
            )}

            {/* ── Fallback Wikipedia ──────────────────────────── */}
            {!aiLoading && !aiContent && (
              <>
                {wikiLoading && (
                  <div className="flex items-center gap-3 py-12 justify-center">
                    <Loader2 size={20} className="animate-spin text-slate-500" />
                    <span className="text-slate-400 text-sm">Carregando artigo...</span>
                  </div>
                )}
                {wikiError && (
                  <div className="text-center py-12">
                    <AlertCircle size={32} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Conteúdo não encontrado.</p>
                    <a href={`https://pt.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(topic.name)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-violet-400 hover:underline text-sm mt-2 inline-flex items-center gap-1">
                      Buscar na Wikipedia <ExternalLink size={12} />
                    </a>
                  </div>
                )}
                {wiki && !wikiLoading && (
                  <article className="fade-in space-y-5">
                    {wiki.thumbnail && (
                      <img src={wiki.thumbnail} alt={wiki.title} className="w-full max-h-52 object-cover rounded-xl" />
                    )}
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-bold text-white leading-snug">{wiki.title}</h2>
                      <a href={wiki.pageUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition shrink-0 ml-3 mt-1">
                        Wikipedia <ExternalLink size={11} />
                      </a>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm">{wiki.extract}</p>
                    {wiki.sections.map((section, i) => (
                      <div key={i} className="border-t border-slate-800 pt-4">
                        <h3 className="text-sm font-semibold text-white mb-2">{section.title}</h3>
                        <div className="space-y-2">
                          {section.content.split('\n\n').filter((p) => p.trim()).map((p, j) => (
                            <p key={j} className="text-slate-300 text-sm leading-relaxed">{p.trim()}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                      <p className="text-xs text-violet-300 font-medium mb-1">Recuperação Ativa</p>
                      <p className="text-xs text-slate-400">Após ler, feche os olhos e resuma o conteúdo. Depois, teste na aba <strong className="text-slate-300">Quiz</strong>.</p>
                    </div>
                  </article>
                )}
              </>
            )}
          </div>
        )}

        {/* VÍDEO */}
        {activeTab === 'video' && (
          <div className="p-6 max-w-3xl mx-auto">
            {/* Sem chave configurada */}
            {ytNoKey && (
              <div className="text-center py-8">
                <Video size={36} className="text-slate-700 mx-auto mb-3" />
                <p className="text-white font-medium mb-1">YouTube API não configurada</p>
                <p className="text-slate-400 text-sm mb-5">
                  Adicione <code className="bg-slate-800 px-1.5 py-0.5 rounded text-violet-300">YOUTUBE_API_KEY</code> no arquivo <code className="bg-slate-800 px-1.5 py-0.5 rounded text-violet-300">.env.local</code> para buscar vídeos automaticamente.
                </p>
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQuery)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
                  <Search size={15} /> Buscar no YouTube
                </a>
              </div>
            )}

            {/* Carregando */}
            {ytLoading && !ytNoKey && (
              <div className="flex items-center gap-3 py-12 justify-center">
                <Loader2 size={20} className="animate-spin text-red-400" />
                <span className="text-slate-400 text-sm">Buscando vídeos relevantes...</span>
              </div>
            )}

            {/* Erro */}
            {ytError && !ytNoKey && !ytLoading && (
              <div className="text-center py-8">
                <AlertCircle size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-4">{ytError}</p>
                <button onClick={fetchVideos} className="text-sm text-violet-400 hover:underline">Tentar novamente</button>
              </div>
            )}

            {/* Vídeos encontrados */}
            {!ytLoading && !ytNoKey && ytVideos.length > 0 && (
              <div className="fade-in">
                {/* Player */}
                <div className="relative bg-black rounded-2xl overflow-hidden mb-4" style={{ paddingBottom: '56.25%' }}>
                  <iframe key={currentVideo.id}
                    src={`https://www.youtube-nocookie.com/embed/${currentVideo.id}?rel=0&modestbranding=1`}
                    title={currentVideo.title} className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Info do vídeo atual */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-medium text-white leading-snug">{currentVideo.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{currentVideo.channel}</p>
                  </div>
                  <a href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition shrink-0 ml-3">
                    <ExternalLink size={12} /> YouTube
                  </a>
                </div>

                {/* Thumbnail grid */}
                {ytVideos.length > 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {ytVideos.map((v, i) => (
                      <button key={v.id} onClick={() => setVideoIdx(i)}
                        className={`relative rounded-lg overflow-hidden border-2 transition ${videoIdx === i ? 'border-red-500' : 'border-transparent hover:border-slate-600'}`}>
                        <img src={v.thumbnail} alt={v.title} className="w-full aspect-video object-cover" />
                        {videoIdx === i && (
                          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                            <Play size={20} className="text-white" />
                          </div>
                        )}
                        <p className="absolute bottom-0 left-0 right-0 text-xs text-white bg-black/60 px-1.5 py-1 truncate">{v.title}</p>
                      </button>
                    ))}
                  </div>
                )}

                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQuery)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition">
                  <Search size={14} /> Buscar mais vídeos sobre {topic.name} <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        )}

        {/* QUIZ */}
        {activeTab === 'quiz' && (
          <div className="p-6 max-w-2xl mx-auto">
            {topicQuestions.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList size={36} className="text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Sem questões para este tópico.</p>
                <Link href="/simulado" className="text-violet-400 hover:underline text-sm mt-2 inline-block">Ver simulado geral →</Link>
              </div>
            ) : quizPhase === 'idle' ? (
              <div className="text-center py-12">
                <ClipboardList size={36} className="text-emerald-500 mx-auto mb-4" />
                <p className="text-white font-medium mb-1">Quiz sobre {topic.name}</p>
                <p className="text-slate-400 text-sm mb-6">{Math.min(topicQuestions.length, 5)} questões selecionadas</p>
                <button onClick={startQuiz} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition">
                  Iniciar Quiz
                </button>
              </div>
            ) : quizDone ? (
              (() => {
                const correct = quizQuestions.filter((q) => quizAnswers[q.id] === q.correctIndex).length
                const pct = Math.round((correct / quizQuestions.length) * 100)
                return (
                  <div className="text-center py-8 fade-in">
                    <div className={`text-5xl font-bold mb-2 ${pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</div>
                    <p className="text-slate-400 mb-6">{correct}/{quizQuestions.length} corretas</p>
                    <div className="flex flex-col gap-2 mb-6 text-left">
                      {quizQuestions.map((q) => {
                        const ok = quizAnswers[q.id] === q.correctIndex
                        return (
                          <div key={q.id} className={`flex items-start gap-3 p-3 rounded-xl ${ok ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                            {ok ? <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />}
                            <div>
                              <p className="text-xs text-slate-300">{q.text.slice(0, 80)}...</p>
                              {!ok && <p className="text-xs text-slate-500 mt-1">Correta: {LETTERS[q.correctIndex]}</p>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button onClick={startQuiz} className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-lg text-sm transition">Refazer</button>
                      <Link href="/estudo" className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg text-sm transition">Próximo tópico</Link>
                    </div>
                  </div>
                )
              })()
            ) : (() => {
              const q = quizQuestions[quizIdx]
              const selected = quizAnswers[q.id]
              return (
                <div className="fade-in">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${((quizIdx + 1) / quizQuestions.length) * 100}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{quizIdx + 1}/{quizQuestions.length}</span>
                  </div>
                  <p className="text-white leading-relaxed mb-5">{q.text}</p>
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt, idx) => {
                      const isSelected = selected === idx
                      const isCorrect = idx === q.correctIndex
                      let cls = 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600'
                      if (selected !== undefined) {
                        if (isCorrect) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        else if (isSelected) cls = 'border-red-500 bg-red-500/10 text-red-300'
                        else cls = 'border-slate-800 bg-slate-900/40 text-slate-600 opacity-50'
                      }
                      return (
                        <button key={idx} onClick={() => selectAnswer(q.id, idx)} disabled={selected !== undefined}
                          className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition text-sm ${cls}`}>
                          <span className="font-bold shrink-0 text-xs mt-0.5">{LETTERS[idx]}</span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                  {showExplanation && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-4 fade-in">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Explicação</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                  {selected !== undefined && (
                    <button onClick={nextQuizQuestion} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition">
                      {quizIdx + 1 >= quizQuestions.length ? 'Ver resultado' : 'Próxima'}
                    </button>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
