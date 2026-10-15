import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Clock, Flame } from 'lucide-react'
import KpiCard from '../components/KpiCard'
import AreaChart from '../components/AreaChart'
import PlanDonut from '../components/PlanDonut'
import PeakBars from '../components/PeakBars'
import { Avatar, lastVisit, StatusBadge } from '../components/ui'
import { kpis, peakHours, peakLabels, planMix, revenue } from '../data/stats'
import { members } from '../data/members'
import { schedule, typeColor } from '../data/schedule'
import { hasWebGL } from '../three/webgl'

const Dumbbell = lazy(() => import('../three/Dumbbell'))

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }

function Hero() {
  const [webgl] = useState(hasWebGL)
  const { scrollY } = useScroll()
  const tilt = useTransform(scrollY, [0, 400], [0, 1.2])
  const y = useTransform(scrollY, [0, 400], [0, 60])
  return (
    <motion.section variants={rise} className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#120F22] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_10%,#5B2EE0_0%,rgba(91,46,224,.25)_35%,transparent_60%)]" />
      <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-lime/20 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative grid items-center md:grid-cols-[1.2fr_1fr]">
        <div className="p-6 sm:p-10">
          <span className="chip border border-white/15 bg-white/5 text-white/80 backdrop-blur"><Flame size={12} className="text-lime" /> 12-day streak of record check-ins</span>
          <h1 className="mt-5 font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Good evening, Salma.
            <br />
            <span className="bg-gradient-to-r from-[#C9B5FF] via-white to-lime bg-clip-text text-transparent">The floor is buzzing.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/65 sm:text-base">342 members checked in today across Maarif, Anfa and Ain Diab. Peak traffic expected at 7 pm.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/members" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#141220]">
                Review overdue <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/schedule" className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">Today’s classes</Link>
            </motion.div>
          </div>
        </div>
        <motion.div style={{ y }} className="relative h-56 sm:h-72 md:h-full md:min-h-[320px]">
          {webgl ? (
            <Suspense fallback={null}>
              <Dumbbell progress={tilt} />
            </Suspense>
          ) : (
            <div className="absolute inset-10 rounded-full bg-accent/30 blur-2xl" />
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default function Overview() {
  const [range, setRange] = useState('12M')
  const data = range === '12M' ? revenue : revenue.slice(-6)
  const recent = [...members].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 5)
  const today = schedule.Thu

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">
      <Hero />

      <motion.div variants={stagger} className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {kpis.map((k, i) => <KpiCard key={k.id} kpi={k} index={i} />)}
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-3">
        <motion.section variants={rise} className="card p-5 xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold">Revenue</h2>
              <p className="text-sm text-muted">Memberships + personal training, in MAD</p>
            </div>
            <div className="flex rounded-xl bg-raised p-1" role="tablist" aria-label="Range">
              {['6M', '12M'].map((r) => (
                <button key={r} role="tab" aria-selected={range === r} onClick={() => setRange(r)} className="relative rounded-lg px-3 py-1.5 text-xs font-semibold">
                  {range === r && <motion.span layoutId="range-pill" className="absolute inset-0 rounded-lg bg-surface shadow" transition={{ type: 'spring', stiffness: 450, damping: 34 }} />}
                  <span className="relative">{r}</span>
                </button>
              ))}
            </div>
          </div>
          <AreaChart data={data} />
        </motion.section>
        <motion.section variants={rise} className="card flex flex-col p-5">
          <h2 className="font-display text-lg font-semibold">Plan mix</h2>
          <p className="mb-5 text-sm text-muted">1,284 active members</p>
          <div className="flex flex-1 items-center"><PlanDonut data={planMix} /></div>
        </motion.section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <motion.section variants={rise} className="card p-5">
          <h2 className="font-display text-lg font-semibold">Peak hours</h2>
          <p className="mb-5 text-sm text-muted">Check-ins by hour, today</p>
          <PeakBars values={peakHours} labels={peakLabels} />
        </motion.section>
        <motion.section variants={rise} className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">New members</h2>
            <Link to="/members" className="text-xs font-semibold text-accent hover:underline">View all</Link>
          </div>
          <ul className="space-y-1">
            {recent.map((m, i) => (
              <motion.li key={m.id} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-raised">
                <Avatar m={m} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-muted">{m.branch} · {lastVisit(m.lastVisitDaysAgo)}</p>
                </div>
                <StatusBadge status={m.status} />
              </motion.li>
            ))}
          </ul>
        </motion.section>
        <motion.section variants={rise} className="card p-5 lg:col-span-2 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Up next today</h2>
            <Link to="/schedule" className="text-xs font-semibold text-accent hover:underline">Schedule</Link>
          </div>
          <ul className="space-y-3">
            {today.slice(0, 4).map((c, i) => (
              <motion.li key={c.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex items-center gap-3">
                <span className="h-10 w-1 rounded-full" style={{ background: typeColor[c.type] }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted"><Clock size={11} /> {c.time} · {c.coach}</p>
                </div>
                <span className="tnum text-xs font-semibold">{c.booked}/{c.capacity}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </div>
    </motion.div>
  )
}
