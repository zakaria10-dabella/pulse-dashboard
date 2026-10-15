import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, ChevronsUpDown, LayoutGrid, Settings, Users } from 'lucide-react'
import credits from '../../public/photos/credits.json'

export const nav = [
  { to: '/', label: 'Overview', icon: LayoutGrid, key: 'O' },
  { to: '/members', label: 'Members', icon: Users, key: 'M' },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays, key: 'S' },
]

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-[5px] bg-fg">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="rgb(var(--accent))" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 13h3.5l2.5-6 4.5 11 2.5-5H21" /></svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight">Pulse</span>
    </span>
  )
}

export default function Sidebar({ onNavigate }) {
  const { pathname } = useLocation()
  const photo = credits[0]
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-line px-4">
        <Logo />
      </div>

      <div className="px-3 pt-3">
        <button className="flex h-11 w-full items-center gap-2.5 rounded-md border border-line px-2.5 text-left transition-colors hover:bg-raised">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-raised text-2xs font-semibold text-muted">AB</span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[13px] font-medium">Atlas Barbell Club</span>
            <span className="block truncate text-2xs text-muted">3 branches · Casablanca</span>
          </span>
          <ChevronsUpDown size={14} className="shrink-0 text-faint" />
        </button>
      </div>

      <nav aria-label="Main" className="px-3 pt-5">
        <p className="eyebrow mb-1.5 px-2.5">Club</p>
        <ul className="space-y-0.5">
          {nav.map(({ to, label, icon: Icon, key }) => {
            const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
            return (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition-colors ${active ? 'text-fg' : 'text-muted hover:bg-raised/70 hover:text-fg'}`}
                >
                  {active && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-md bg-raised" transition={{ type: 'spring', stiffness: 520, damping: 40 }} />}
                  <Icon size={16} strokeWidth={1.75} className="relative" />
                  <span className="relative flex-1">{label}</span>
                  <span className="relative hidden gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 lg:flex" aria-hidden="true">
                    <kbd className="kbd">G</kbd><kbd className="kbd">{key}</kbd>
                  </span>
                </NavLink>
              </li>
            )
          })}
          <li>
            <span className="flex h-9 cursor-not-allowed items-center gap-2.5 px-2.5 text-[13px] font-medium text-faint" title="Coming soon">
              <Settings size={16} strokeWidth={1.75} /> Settings
            </span>
          </li>
        </ul>
      </nav>

      <div className="mt-auto p-3">
        <article className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="relative aspect-[16/9] overflow-hidden bg-raised">
            <img src={`/${photo.file}`} alt="Rubber-coated dumbbells and kettlebells stacked on a rack" width="1280" height="960" loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_40%]" />
          </div>
          <div className="p-3">
            <p className="text-[13px] font-medium">Free-weights audit</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">Maarif rack: 6 of 64 dumbbells flagged for replacement. Due 20 Oct.</p>
            <button className="mt-2.5 inline-flex h-8 items-center gap-1 text-xs font-medium text-accent hover:underline">
              Open checklist <ArrowUpRight size={13} />
            </button>
          </div>
        </article>
        <p className="mt-2 px-1 text-[10px] leading-snug text-faint">
          Photo: <a href={photo.source} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-2 hover:text-muted">{photo.author}</a>, {photo.license}, Wikimedia Commons
        </p>
      </div>
    </div>
  )
}
