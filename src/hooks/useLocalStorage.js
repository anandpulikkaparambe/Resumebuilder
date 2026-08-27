import { useEffect, useState } from 'react'

export function useLocalStorage(key, getInitialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return getInitialValue()
      }
    }
    return getInitialValue()
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
