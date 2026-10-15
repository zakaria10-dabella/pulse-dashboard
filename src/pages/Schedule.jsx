import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, DoorOpen, Users } from 'lucide-react'
import { days, schedule, typeColor } from '../data/schedule'

export default function Schedule() {
  const [day, setDay] = useState('Thu')
  const classes = schedule[day]
  const booked = classes.reduce((s, c) => s + c.booked, 0)
  const capacity = classes.reduce((s, c) => s + c.capacity, 0)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Schedule</h1>
          <p className="mt-1 text-sm text-muted">Week of 13 Oct · Maarif branch</p>
        </div>
        <div className="card flex items-center gap-4 px-4 py-3">
          <div>
            <p className="text-xs text-muted">Booked spots</p>
            <p className="tnum font-display text-lg font-bold">{booked}<span className="text-sm text-muted">/{capacity}</span></p>
          </div>
          <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(var(--raised))" strokeWidth="4" />
            <motion.circle cx="18" cy="18" r="15" fill="none" stroke="#C6F432" strokeWidth="4" strokeLinecap="round" animate={{ pathLength: booked / capacity }} initial={{ pathLength: 0 }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} />
          </svg>
        </div>
      </motion.div>

      <div className="scrollbar-none -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-1 border-b border-line" role="tablist" aria-label="Day">
          {days.map((d) => (
            <button key={d} role="tab" aria-selected={day === d} onClick={() => setDay(d)} className={`relative px-5 py-3 text-sm font-semibold transition-colors ${day === d ? 'text-fg' : 'text-muted hover:text-fg'}`}>
              {d}
              <span className="ml-1.5 text-xs font-normal opacity-60">{schedule[d].length}</span>
              {day === d && <motion.span layoutId="day-underline" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={day}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {classes.map((c) => {
            const pct = c.booked / c.capacity
            const full = c.booked >= c.capacity
            return (
              <motion.li
                key={c.id}
                variants={{ hidden: { opacity: 0, y: 20, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1 } }}
                whileHover={{ y: -4 }}
                className="card group relative overflow-hidden p-5"
              >
                <span className="absolute inset-y-0 left-0 w-1" style={{ background: typeColor[c.type] }} />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="chip" style={{ background: `${typeColor[c.type]}22`, color: typeColor[c.type] }}>{c.type}</span>
                    <h2 className="mt-3 font-display text-lg font-semibold">{c.name}</h2>
                    <p className="text-sm text-muted">{c.coach}</p>
                  </div>
                  <p className="tnum font-display text-2xl font-bold">{c.time}</p>
                </div>
                <div className="mt-5 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1"><Clock size={12} /> {c.duration} min</span>
                  <span className="flex items-center gap-1"><DoorOpen size={12} /> {c.room}</span>
                  <span className="ml-auto flex items-center gap-1 font-semibold text-fg"><Users size={12} /> {c.booked}/{c.capacity}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-raised">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className={`h-full rounded-full ${full ? 'bg-coral' : pct > 0.8 ? 'bg-[#FFB547]' : 'bg-accent'}`} />
                </div>
                {full && <p className="mt-2 text-xs font-semibold text-coral">Full · waitlist open</p>}
              </motion.li>
            )
          })}
        </motion.ul>
      </AnimatePresence>
    </div>
  )
}
