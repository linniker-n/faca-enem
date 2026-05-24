'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Plus, RotateCcw, ThumbsUp, ThumbsDown, Minus, BookOpen, X } from 'lucide-react'
import { storage } from '@/lib/storage'
import { sm2Review, isDueToday, newCard } from '@/lib/sm2'
import { SUBJECTS } from '@/lib/data/subjects'
import { SEED_FLASHCARDS } from '@/lib/data/flashcards-seed'
import type { Flashcard } from '@/lib/types'

type Mode = 'home' | 'review' | 'create'

function genId() {
  return 'u_' + Math.random().toString(36).slice(2)
}

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [mode, setMode] = useState<Mode>('home')
  const [loaded, setLoaded] = useState(false)

  // Review state
  const [reviewQueue, setReviewQueue] = useState<Flashcard[]>([])
  const [reviewIdx, setReviewIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [reviewDone, setReviewDone] = useState(false)
  const [reviewStats, setReviewStats] = useState({ easy: 0, good: 0, hard: 0 })

  // Create state
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [subjectId, setSubjectId] = useState(SUBJECTS[0].id)
  const [topicId, setTopicId] = useState(SUBJECTS[0].topics[0].id)

  useEffect(() => {
    let saved = storage.getFlashcards()
    if (saved.length === 0) {
      saved = SEED_FLASHCARDS
      storage.saveFlashcards(saved)
    }
    setCards(saved)
    setLoaded(true)
  }, [])

  function saveCards(updated: Flashcard[]) {
    setCards(updated)
    storage.saveFlashcards(updated)
  }

  function startReview(all = false) {
    const due = all ? cards : cards.filter(isDueToday)
    if (due.length === 0) return
    setReviewQueue([...due].sort(() => Math.random() - 0.5))
    setReviewIdx(0)
    setFlipped(false)
    setReviewDone(false)
    setReviewStats({ easy: 0, good: 0, hard: 0 })
    setMode('review')
  }

  function rateCard(quality: number) {
    const card = reviewQueue[reviewIdx]
    const updated = sm2Review(card, quality)
    const newCards = cards.map((c) => (c.id === card.id ? updated : c))
    saveCards(newCards)

    const label = quality >= 4 ? 'easy' : quality >= 3 ? 'good' : 'hard'
    setReviewStats((s) => ({ ...s, [label]: s[label as keyof typeof s] + 1 }))

    if (reviewIdx + 1 >= reviewQueue.length) {
      setReviewDone(true)
    } else {
      setReviewIdx((i) => i + 1)
      setFlipped(false)
    }
  }

  function createCard() {
    if (!front.trim() || !back.trim()) return
    const card = newCard({ id: genId(), front: front.trim(), back: back.trim(), subjectId, topicId })
    saveCards([...cards, card])
    setFront('')
    setBack('')
    setMode('home')
  }

  function deleteCard(id: string) {
    saveCards(cards.filter((c) => c.id !== id))
  }

  const validCards = cards.filter((c) => c.front?.trim() && c.back?.trim())
  const dueCards = validCards.filter(isDueToday)
  const selectedSubject = SUBJECTS.find((s) => s.id === subjectId)!

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Review mode
  if (mode === 'review') {
    if (reviewDone) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center fade-in">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mb-4">
            <ThumbsUp size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Revisão concluída!</h2>
          <p className="text-slate-400 mb-6">{reviewQueue.length} card{reviewQueue.length > 1 ? 's' : ''} revisado{reviewQueue.length > 1 ? 's' : ''}</p>
          <div className="flex gap-6 mb-8">
            <div className="text-center"><p className="text-2xl font-bold text-emerald-400">{reviewStats.easy}</p><p className="text-xs text-slate-500">Fácil</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-blue-400">{reviewStats.good}</p><p className="text-xs text-slate-500">Bom</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-red-400">{reviewStats.hard}</p><p className="text-xs text-slate-500">Difícil</p></div>
          </div>
          <button onClick={() => setMode('home')} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg font-medium transition">
            Voltar
          </button>
        </div>
      )
    }

    const card = reviewQueue[reviewIdx]
    const subject = SUBJECTS.find((s) => s.id === card.subjectId)

    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6 fade-in">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setMode('home')} className="text-slate-500 hover:text-white transition">
              <X size={20} />
            </button>
            <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full">
              <div
                className="h-full bg-violet-600 rounded-full transition-all"
                style={{ width: `${((reviewIdx) / reviewQueue.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-slate-400">{reviewIdx + 1}/{reviewQueue.length}</span>
          </div>

          {/* Card */}
          <div
            className="cursor-pointer"
            style={{ perspective: '1000px', height: '300px' }}
            onClick={() => !flipped && setFlipped(true)}
          >
            <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`} style={{ height: '300px' }}>
              {/* Front */}
              <div className="flashcard-front bg-slate-900 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center">
                {subject && (
                  <span className="text-xs px-2.5 py-1 rounded-full mb-4 font-medium" style={{ background: subject.color + '20', color: subject.color }}>
                    {subject.name}
                  </span>
                )}
                <p className="text-xl font-medium text-white text-center leading-relaxed">{card.front}</p>
                {!flipped && <p className="text-slate-600 text-sm mt-4">Clique para revelar</p>}
              </div>
              {/* Back */}
              <div className="flashcard-back bg-slate-800 border border-violet-500/30 rounded-2xl p-8 flex flex-col items-center justify-center">
                <p className="text-sm text-slate-400 uppercase tracking-wide mb-4">Resposta</p>
                <p className="text-lg text-white text-center leading-relaxed">{card.back}</p>
              </div>
            </div>
          </div>

          {/* Botões de avaliação */}
          {flipped && (
            <div className="flex gap-3 mt-6 fade-in">
              <button
                onClick={() => rateCard(1)}
                className="flex-1 flex flex-col items-center gap-1 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition text-red-400"
              >
                <ThumbsDown size={20} />
                <span className="text-xs">Difícil</span>
                <span className="text-xs text-slate-600">+1 dia</span>
              </button>
              <button
                onClick={() => rateCard(3)}
                className="flex-1 flex flex-col items-center gap-1 py-3 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl transition text-blue-400"
              >
                <Minus size={20} />
                <span className="text-xs">Bom</span>
                <span className="text-xs text-slate-600">alguns dias</span>
              </button>
              <button
                onClick={() => rateCard(5)}
                className="flex-1 flex flex-col items-center gap-1 py-3 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl transition text-emerald-400"
              >
                <ThumbsUp size={20} />
                <span className="text-xs">Fácil</span>
                <span className="text-xs text-slate-600">intervalo longo</span>
              </button>
            </div>
          )}

          {!flipped && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setFlipped(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
              >
                Revelar resposta
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Create mode
  if (mode === 'create') {
    return (
      <div className="p-6 max-w-xl mx-auto fade-in">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setMode('home')} className="text-slate-500 hover:text-white transition">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-white">Novo Flashcard</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide mb-1.5 block">Matéria</label>
            <select
              value={subjectId}
              onChange={(e) => {
                const sub = SUBJECTS.find((s) => s.id === e.target.value)!
                setSubjectId(e.target.value)
                setTopicId(sub.topics[0].id)
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
            >
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide mb-1.5 block">Tópico</label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
            >
              {selectedSubject.topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide mb-1.5 block">Frente (pergunta)</label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={3}
              placeholder="Ex: Qual é a fórmula da área do círculo?"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm resize-none focus:outline-none focus:border-violet-500 placeholder-slate-600"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide mb-1.5 block">Verso (resposta)</label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={4}
              placeholder="Ex: A = π × r²"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm resize-none focus:outline-none focus:border-violet-500 placeholder-slate-600"
            />
          </div>

          <button
            onClick={createCard}
            disabled={!front.trim() || !back.trim()}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white py-2.5 rounded-lg font-medium transition"
          >
            Criar Flashcard
          </button>
        </div>
      </div>
    )
  }

  // Home mode
  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard size={24} className="text-blue-400" /> Flashcards
          </h1>
          <p className="text-slate-400 text-sm mt-1">Repetição espaçada com algoritmo SM-2</p>
        </div>
        <button
          onClick={() => setMode('create')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus size={16} /> Novo Card
        </button>
      </div>

      {/* Stats + ações */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: validCards.length, color: 'text-white' },
          { label: 'Para revisar hoje', value: dueCards.length, color: 'text-blue-400' },
          { label: 'Revisados', value: validCards.filter((c) => c.repetitions > 0).length, color: 'text-emerald-400' },
          { label: 'Intervalo médio', value: validCards.length > 0 ? Math.round(validCards.reduce((s, c) => s + c.interval, 0) / validCards.length) + 'd' : '0d', color: 'text-violet-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Botões de revisão */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => startReview(false)}
          disabled={dueCards.length === 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          <RotateCcw size={16} /> Revisar hoje ({dueCards.length})
        </button>
        <button
          onClick={() => startReview(true)}
          disabled={cards.length === 0}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          <BookOpen size={16} /> Revisar todos
        </button>
      </div>

      {/* Lista por matéria */}
      <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Todos os flashcards</h2>
      {validCards.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard size={40} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400">Nenhum flashcard ainda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {validCards.map((card) => {
            const subject = SUBJECTS.find((s) => s.id === card.subjectId)
            const due = isDueToday(card)
            return (
              <div key={card.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {subject && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: subject.color + '20', color: subject.color }}>
                        {subject.name}
                      </span>
                    )}
                    {due && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">revisar hoje</span>
                    )}
                  </div>
                  <p className="text-sm text-white font-medium truncate">{card.front}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{card.back}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Intervalo</p>
                    <p className="text-xs text-slate-400">{card.interval}d</p>
                  </div>
                  <button onClick={() => deleteCard(card.id)} className="text-slate-600 hover:text-red-400 transition">
                    <X size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
