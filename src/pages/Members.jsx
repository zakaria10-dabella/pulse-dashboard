import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ChevronsUpDown, Search, UserPlus, X } from 'lucide-react'
import { members } from '../data/members'
import { Avatar, formatDate, lastVisit, PageHeader, StatusBadge } from '../components/ui'
import Segmented from '../components/Segmented'
import MemberPanel from '../components/MemberPanel'

const statuses = ['All', 'Active', 'Paused', 'Overdue']
const columns = [
  { key: 'name', label: 'Member' },
  { key: 'plan', label: 'Plan' },
  { key: 'status', label: 'Status' },
  { key: 'joined', label: 'Joined' },
  { key: 'visits', label: 'Visits / mo', num: true },
  { key: 'lastVisitDaysAgo', label: 'Last visit' },
]

function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-md border border-line text-muted"><Search size={18} /></span>
      <p className="mt-4 text-[13px] font-medium">No members match these filters</p>
      <p className="mt-1 text-xs text-muted">Try a different name, ID or branch, or clear the filters.</p>
      <button onClick={onReset} className="btn-ghost mt-4">Clear filters</button>
    </div>
  )
}

export default function Members() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [status, setStatus] = useState(statuses.includes(params.get('status')) ? params.get('status') : 'All')
  const [plan, setPlan] = useState('All')
  const [sort, setSort] = useState({ key: 'joined', dir: 'desc' })
  const [selected, setSelected] = useState(() => members.find((m) => m.id === params.get('id')) ?? null)

  // the global search in the top bar can update ?q while this page is open
  useEffect(() => {
    const q = params.get('q')
    if (q !== null) setQuery(q)
  }, [params])

  const close = () => {
    setSelected(null)
    if (params.has('id')) { params.delete('id'); setParams(params, { replace: true }) }
  }

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
  const reset = () => { setQuery(''); setStatus('All'); setPlan('All'); setParams({}, { replace: true }) }
  const counts = useMemo(() => Object.fromEntries(statuses.map((s) => [s, s === 'All' ? members.length : members.filter((m) => m.status === s).length])), [])
  const filtered = query || status !== 'All' || plan !== 'All'

  return (
    <div className="space-y-5">
      <PageHeader title="Members" meta={`${members.length} members across 3 branches`}>
        <button className="btn-primary"><UserPlus size={14} /> Add member</button>
      </PageHeader>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="relative sm:w-64">
          <span className="sr-only">Filter members</span>
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
          <input className="input h-10 pl-8 sm:h-9" placeholder="Name, ID or branch" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="scrollbar-none -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <Segmented label="Status" options={statuses.map((s) => ({ value: s, label: s, count: counts[s] }))} value={status} onChange={setStatus} />
        </div>
        <select aria-label="Plan" value={plan} onChange={(e) => setPlan(e.target.value)} className="input h-10 w-full sm:h-9 sm:w-36">
          {['All', 'Basic', 'Premium', 'Elite'].map((p) => <option key={p} value={p}>{p === 'All' ? 'All plans' : p}</option>)}
        </select>
        {filtered && (
          <button onClick={reset} className="btn h-9 self-start px-2 text-muted hover:text-fg sm:self-auto"><X size={14} /> Clear</button>
        )}
      </div>

      <div className="panel overflow-hidden">
        {/* desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-raised/50">
              <tr className="border-b border-line">
                {columns.map((c) => (
                  <th key={c.key} scope="col" className={`h-9 px-4 font-medium text-muted ${c.num ? 'text-right' : ''}`} aria-sort={sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <button onClick={() => toggleSort(c.key)} className={`inline-flex h-7 items-center gap-1 rounded text-xs hover:text-fg ${sort.key === c.key ? 'text-fg' : ''}`}>
                      {c.label}
                      {sort.key === c.key ? (sort.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ChevronsUpDown size={12} className="opacity-40" />}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {rows.map((m) => (
                  <motion.tr
                    key={m.id}
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ layout: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } }}
                    onClick={() => setSelected(m)}
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSelected(m))}
                    aria-label={`Open ${m.name}`}
                    className={`cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-raised/60 focus-visible:bg-raised focus-visible:ring-inset ${selected?.id === m.id ? 'bg-raised/60' : ''}`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <Avatar m={m} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{m.name}</p>
                          <p className="truncate text-xs text-muted"><span className="font-mono text-[11px]">{m.id}</span> · {m.branch}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">{m.plan}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={m.status} /></td>
                    <td className="tnum px-4 py-2.5 text-muted">{formatDate(m.joined)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-raised">
                          <div className="h-full rounded-full bg-fg/50" style={{ width: `${(m.visits / 26) * 100}%` }} />
                        </div>
                        <span className="tnum w-5 text-right">{m.visits}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted">{lastVisit(m.lastVisitDaysAgo)}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* mobile list */}
        <div className="md:hidden">
          <div className="flex items-center gap-1 border-b border-line px-3 py-1.5 text-xs text-muted">
            <span className="pr-1">Sort</span>
            {['name', 'joined', 'visits'].map((k) => (
              <button key={k} onClick={() => toggleSort(k)} className={`inline-flex h-9 items-center gap-0.5 rounded px-2 font-medium ${sort.key === k ? 'bg-raised text-fg' : ''}`}>
                {columns.find((c) => c.key === k).label}
                {sort.key === k && (sort.dir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
              </button>
            ))}
          </div>
          <ul className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {rows.map((m) => (
                <motion.li key={m.id} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button onClick={() => setSelected(m)} className="flex min-h-[60px] w-full items-center gap-3 px-4 py-2.5 text-left active:bg-raised">
                    <Avatar m={m} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{m.name}</p>
                      <p className="truncate text-xs text-muted">{m.plan} · {m.visits} visits · {lastVisit(m.lastVisitDaysAgo)}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        {rows.length === 0 && <EmptyState onReset={reset} />}
        <p className="tnum border-t border-line bg-raised/30 px-4 py-2.5 text-xs text-muted" aria-live="polite">{rows.length} of {members.length} members</p>
      </div>

      {createPortal(
        <AnimatePresence>{selected && <MemberPanel key={selected.id} m={selected} onClose={close} />}</AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
