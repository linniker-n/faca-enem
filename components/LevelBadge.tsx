'use client'

import { getLevelTitle } from '@/lib/xp-config'
import type { UserLevel } from '@/lib/types'

interface LevelBadgeProps {
  level: UserLevel
  size?: 'sm' | 'md' | 'lg'
}

export function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const title = getLevelTitle(level.currentLevel)
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  const colors = [
    'bg-slate-600', // 1
    'bg-blue-600', // 2
    'bg-cyan-600', // 3
    'bg-teal-600', // 4
    'bg-green-600', // 5
    'bg-yellow-600', // 6
    'bg-orange-600', // 7
    'bg-red-600', // 8
    'bg-pink-600', // 9
    'bg-purple-600', // 10
  ]

  const color = colors[Math.min(level.currentLevel - 1, colors.length - 1)]

  return (
    <div className={`${sizeClasses[size]} ${color} rounded-lg font-medium text-white inline-flex items-center gap-2`}>
      <span>⭐</span>
      <span>Nível {level.currentLevel}</span>
      <span className="text-xs opacity-75">{title}</span>
    </div>
  )
}
