import { motion } from 'framer-motion'

export default function PeakBars({ values, labels, now = 9 }) {
  const max = Math.max(...values)
  return (
    <div>
      <div className="flex h-36 items-end gap-1 sm:gap-1.5" role="img" aria-label={`Check-ins by hour today. Peak ${max} at ${labels[values.indexOf(max)]}.`}>
        {values.map((v, i) => {
          const peak = v === max
          const future = i > now
          return (
            <div key={labels[i]} className="group relative flex h-full flex-1 flex-col justify-end">
              <span className="tnum pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">{v}</span>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.025, ease: [0.4, 0, 0.2, 1] }}
                style={{ height: `${(v / max) * 100}%`, originY: 1 }}
                className={`w-full rounded-t-[3px] transition-colors ${peak ? 'bg-accent' : future ? 'bg-fg/[0.07] [background-image:repeating-linear-gradient(135deg,rgb(var(--fg)/.12)_0_1px,transparent_1px_5px)]' : 'bg-fg/20 group-hover:bg-fg/35'}`}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-1 border-t border-line pt-2 sm:gap-1.5">
        {labels.map((l) => <span key={l} className="flex-1 text-center text-[10px] text-faint">{l}</span>)}
      </div>
    </div>
  )
}
