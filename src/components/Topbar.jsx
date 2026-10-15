import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'
import { Logo } from './Sidebar'

export default function Topbar({ theme, onToggleTheme, onMenu }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-bg/80 px-4 backdrop-blur-xl sm:px-6">
      <button onClick={onMenu} aria-label="Open navigation" className="grid h-10 w-10 place-items-center rounded-xl hover:bg-raised lg:hidden">
        <Menu size={20} />
      </button>
      <div className="lg:hidden"><Logo /></div>
      <label className="relative ml-auto hidden max-w-sm flex-1 sm:block lg:ml-0">
        <span className="sr-only">Search</span>
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input className="input pl-9" placeholder="Search members, classes..." />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line px-1.5 text-[10px] text-muted md:block">⌘K</kbd>
      </label>
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <motion.button whileTap={{ scale: 0.88 }} onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl hover:bg-raised">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={theme} initial={{ y: 20, rotate: -90, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} exit={{ y: -20, rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <motion.button whileTap={{ scale: 0.88 }} aria-label="Notifications, 3 unread" className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-raised">
          <motion.span animate={{ rotate: [0, -14, 12, -8, 0] }} transition={{ delay: 2, duration: 0.7, repeat: Infinity, repeatDelay: 6 }}>
            <Bell size={18} />
          </motion.span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral ring-2 ring-bg" />
        </motion.button>
        <div className="ml-1 flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 sm:pr-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-lime to-[#7BD62A] font-display text-xs font-bold text-[#141220]">SR</span>
          <span className="hidden text-sm leading-tight sm:block">
            <span className="block font-semibold">Salma Rami</span>
            <span className="text-xs text-muted">Club manager</span>
          </span>
        </div>
      </div>
    </header>
  )
}
