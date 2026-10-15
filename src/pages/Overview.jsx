import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import KpiCard from '../components/KpiCard'
import AreaChart from '../components/AreaChart'
import PlanMix from '../components/PlanMix'
import PeakBars from '../components/PeakBars'
import Segmented from '../components/Segmented'
import { Avatar, lastVisit, PageHeader, StatusBadge } from '../components/ui'
import { kpis, peakHours, peakLabels, planMix, revenue } from '../data/stats'
import { members } from '../data/members'
import { schedule, typeColor } from '../data/schedule'

const fade = (i = 0) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: i * 0.05, ease: [0.4, 0, 0.2, 1] } })

export default function Overview() {
  const [range, setRange] = useState('12M')
  const data = range === '12M' ? revenue : revenue.slice(-6)
  const recent = [...members].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 5)
  const overdue = members.filter((m) => m.status === 'Overdue').length
  const today = schedule.Thu

  return (
    <div className="space-y-6">
      <PageHeader title="Good evening, Salma" meta="Thursday 16 October · Maarif, Anfa and Ain Diab">
        <button className="btn-ghost"><Download size={14} /> Export</button>
        <Link to="/members?status=Overdue" className="btn-primary">Review {overdue} overdue <ArrowRight size={14} /></Link>
      </PageHeader>

      <motion.section {...fade(1)} aria-label="Key figures" className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line xl:grid-cols-4">
        {kpis.map((k) => <KpiCard key={k.id} kpi={k} />)}
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-3">
        <motion.section {...fade(2)} className="panel pb-3 xl:col-span-2">
          <div className="panel-head mb-4">
            <div>
              <h2 className="h-section">Revenue</h2>
              <p className="text-xs text-muted">Memberships and personal training</p>
            </div>
            <Segmented size="sm" label="Range" options={['6M', '12M']} value={range} onChange={setRange} />
          </div>
          <AreaChart data={data} label={`Monthly revenue over the last ${range === '12M' ? 12 : 6} months, in thousands of MAD`} />
        </motion.section>
        <motion.section {...fade(3)} className="panel flex flex-col">
          <div className="panel-head">
            <div>
              <h2 className="h-section">Plan mix</h2>
              <p className="text-xs text-muted">1,284 active members</p>
            </div>
          </div>
          <div className="flex-1 p-4"><PlanMix data={planMix} total={1284} /></div>
          <dl className="grid grid-cols-3 border-t border-line text-[13px]">
            {[['Renewals', '42', 'due this week'], ['Upgrades', '18', 'this month'], ['Cancelled', '9', 'this month']].map(([k, v, sub]) => (
              <div key={k} className="border-r border-line px-4 py-3 last:border-r-0">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="tnum mt-1 text-lg font-semibold leading-none">{v}</dd>
                <dd className="mt-1 text-2xs text-faint">{sub}</dd>
              </div>
            ))}
          </dl>
        </motion.section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <motion.section {...fade(4)} className="panel">
          <div className="panel-head">
            <div>
              <h2 className="h-section">Check-ins by hour</h2>
              <p className="text-xs text-muted">Today, all branches</p>
            </div>
            <span className="flex items-center gap-1.5 text-2xs text-muted"><span className="h-2 w-2 rounded-[2px] bg-fg/10 [background-image:repeating-linear-gradient(135deg,rgb(var(--fg)/.25)_0_1px,transparent_1px_3px)]" />Forecast</span>
          </div>
          <div className="p-4 pt-6"><PeakBars values={peakHours} labels={peakLabels} /></div>
        </motion.section>

        <motion.section {...fade(5)} className="panel">
          <div className="panel-head">
            <h2 className="h-section">New members</h2>
            <Link to="/members" className="text-xs font-medium text-muted hover:text-fg">View all</Link>
          </div>
          <ul className="divide-y divide-line">
            {recent.map((m) => (
              <li key={m.id}>
                <Link to={`/members?id=${m.id}`} className="flex min-h-[52px] items-center gap-3 px-4 py-2 transition-colors hover:bg-raised/60">
                  <Avatar m={m} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{m.name}</p>
                    <p className="truncate text-xs text-muted">{m.plan} · {m.branch} · {lastVisit(m.lastVisitDaysAgo)}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section {...fade(6)} className="panel lg:col-span-2 xl:col-span-1">
          <div className="panel-head">
            <h2 className="h-section">Up next, Maarif</h2>
            <Link to="/schedule" className="text-xs font-medium text-muted hover:text-fg">Schedule</Link>
          </div>
          <ul className="divide-y divide-line">
            {today.slice(0, 5).map((c) => {
              const pct = c.booked / c.capacity
              return (
                <li key={c.id} className="grid min-h-[52px] grid-cols-[48px_1fr_auto] items-center gap-3 px-4 py-2">
                  <span className="tnum font-mono text-xs text-muted">{c.time}</span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate text-[13px] font-medium"><span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: typeColor[c.type] }} />{c.name}</p>
                    <p className="truncate text-xs text-muted">{c.coach} · {c.room}</p>
                  </div>
                  <div className="w-16 text-right">
                    <p className="tnum text-xs font-medium">{c.booked}<span className="text-faint">/{c.capacity}</span></p>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-raised"><div className={`h-full ${pct >= 1 ? 'bg-down' : pct > 0.8 ? 'bg-accent' : 'bg-fg/40'}`} style={{ width: `${pct * 100}%` }} /></div>
                  </div>
                </li>
              )
            })}
          </ul>
        </motion.section>
      </div>
    </div>
  )
}
