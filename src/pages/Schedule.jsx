import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { dates, days, schedule, typeColor } from '../data/schedule'
import { PageHeader } from '../components/ui'

const end = (time, mins) => {
  const [h, m] = time.split(':').map(Number)
  const t = h * 60 + m + mins
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

export default function Schedule() {
  const [day, setDay] = useState('Thu')
  const classes = schedule[day]
  const booked = classes.reduce((s, c) => s + c.booked, 0)
  const capacity = classes.reduce((s, c) => s + c.capacity, 0)
  const full = classes.filter((c) => c.booked >= c.capacity).length

  const onKey = (e) => {
    const i = days.indexOf(day)
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    const next = days[(i + step + days.length) % days.length]
    setDay(next)
    document.getElementById(`day-${next}`)?.focus()
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Schedule" meta="Week of 13 October · Maarif branch">
        <button className="btn-primary"><Plus size={14} /> New class</button>
      </PageHeader>

      <div className="grid grid-cols-7 overflow-hidden rounded-lg border border-line bg-surface" role="tablist" aria-label="Day of the week">
        {days.map((d) => {
          const on = day === d
          const list = schedule[d]
          const load = list.reduce((s, c) => s + c.booked, 0) / list.reduce((s, c) => s + c.capacity, 0)
          return (
            <button
              key={d}
              id={`day-${d}`}
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setDay(d)}
              onKeyDown={onKey}
              className={`relative flex min-h-[64px] flex-col items-center justify-center gap-0.5 border-r border-line px-1 py-2 transition-colors last:border-r-0 sm:items-start sm:px-4 ${on ? 'bg-raised/70' : 'hover:bg-raised/40'}`}
            >
              <span className={`text-2xs uppercase tracking-[0.06em] ${on ? 'text-fg' : 'text-muted'}`}>{d}</span>
              <span className={`tnum text-lg font-semibold leading-none ${on ? 'text-fg' : 'text-muted'}`}>{dates[d]}</span>
              <span className="tnum hidden text-2xs text-faint sm:block">{list.length} classes · {Math.round(load * 100)}%</span>
              {on && <motion.span layoutId="day-bar" className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" transition={{ type: 'spring', stiffness: 600, damping: 44 }} />}
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="panel overflow-hidden">
          <div className="hidden grid-cols-[92px_1fr_120px_150px] gap-4 border-b border-line bg-raised/50 px-4 py-2 text-xs font-medium text-muted md:grid">
            <span>Time</span><span>Class</span><span>Room</span><span className="text-right">Booked</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul key={day} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="divide-y divide-line">
              {classes.map((c) => {
                const pct = c.booked / c.capacity
                const isFull = c.booked >= c.capacity
                return (
                  <li key={c.id} className="grid grid-cols-[64px_1fr] gap-x-4 gap-y-2 px-4 py-3.5 md:grid-cols-[92px_1fr_120px_150px] md:items-center">
                    <div className="tnum font-mono text-[13px]">
                      <span className="text-fg">{c.time}</span>
                      <span className="block text-xs text-faint">{end(c.time, c.duration)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{c.name}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full align-middle" style={{ background: typeColor[c.type] }} />
                        {c.type} · {c.coach} · {c.duration} min<span className="md:hidden"> · {c.room}</span>
                      </p>
                    </div>
                    <span className="hidden text-[13px] text-muted md:block">{c.room}</span>
                    <div className="col-start-2 md:col-start-auto">
                      <div className="flex items-center justify-between text-xs md:justify-end md:gap-2">
                        {isFull ? <span className="font-medium text-down">Full · waitlist</span> : <span className="text-muted md:hidden">{c.capacity - c.booked} spots left</span>}
                        <span className="tnum font-medium">{c.booked}<span className="text-faint">/{c.capacity}</span></span>
                      </div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-raised">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} className={`h-full rounded-full ${isFull ? 'bg-down' : pct > 0.8 ? 'bg-accent' : 'bg-fg/40'}`} />
                      </div>
                    </div>
                  </li>
                )
              })}
            </motion.ul>
          </AnimatePresence>
        </div>

        <aside className="panel h-fit p-4" aria-label="Day summary">
          <p className="eyebrow">{day} {dates[day]} Oct</p>
          <p className="tnum mt-3 text-[26px] font-semibold leading-none tracking-tight">{booked}<span className="text-base font-normal text-faint"> / {capacity}</span></p>
          <p className="mt-1 text-xs text-muted">spots booked</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-raised">
            <motion.div className="h-full rounded-full bg-fg" animate={{ width: `${(booked / capacity) * 100}%` }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} />
          </div>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[13px]">
            <div className="flex justify-between"><dt className="text-muted">Classes</dt><dd className="tnum">{classes.length}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Fully booked</dt><dd className="tnum">{full}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Fill rate</dt><dd className="tnum">{Math.round((booked / capacity) * 100)}%</dd></div>
          </dl>
          <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-xs text-muted">
            {Object.entries(typeColor).map(([t, col]) => (
              <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: col }} />{t}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
