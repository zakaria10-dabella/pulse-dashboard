import { useId } from 'react'
import { motion } from 'framer-motion'

/** Compact segmented control with a sliding thumb; arrow keys move the selection. */
export default function Segmented({ options, value, onChange, label, size = 'md' }) {
  const id = useId()
  const h = size === 'sm' ? 'h-7 text-xs' : 'h-8 text-[13px]'
  const onKey = (e) => {
    const i = options.findIndex((o) => (o.value ?? o) === value)
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = options[(i + step + options.length) % options.length]
    onChange(next.value ?? next)
    e.currentTarget.parentElement.querySelectorAll('[role=radio]')[(i + step + options.length) % options.length]?.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex shrink-0 rounded-md border border-line bg-raised p-0.5">
      {options.map((o) => {
        const v = o.value ?? o
        const on = v === value
        return (
          <button
            key={v}
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(v)}
            onKeyDown={onKey}
            className={`relative whitespace-nowrap rounded-[5px] px-2.5 font-medium transition-colors ${h} ${on ? 'text-fg' : 'text-muted hover:text-fg'}`}
          >
            {on && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-[5px] border border-line bg-surface shadow-[0_1px_1px_rgb(0_0_0/.04)]" transition={{ type: 'spring', stiffness: 600, damping: 44 }} />}
            <span className="relative">{o.label ?? o}{o.count !== undefined && <span className="tnum ml-1.5 text-faint">{o.count}</span>}</span>
          </button>
        )
      })}
    </div>
  )
}
