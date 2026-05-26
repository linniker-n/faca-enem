'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, PlayCircle, ChevronRight, RefreshCw, Clock, CheckCircle } from 'lucide-react'
import { storage } from '@/lib/storage'
import { SUBJECTS } from '@/lib/data/subjects'
import type { StudyCycle, CycleSubjectConfig } from '@/lib/types'

function genId() {
  return Math.random().toString(36).slice(2)
}

export default function CiclosPage() {
  const [cycles, setCycles] = useState<StudyCycle[]>([])
  const [creating, setCreating] = useState(false)
  const [cycleName, setCycleName] = useState('')
  const [selected, setSelected] = useState<CycleSubjectConfig[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCycles(storage.getCycles())
    setLoaded(true)
  }, [])

  function saveCycles(updated: StudyCycle[]) {
    setCycles(updated)
    storage.saveCycles(updated)
  }

  function addSubject(subjectId: string) {
    if (selected.some((s) => s.subjectId === subjectId)) return
    setSelected((prev) => [...prev, { subjectId, minutesPerSession: 30, priority: 'medium' }])
  }

  function removeSubject(subjectId: string) {
    setSelected((prev) => prev.filter((s) => s.subjectId !== subjectId))
  }

  function updateMinutes(subjectId: string, minutes: number) {
    setSelected((prev) => prev.map((s) => (s.subjectId === subjectId ? { ...s, minutesPerSession: minutes } : s)))
  }

  function updatePriority(subjectId: string, priority: CycleSubjectConfig['priority']) {
    setSelected((prev) => prev.map((s) => (s.subjectId === subjectId ? { ...s, priority } : s)))
  }

  function createCycle() {
    if (!cycleName.trim() || selected.length === 0) return
    const cycle: StudyCycle = {
      id: genId(),
      userId: storage.getCurrentUserId(),
      name: cycleName.trim(),
      subjects: selected,
      createdAt: new Date().toISOString(),
      currentPosition: 0,
      completedSessions: 0,
    }
    const updated = [cycle, ...cycles]
    saveCycles(updated)
    setCreating(false)
    setCycleName('')
    setSelected([])
  }

  function deleteCycle(id: string) {
    saveCycles(cycles.filter((c) => c.id !== id))
  }

  function advanceSession(cycleId: string) {
    const updated = cycles.map((c) => {
      if (c.id !== cycleId) return c
      const newPos = (c.currentPosition + 1) % c.subjects.length
      return { ...c, currentPosition: newPos, completedSessions: c.completedSessions + 1 }
    })
    saveCycles(updated)
    const p = storage.getProgress()
    storage.saveProgress({ ...p, completedSessions: (p.completedSessions ?? 0) + 1 })
    storage.updateStreak()
  }

  const PRIORITY_LABELS = { high: '🔴 Alta', medium: '🟡 Média', low: '🟢 Baixa' }
  const PRIORITY_ORDER = ['high', 'medium', 'low'] as const

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <RefreshCw size={24} className="text-violet-400" /> Ciclos de Estudo
          </h1>
          <p className="text-slate-400 text-sm mt-1">Organize suas matérias em ciclos adaptativos sem cronograma fixo.</p>
        </div>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus size={16} /> Novo Ciclo
          </button>
        )}
      </div>

      {/* Formulário de criação */}
      {creating && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Novo Ciclo</h2>

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm mb-4 focus:outline-none focus:border-violet-500"
            placeholder="Nome do ciclo (ex: Ciclo Intensivo ENEM)"
            value={cycleName}
            onChange={(e) => setCycleName(e.target.value)}
          />

          {/* Matérias selecionadas */}
          {selected.length > 0 && (
            <div className="space-y-2 mb-4">
              {selected.map((config) => {
                const subject = SUBJECTS.find((s) => s.id === config.subjectId)
                if (!subject) return null
                return (
                  <div key={config.subjectId} className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: subject.color }} />
                    <span className="text-sm text-white flex-1">{subject.name}</span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock size={14} />
                      <input
                        type="number"
                        min={10}
                        max={120}
                        step={5}
                        value={config.minutesPerSession}
                        onChange={(e) => updateMinutes(config.subjectId, Number(e.target.value))}
                        className="w-14 bg-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                      <span className="text-xs">min</span>
                    </div>
                    <select
                      value={config.priority}
                      onChange={(e) => updatePriority(config.subjectId, e.target.value as CycleSubjectConfig['priority'])}
                      className="bg-slate-700 border-none rounded px-2 py-1 text-xs text-white focus:outline-none"
                    >
                      {PRIORITY_ORDER.map((p) => (
                        <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                      ))}
                    </select>
                    <button onClick={() => removeSubject(config.subjectId)} className="text-slate-500 hover:text-red-400 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Selecionar matérias */}
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Adicionar matérias</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {SUBJECTS.map((s) => {
              const isSelected = selected.some((x) => x.subjectId === s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => (isSelected ? removeSubject(s.id) : addSubject(s.id))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    isSelected
                      ? 'text-white border-transparent'
                      : 'text-slate-400 border-slate-700 hover:border-slate-500'
                  }`}
                  style={isSelected ? { background: s.color, borderColor: s.color } : {}}
                >
                  {s.name}
                </button>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={createCycle}
              disabled={!cycleName.trim() || selected.length === 0}
              className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Criar Ciclo
            </button>
            <button
              onClick={() => { setCreating(false); setCycleName(''); setSelected([]) }}
              className="text-slate-400 hover:text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de ciclos */}
      {cycles.length === 0 && !creating && (
        <div className="text-center py-16">
          <RefreshCw size={40} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Nenhum ciclo criado ainda</p>
          <p className="text-slate-600 text-sm mt-1">Crie seu primeiro ciclo para organizar os estudos.</p>
        </div>
      )}

      <div className="space-y-4">
        {cycles.map((cycle) => {
          const currentConfig = cycle.subjects[cycle.currentPosition % cycle.subjects.length]
          const currentSubject = SUBJECTS.find((s) => s.id === currentConfig?.subjectId)
          const totalMinutes = cycle.subjects.reduce((sum, s) => sum + s.minutesPerSession, 0)

          return (
            <div key={cycle.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{cycle.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {cycle.subjects.length} matérias • {totalMinutes} min/ciclo • {cycle.completedSessions} sessões concluídas
                  </p>
                </div>
                <button onClick={() => deleteCycle(cycle.id)} className="text-slate-600 hover:text-red-400 transition p-1">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Matérias do ciclo */}
              <div className="flex flex-wrap gap-2 mb-4">
                {cycle.subjects.map((config, idx) => {
                  const sub = SUBJECTS.find((s) => s.id === config.subjectId)
                  if (!sub) return null
                  const isCurrent = idx === cycle.currentPosition % cycle.subjects.length
                  return (
                    <div
                      key={config.subjectId}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border ${
                        isCurrent ? 'text-white font-medium' : 'text-slate-400 border-slate-700'
                      }`}
                      style={isCurrent ? { background: sub.color + '30', borderColor: sub.color } : {}}
                    >
                      {isCurrent && <PlayCircle size={12} style={{ color: sub.color }} />}
                      {sub.name} • {config.minutesPerSession}min
                    </div>
                  )
                })}
              </div>

              {/* Sessão atual */}
              {currentSubject && (
                <div
                  className="flex items-center justify-between rounded-xl p-4 border"
                  style={{ borderColor: currentSubject.color + '40', background: currentSubject.color + '10' }}
                >
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Sessão atual</p>
                    <p className="font-semibold text-white">{currentSubject.name}</p>
                    <p className="text-xs" style={{ color: currentSubject.color }}>
                      {currentConfig.minutesPerSession} min • Prioridade {PRIORITY_LABELS[currentConfig.priority]}
                    </p>
                  </div>
                  <button
                    onClick={() => advanceSession(cycle.id)}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-white transition"
                    style={{ background: currentSubject.color }}
                  >
                    <CheckCircle size={16} /> Concluir
                  </button>
                </div>
              )}

              {/* Próximas sessões */}
              <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                <span>Próximas:</span>
                {cycle.subjects.slice(0, 5).map((config, idx) => {
                  const sub = SUBJECTS.find((s) => s.id === config.subjectId)
                  const pos = (cycle.currentPosition + idx + 1) % cycle.subjects.length
                  const next = SUBJECTS.find((s) => s.id === cycle.subjects[pos]?.subjectId)
                  if (idx === 0 && next) {
                    return (
                      <span key={idx} className="flex items-center gap-1 ml-1">
                        <ChevronRight size={12} />
                        <span style={{ color: next.color }}>{next.name}</span>
                      </span>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
