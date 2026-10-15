import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const W = 720
const H = 260
const P = { t: 12, r: 8, b: 26, l: 44 }

function smooth(points) {
  return points.reduce((acc, p, i, a) => {
    if (i === 0) return `M${p[0]},${p[1]}`
    const p0 = a[i - 2] || a[i - 1]
    const p1 = a[i - 1]
    const p3 = a[i + 1] || p
    const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6]
    const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6]
    return `${acc} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p[0]},${p[1]}`
  }, '')
}

export default function AreaChart({ data, label }) {
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

  const pick = (clientX) => {
    const r = svgRef.current.getBoundingClientRect()
    const px = ((clientX - r.left) / r.width) * W
    let best = 0
    pts.forEach((p, i) => { if (Math.abs(p[0] - px) < Math.abs(pts[best][0] - px)) best = i })
    setHover(best)
  }

  const onKey = (e) => {
    if (e.key === 'ArrowRight') setHover((h) => Math.min(data.length - 1, (h ?? -1) + 1))
    if (e.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? data.length) - 1))
    if (e.key === 'Escape') setHover(null)
  }

  const active = hover ?? data.length - 1
  const prev = data[active - 1]
  const change = prev ? ((data[active].v - prev.v) / prev.v) * 100 : null

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3 px-4">
        <p className="tnum text-2xl font-semibold tracking-tight">{(data[active].v * 1000).toLocaleString('en-US')} <span className="text-sm font-normal text-muted">MAD</span></p>
        <p className="text-xs text-muted">
          {data[active].m} {data[active].y}
          {change !== null && <span className={`tnum ml-2 font-medium ${change >= 0 ? 'text-up' : 'text-down'}`}>{change >= 0 ? '+' : '−'}{Math.abs(change).toFixed(1)}% MoM</span>}
        </p>
      </div>
      <div className="relative px-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-pan-y outline-none"
          onPointerMove={(e) => pick(e.clientX)}
          onPointerLeave={() => setHover(null)}
          onKeyDown={onKey}
          tabIndex={0}
          role="img"
          aria-label={`${label}. Use left and right arrow keys to read each month.`}
        >
          <defs>
            <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgb(var(--accent))" stopOpacity=".14" />
              <stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t, i) => (
            <g key={t.v}>
              <line x1={P.l} x2={W - P.r} y1={t.y} y2={t.y} stroke="rgb(var(--line))" strokeDasharray={i === 0 ? undefined : '2 4'} />
              <text x={P.l - 10} y={t.y + 4} textAnchor="end" className="tnum fill-faint text-[11px]">{Math.round(t.v)}k</text>
            </g>
          ))}
          {data.map((d, i) => (
            <text key={d.m + d.y} x={x(i)} y={H - 6} textAnchor="middle" className={`text-[11px] ${hover === i ? 'fill-fg' : 'fill-faint'}`}>{d.m}</text>
          ))}
          <motion.path key={`a-${data.length}`} d={area} fill="url(#area-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} />
          <motion.path key={`l-${data.length}`} d={line} fill="none" stroke="rgb(var(--accent))" strokeWidth="1.75" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }} />
          {hover !== null && (
            <g>
              <line x1={pts[hover][0]} x2={pts[hover][0]} y1={P.t} y2={H - P.b} stroke="rgb(var(--fg))" strokeOpacity=".18" />
              <circle cx={pts[hover][0]} cy={pts[hover][1]} r="4" fill="rgb(var(--surface))" stroke="rgb(var(--accent))" strokeWidth="2" />
            </g>
          )}
          {hover === null && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" fill="rgb(var(--accent))" />}
        </svg>
      </div>
    </div>
  )
}
