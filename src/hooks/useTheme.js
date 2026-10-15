import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('pulse-theme') || 'dark'
    } catch {
      return 'dark'
    }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('pulse-theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}
