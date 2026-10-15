import { forwardRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'
import { Logo, nav } from './Sidebar'

const Topbar = forwardRef(function Topbar({ theme, onToggleTheme, onMenu }, searchRef) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const page = nav.find((n) => (n.to === '/' ? pathname === '/' : pathname.startsWith(n.to)))?.label ?? 'Overview'

  const submit = (e) => {
    e.preventDefault()
    navigate(`/members${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
    setQ('')
    searchRef.current?.blur()
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-bg/90 px-3 backdrop-blur-md sm:px-6">
      <button onClick={onMenu} aria-label="Open navigation" className="icon-btn h-11 w-11 lg:hidden">
        <Menu size={18} />
      </button>
      <span className="lg:hidden"><Logo /></span>
      <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-[13px] lg:flex">
        <span className="text-muted">Atlas Barbell Club</span>
        <span className="text-faint">/</span>
        <span className="font-medium">{page}</span>
      </nav>

      <form onSubmit={submit} role="search" className="relative ml-auto hidden w-full max-w-[280px] md:block">
        <label htmlFor="global-search" className="sr-only">Search members</label>
        <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
        <input id="global-search" ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} className="input pl-8 pr-8" placeholder="Search members" />
        <kbd className="kbd absolute right-2 top-1/2 -translate-y-1/2">/</kbd>
      </form>

      <div className="ml-auto flex items-center gap-0.5 md:ml-2">
        <button onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} className="icon-btn h-11 w-11 sm:h-9 sm:w-9">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button aria-label="Notifications, 3 unread" className="icon-btn relative h-11 w-11 sm:h-9 sm:w-9">
          <Bell size={16} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <span className="mx-1.5 hidden h-5 w-px bg-line sm:block" />
        <span className="flex items-center gap-2 pl-1">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-raised text-2xs font-semibold text-fg ring-1 ring-line" aria-hidden="true">SR</span>
          <span className="hidden text-[13px] leading-tight xl:block">
            <span className="block font-medium">Salma Rami</span>
            <span className="text-2xs text-muted">Club manager</span>
          </span>
        </span>
      </div>
    </header>
  )
})

export default Topbar
