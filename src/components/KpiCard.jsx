import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import CountUp from './CountUp'

function Spark({ data, up }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((d, i) => [(i / (data.length - 1)) * 100, 30 - ((d - min) / (max - min || 1)) * 26 - 2])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const color = up ? '#C6F432' : '#FF6B6B'
  return (
    <svg viewBox="0 0 100 32" className="hidden h-10 w-20 shrink-0 sm:block" preserveAspectRatio="none" aria-hidden="true">
      <motion.path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.4, ease: 'easeInOut' }} />
    </svg>
  )
}

export default function KpiCard({ kpi, index }) {
  const up = kpi.delta >= 0
  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="card group relative overflow-hidden p-4 sm:p-5"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/0 blur-2xl transition-colors duration-500 group-hover:bg-accent/25" />
      <p className="text-xs text-muted sm:text-sm">{kpi.label}</p>
      <div className="mt-3 flex items-end justify-between gap-2">
        <CountUp value={kpi.value} format={kpi.format} duration={1.4 + index * 0.15} className="whitespace-nowrap font-display text-xl font-bold tracking-tight sm:text-2xl" />
        <Spark data={kpi.spark} up={up} />
      </div>
      <p className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${up ? 'text-[#7FAF00] dark:text-lime' : 'text-coral'}`}>
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(kpi.delta)}% <span className="hidden font-normal text-muted sm:inline">vs last month</span>
      </p>
    </motion.article>
  )
}
