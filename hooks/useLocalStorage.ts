'use client'

import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item !== null) setValue(JSON.parse(item) as T)
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [key])

  const setStored = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof newValue === 'function' ? (newValue as (p: T) => T)(prev) : newValue
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
    },
    [key]
  )

  return [value, setStored, loaded] as const
}
