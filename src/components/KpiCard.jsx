import CountUp from './CountUp'
import { Delta } from './ui'

function Spark({ data }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((d, i) => [(i / (data.length - 1)) * 100, 28 - ((d - min) / (max - min || 1)) * 24])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  return (
    <svg viewBox="0 0 100 32" className="h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" stroke="rgb(var(--fg))" strokeOpacity=".35" strokeWidth="1.25" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={pts.at(-1)[0]} cy={pts.at(-1)[1]} r="2" fill="rgb(var(--fg))" />
    </svg>
  )
}

const unit = { madk: 'MAD', mad: 'MAD' }

export default function KpiCard({ kpi }) {
  return (
    <article className="flex flex-col gap-3 bg-surface p-4 sm:p-5">
      <p className="text-[13px] text-muted">{kpi.label}</p>
      <p className="flex items-baseline gap-1.5">
        <CountUp value={kpi.value} format={kpi.format} className="whitespace-nowrap text-[26px] font-semibold leading-none tracking-tight" />
        {unit[kpi.format] && <span className="text-xs text-muted">{unit[kpi.format]}</span>}
      </p>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted"><Delta value={kpi.delta} /> <span className="hidden sm:inline">vs Sep</span></p>
        <div className="w-16 sm:w-20"><Spark data={kpi.spark} /></div>
      </div>
    </article>
  )
}
