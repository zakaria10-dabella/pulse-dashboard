import { motion } from 'framer-motion'

export default function PeakBars({ values, labels }) {
  const max = Math.max(...values)
  return (
    <div className="flex h-40 items-end gap-1.5 sm:gap-2" role="img" aria-label="Check-ins by hour today">
      {values.map((v, i) => {
        const peak = v === max
        return (
          <div key={labels[i]} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="tnum text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">{v}</span>
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 120, damping: 16, delay: i * 0.04 }}
              style={{ height: `${(v / max) * 100}%`, originY: 1 }}
              className={`w-full rounded-md ${peak ? 'bg-lime' : 'bg-accent/30 group-hover:bg-accent/70'} transition-colors`}
            />
            <span className="text-[10px] text-muted">{labels[i]}</span>
          </div>
        )
      })}
    </div>
  )
}
