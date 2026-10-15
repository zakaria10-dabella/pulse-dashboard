import { motion } from 'framer-motion'

export default function PlanDonut({ data }) {
  const r = 52
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0 -rotate-90" aria-label="Membership plan mix" role="img">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgb(var(--raised))" strokeWidth="16" />
        {data.map((d, i) => {
          const len = (d.share / 100) * c
          const el = (
            <motion.circle
              key={d.plan}
              cx="70" cy="70" r={r} fill="none" stroke={d.color} strokeWidth="16" strokeLinecap="butt"
              strokeDasharray={`${len - 3} ${c}`}
              initial={{ strokeDashoffset: -offset + len }}
              whileInView={{ strokeDashoffset: -offset }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          )
          offset += len
          return el
        })}
      </svg>
      <ul className="space-y-3 text-sm">
        {data.map((d) => (
          <li key={d.plan} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="w-16 text-muted">{d.plan}</span>
            <span className="tnum font-semibold">{d.share}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
