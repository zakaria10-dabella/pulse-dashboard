import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

export function formatValue(v, format) {
  if (format === 'madk') return `${(v / 1000).toFixed(1)}k MAD`
  if (format === 'mad') return `${Math.round(v).toLocaleString('en-US')} MAD`
  if (format === 'pct') return `${v.toFixed(1)}%`
  return Math.round(v).toLocaleString('en-US')
}

export default function CountUp({ value, format = 'int', duration = 1.6, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView || !ref.current) return
    if (reduce) {
      ref.current.textContent = formatValue(value, format)
      return
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = formatValue(v, format)
      },
    })
    return () => controls.stop()
  }, [inView, value, format, duration, reduce])

  return <span ref={ref} className={`tnum ${className}`}>{formatValue(0, format)}</span>
}
