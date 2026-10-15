import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useTheme } from '../hooks/useTheme'
import { useShortcuts } from '../hooks/useShortcuts'

export default function Layout({ children }) {
  const [theme, toggleTheme] = useTheme()
  const [drawer, setDrawer] = useState(false)
  const location = useLocation()
  const searchRef = useRef(null)
  useShortcuts(searchRef)

  useEffect(() => setDrawer(false), [location.pathname])
  useEffect(() => {
    if (!drawer) return
    const onKey = (e) => e.key === 'Escape' && setDrawer(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawer])

  return (
    <div className="min-h-screen lg:pl-60">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2">Skip to content</a>
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-line bg-surface lg:block">
        <Sidebar />
      </aside>
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.22, ease: [0.32, 0.72, 0, 1] }} className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-line bg-surface lg:hidden">
              <Sidebar onNavigate={() => setDrawer(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <Topbar ref={searchRef} theme={theme} onToggleTheme={toggleTheme} onMenu={() => setDrawer(true)} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          {children(location)}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
