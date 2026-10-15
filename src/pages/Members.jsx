import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ChevronsUpDown, Search, UserPlus } from 'lucide-react'
import { members } from '../data/members'
import { Avatar, formatDate, lastVisit, PlanTag, StatusBadge } from '../components/ui'
import MemberPanel from '../components/MemberPanel'

const statuses = ['All', 'Active', 'Paused', 'Overdue']
const columns = [
  { key: 'name', label: 'Member' },
  { key: 'plan', label: 'Plan' },
  { key: 'status', label: 'Status' },
  { key: 'joined', label: 'Joined' },
  { key: 'visits', label: 'Visits / mo' },
  { key: 'lastVisitDaysAgo', label: 'Last visit' },
]

function EmptyState({ onReset }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-16 text-center">
      <motion.svg viewBox="0 0 120 120" className="h-28 w-28" animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
        <circle cx="52" cy="52" r="30" fill="none" stroke="rgb(var(--accent))" strokeWidth="8" />
        <motion.line x1="74" y1="74" x2="100" y2="100" stroke="#C6F432" strokeWidth="10" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
        <circle cx="44" cy="44" r="6" fill="rgb(var(--accent))" opacity=".35" />
      </motion.svg>
      <p className="mt-4 font-display text-lg font-semibold">No members match</p>
      <p className="mt-1 text-sm text-muted">Try another name or clear the filters.</p>
      <button onClick={onReset} className="mt-4 rounded-xl bg-raised px-4 py-2 text-sm font-semibold hover:bg-accent hover:text-white">Clear filters</button>
    </motion.div>
  )
}

export default function Members() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [plan, setPlan] = useState('All')
  const [sort, setSort] = useState({ key: 'joined', dir: 'desc' })
  const [selected, setSelected] = useState(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = members.filter(
      (m) =>
        (status === 'All' || m.status === status) &&
        (plan === 'All' || m.plan === plan) &&
        (!q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.branch.toLowerCase().includes(q)),
    )
    const dir = sort.dir === 'asc' ? 1 : -1
    return list.sort((a, b) => {
      const va = a[sort.key]
      const vb = b[sort.key]
      return (typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb))) * dir
    })
  }, [query, status, plan, sort])

  const toggleSort = (key) => setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  const reset = () => { setQuery(''); setStatus('All'); setPlan('All') }
  const counts = useMemo(() => Object.fromEntries(statuses.map((s) => [s, s === 'All' ? members.length : members.filter((m) => m.status === s).length])), [])

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Members</h1>
          <p className="mt-1 text-sm text-muted">Manage memberships, plans and attendance across all branches.</p>
        </div>
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow">
          <UserPlus size={16} /> Add member
        </motion.button>
      </motion.div>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">
          <label className="relative flex-1 lg:max-w-xs">
            <span className="sr-only">Search members</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input pl-9" placeholder="Search name, ID or branch" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <LayoutGroup id="status">
            <div className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Status filter">
              {statuses.map((s) => (
                <button key={s} role="tab" aria-selected={status === s} onClick={() => setStatus(s)} className={`relative whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${status === s ? 'text-white' : 'text-muted hover:text-fg'}`}>
                  {status === s && <motion.span layoutId="status-pill" className="absolute inset-0 rounded-lg bg-accent" transition={{ type: 'spring', stiffness: 450, damping: 34 }} />}
                  <span className="relative">{s} <span className="tnum opacity-60">{counts[s]}</span></span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <select aria-label="Plan" value={plan} onChange={(e) => setPlan(e.target.value)} className="input lg:ml-auto lg:w-40">
            {['All', 'Basic', 'Premium', 'Elite'].map((p) => <option key={p} value={p}>{p === 'All' ? 'All plans' : p}</option>)}
          </select>
        </div>

        {/* desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                {columns.map((c) => (
                  <th key={c.key} scope="col" className="px-4 py-3 font-semibold" aria-sort={sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-fg">
                      {c.label}
                      {sort.key === c.key ? (sort.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ChevronsUpDown size={12} className="opacity-40" />}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody layout>
              <AnimatePresence initial={false}>
                {rows.map((m, i) => (
                  <motion.tr
                    key={m.id}
                    layout="position"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 12) * 0.025 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    onClick={() => setSelected(m)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelected(m)}
                    className="cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-raised/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar m={m} />
                        <div>
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-xs text-muted">{m.id} · {m.branch}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><PlanTag plan={m.plan} /></td>
                    <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                    <td className="tnum px-4 py-3 text-muted">{formatDate(m.joined)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-raised">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(m.visits / 26) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full rounded-full bg-accent" />
                        </div>
                        <span className="tnum text-xs font-semibold">{m.visits}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{lastVisit(m.lastVisitDaysAgo)}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>

        {/* mobile cards */}
        <div className="md:hidden">
          <div className="flex gap-2 border-b border-line px-4 py-2 text-xs text-muted">
            Sort:
            {['name', 'joined', 'visits'].map((k) => (
              <button key={k} onClick={() => toggleSort(k)} className={`font-semibold ${sort.key === k ? 'text-accent' : ''}`}>
                {columns.find((c) => c.key === k).label}{sort.key === k && (sort.dir === 'asc' ? ' ↑' : ' ↓')}
              </button>
            ))}
          </div>
          <motion.ul layout className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {rows.map((m) => (
                <motion.li key={m.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button onClick={() => setSelected(m)} className="flex w-full items-center gap-3 p-4 text-left active:bg-raised">
                    <Avatar m={m} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{m.name}</p>
                      <p className="text-xs text-muted"><PlanTag plan={m.plan} /> · {m.visits} visits · {lastVisit(m.lastVisitDaysAgo)}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>

        <AnimatePresence>{rows.length === 0 && <EmptyState onReset={reset} />}</AnimatePresence>
        <p className="border-t border-line px-4 py-3 text-xs text-muted" aria-live="polite">Showing {rows.length} of {members.length} members</p>
      </div>

      {/* portal: the routed page is transformed during transitions, which would trap position:fixed */}
      {createPortal(
        <AnimatePresence>{selected && <MemberPanel key={selected.id} m={selected} onClose={() => setSelected(null)} />}</AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
