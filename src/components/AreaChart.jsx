import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const W = 640
const H = 240
const P = { t: 16, r: 12, b: 28, l: 40 }

function smooth(points) {
  // Catmull-Rom to cubic Bézier for a soft, hand-drawn curve
  return points.reduce((acc, p, i, a) => {
    if (i === 0) return `M${p[0]},${p[1]}`
    const p0 = a[i - 2] || a[i - 1]
    const p1 = a[i - 1]
    const p2 = p
    const p3 = a[i + 1] || p
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    return `${acc} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`
  }, '')
}

export default function AreaChart({ data }) {
  const [hover, setHover] = useState(null)
  const svgRef = useRef(null)
  const { pts, line, area, ticks, x } = useMemo(() => {
    const max = Math.ceil(Math.max(...data.map((d) => d.v)) / 100) * 100
    const min = Math.max(0, Math.floor(Math.min(...data.map((d) => d.v)) / 100) * 100 - 100)
    const x = (i) => P.l + (i / (data.length - 1)) * (W - P.l - P.r)
    const y = (v) => P.t + (1 - (v - min) / (max - min)) * (H - P.t - P.b)
    const pts = data.map((d, i) => [x(i), y(d.v)])
    const line = smooth(pts)
    const area = `${line} L${pts[pts.length - 1][0]},${H - P.b} L${pts[0][0]},${H - P.b} Z`
    const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) / 4) * i).map((v) => ({ v, y: y(v) }))
    return { pts, line, area, ticks, x }
  }, [data])

  const onMove = (e) => {
    const r = svgRef.current.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    let best = 0
    pts.forEach((p, i) => { if (Math.abs(p[0] - px) < Math.abs(pts[best][0] - px)) best = i })
    setHover(best)
  }

  return (
    <div className="relative">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-none" onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img" aria-label="Monthly revenue, thousands of MAD">
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--accent))" stopOpacity=".45" />
            <stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="area-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5CC8FF" />
            <stop offset=".6" stopColor="rgb(var(--accent))" />
            <stop offset="1" stopColor="#C6F432" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t.v}>
            <line x1={P.l} x2={W - P.r} y1={t.y} y2={t.y} stroke="rgb(var(--line))" strokeDasharray="3 5" />
            <text x={P.l - 8} y={t.y + 4} textAnchor="end" className="fill-muted text-[11px]">{Math.round(t.v)}k</text>
          </g>
        ))}
        {data.map((d, i) => (
          <text key={d.m} x={x(i)} y={H - 8} textAnchor="middle" className={`text-[11px] ${hover === i ? 'fill-fg font-semibold' : 'fill-muted'}`}>{d.m}</text>
        ))}
        <motion.path key={`a-${data.length}`} d={area} fill="url(#area-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} />
        <motion.path key={`l-${data.length}`} d={line} fill="none" stroke="url(#area-stroke)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }} />
        <AnimatePresence>
          {hover !== null && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line animate={{ x1: pts[hover][0], x2: pts[hover][0] }} y1={P.t} y2={H - P.b} stroke="rgb(var(--accent))" strokeOpacity=".5" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
              <motion.circle animate={{ cx: pts[hover][0], cy: pts[hover][1] }} r="6" fill="rgb(var(--surface))" stroke="rgb(var(--accent))" strokeWidth="3" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      <AnimatePresence>
        {hover !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, left: `${(pts[hover][0] / W) * 100}%`, top: `${(pts[hover][1] / H) * 100}%` }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            style={{ x: '-50%', y: 'calc(-100% - 14px)' }}
            className="pointer-events-none absolute rounded-xl border border-line bg-surface/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
          >
            <p className="text-muted">{data[hover].m} 2025</p>
            <p className="tnum font-display text-sm font-bold">{(data[hover].v * 1000).toLocaleString('en-US')} MAD</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
