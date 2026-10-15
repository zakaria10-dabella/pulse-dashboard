import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, LayoutGrid, Settings, Users, Zap } from 'lucide-react'

export const nav = [
  { to: '/', label: 'Overview', icon: LayoutGrid },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
]

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-[#5B2EE0] shadow-glow">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 13h4l2.5-6 4 12 2.5-6H22" /></svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight">pulse</span>
    </div>
  )
}

export default function Sidebar({ onNavigate }) {
  const { pathname } = useLocation()
  return (
    <div className="flex h-full flex-col gap-8 p-5">
      <Logo />
      <nav aria-label="Main">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted">Club</p>
        <ul className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
            return (
              <li key={to}>
                <NavLink to={to} onClick={onNavigate} className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'text-fg' : 'text-muted hover:text-fg'}`}>
                  {active && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-xl bg-raised" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  {active && <motion.span layoutId="nav-bar" className="absolute -left-5 top-2 h-6 w-1 rounded-r-full bg-accent" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <Icon size={18} className="relative" />
                  <span className="relative">{label}</span>
                </NavLink>
              </li>
            )
          })}
          <li>
            <span className="flex cursor-not-allowed items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted/60" title="Coming soon">
              <Settings size={18} /> Settings
            </span>
          </li>
        </ul>
      </nav>
      <motion.div whileHover={{ y: -3 }} className="relative mt-auto overflow-hidden rounded-2xl bg-gradient-to-br from-[#2A1B5E] via-[#1B1440] to-[#0F0C1F] p-4 text-white">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/50 blur-2xl" />
        <Zap size={18} className="relative text-lime" />
        <p className="relative mt-3 font-display text-sm font-semibold">Pulse Pro</p>
        <p className="relative mt-1 text-xs text-white/60">Automated renewals and WhatsApp reminders for overdue members.</p>
        <button className="relative mt-3 w-full rounded-lg bg-lime py-2 text-xs font-bold text-[#141220] transition hover:brightness-110">Upgrade</button>
      </motion.div>
    </div>
  )
}
