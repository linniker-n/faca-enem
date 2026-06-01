'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Target, ArrowRight } from 'lucide-react'
import { storage } from '@/lib/storage'
import type { ExamType, EducationLevel } from '@/lib/types'

export default function ModalidadePage() {
  const router = useRouter()
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Verificar se o usuário já selecionou uma modalidade
    const progress = storage.getProgress()
    if (progress?.examType) {
      router.push('/')
    }
  }, [router])

  const handleConfirm = () => {
    if (!selectedExam) return

    setLoading(true)
    
    // Se selecionou Encceja, precisa escolher o nível
    if (selectedExam === 'encceja' && !selectedLevel) {
      setLoading(false)
      return
    }

    // Salvar a escolha
    const progress = storage.getProgress()
    const updatedProgress = {
      ...progress,
      examType: selectedExam,
      educationLevel: selectedLevel || 'medio',
      updatedAt: new Date().toISOString(),
    }
    
    storage.saveProgress(updatedProgress)
    
    // Redirecionar para o dashboard
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-violet-500/20 border border-violet-500/40 rounded-xl flex items-center justify-center">
              <Target size={24} className="text-violet-400" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Escolha sua Modalidade</h1>
          <p className="text-slate-400 text-lg">Selecione o exame que você deseja estudar</p>
        </div>

        {/* Opções de Exame */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* ENEM */}
          <button
            onClick={() => {
              setSelectedExam('enem')
              setSelectedLevel('medio')
            }}
            className={`relative overflow-hidden rounded-2xl p-6 md:p-8 transition-all duration-300 border-2 group ${
              selectedExam === 'enem'
                ? 'border-violet-500 bg-violet-500/10'
                : 'border-slate-700 bg-slate-900/50 hover:border-violet-500/50 hover:bg-slate-900'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-violet-500/0 group-hover:from-violet-500/5 group-hover:to-violet-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-violet-500/20 rounded-xl mb-4 mx-auto">
                <BookOpen size={24} className="text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ENEM</h3>
              <p className="text-slate-400 text-sm mb-4">
                Exame Nacional do Ensino Médio
              </p>
              <p className="text-xs text-slate-500">
                Para quem quer entrar na universidade
              </p>
              {selectedExam === 'enem' && (
                <div className="mt-4 flex items-center justify-center gap-2 text-violet-400 text-sm font-medium">
                  <div className="w-2 h-2 bg-violet-400 rounded-full" />
                  Selecionado
                </div>
              )}
            </div>
          </button>

          {/* ENCCEJA */}
          <button
            onClick={() => setSelectedExam('encceja')}
            className={`relative overflow-hidden rounded-2xl p-6 md:p-8 transition-all duration-300 border-2 group ${
              selectedExam === 'encceja'
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-700 bg-slate-900/50 hover:border-emerald-500/50 hover:bg-slate-900'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-xl mb-4 mx-auto">
                <Target size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Encceja</h3>
              <p className="text-slate-400 text-sm mb-4">
                Exame para Certificação de Competências
              </p>
              <p className="text-xs text-slate-500">
                Para obter certificado de conclusão
              </p>
              {selectedExam === 'encceja' && (
                <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  Selecionado
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Seleção de Nível (Encceja) */}
        {selectedExam === 'encceja' && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-white font-semibold mb-4">Qual é seu nível?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedLevel('fundamental')}
                className={`rounded-xl p-4 transition-all border-2 ${
                  selectedLevel === 'fundamental'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-900/50 hover:border-blue-500/50'
                }`}
              >
                <p className="font-semibold text-white">Ensino Fundamental</p>
                <p className="text-xs text-slate-400 mt-1">9º ano</p>
              </button>
              <button
                onClick={() => setSelectedLevel('medio')}
                className={`rounded-xl p-4 transition-all border-2 ${
                  selectedLevel === 'medio'
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-slate-700 bg-slate-900/50 hover:border-orange-500/50'
                }`}
              >
                <p className="font-semibold text-white">Ensino Médio</p>
                <p className="text-xs text-slate-400 mt-1">3º ano</p>
              </button>
            </div>
          </div>
        )}

        {/* Descrição da Escolha */}
        {selectedExam && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6 mb-8 animate-in fade-in duration-300">
            <h4 className="font-semibold text-white mb-2">Sua escolha:</h4>
            <p className="text-slate-300">
              {selectedExam === 'enem' ? (
                <>
                  Você vai estudar para o <strong>ENEM</strong> - Ensino Médio
                </>
              ) : (
                <>
                  Você vai estudar para o <strong>Encceja</strong> - Ensino {selectedLevel === 'fundamental' ? 'Fundamental' : 'Médio'}
                </>
              )}
            </p>
          </div>
        )}

        {/* Botão de Confirmação */}
        <button
          onClick={handleConfirm}
          disabled={!selectedExam || (selectedExam === 'encceja' && !selectedLevel) || loading}
          className={`w-full py-3 md:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            !selectedExam || (selectedExam === 'encceja' && !selectedLevel) || loading
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              Começar a Estudar
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Rodapé */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Você pode mudar sua escolha a qualquer momento nas configurações
        </p>
      </div>
    </div>
  )
}
