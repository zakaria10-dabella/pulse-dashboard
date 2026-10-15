import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

export function formatValue(v, format) {
  if (format === 'madk') return `${(v / 1000).toFixed(1)}k`
  if (format === 'mad') return `${Math.round(v).toLocaleString('en-US')}`
  if (format === 'pct') return `${v.toFixed(1)}%`
  return Math.round(v).toLocaleString('en-US')
}

export default function CountUp({ value, format = 'int', duration = 0.9, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView || !ref.current) return
    if (reduce) {
      ref.current.textContent = formatValue(value, format)
      return
    }
    const controls = animate(value * 0.82, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = formatValue(v, format)
      },
    })
    return () => controls.stop()
  }, [inView, value, format, duration, reduce])

  return <span ref={ref} className={`tnum ${className}`}>{formatValue(value, format)}</span>
}
