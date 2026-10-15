import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const isTyping = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)

/** "/" focuses search, "g" then o / m / s jumps between pages (Linear-style). */
export function useShortcuts(searchRef) {
  const navigate = useNavigate()
  const pendingG = useRef(0)
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(document.activeElement)) return
      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
        return
      }
      if (e.key === 'g') {
        pendingG.current = Date.now()
        return
      }
      if (Date.now() - pendingG.current < 900) {
        const to = { o: '/', m: '/members', s: '/schedule' }[e.key]
        if (to) navigate(to)
        pendingG.current = 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, searchRef])
}
