import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { Avatar, formatDate, lastVisit, StatusBadge } from './ui'
import { planPrice } from '../data/members'

export default function MemberPanel({ m, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [onClose])

  const max = Math.max(...m.weekly, 1)
  const facts = [
    ['Member ID', <span key="id" className="font-mono text-xs">{m.id}</span>],
    ['Plan', `${m.plan} · ${planPrice[m.plan]} MAD/mo`],
    ['Branch', m.branch],
    ['Coach', m.coach],
    ['Goal', m.goal],
    ['Member since', formatDate(m.joined)],
    ['Visits this month', m.visits],
    ['Last visit', lastVisit(m.lastVisitDaysAgo)],
  ]
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/30" />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-title"
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 24, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l border-line bg-surface shadow-pop"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5">
          <span className="text-xs text-muted">Members / <span className="text-fg">{m.name}</span></span>
          <button ref={closeRef} onClick={onClose} aria-label="Close panel" className="icon-btn h-10 w-10"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-4 px-5 py-5">
            <Avatar m={m} size={48} />
            <div className="min-w-0">
              <h2 id="member-title" className="truncate text-lg font-semibold tracking-tight">{m.name}</h2>
              <div className="mt-1"><StatusBadge status={m.status} /></div>
            </div>
          </div>
          <dl className="border-y border-line px-5 py-2 text-[13px]">
            {facts.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 py-2">
                <dt className="text-muted">{k}</dt>
                <dd className="tnum text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <section className="px-5 py-5">
            <div className="flex items-baseline justify-between">
              <h3 className="h-section">Check-ins, last 8 weeks</h3>
              <span className="tnum text-xs text-muted">{m.weekly.reduce((a, b) => a + b, 0)} total</span>
            </div>
            <div className="mt-4 flex h-24 items-end gap-1.5 border-b border-line">
              {m.weekly.map((w, i) => (
                <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.1 + i * 0.03, duration: 0.35, ease: [0.4, 0, 0.2, 1] }} style={{ height: `${Math.max(3, (w / max) * 100)}%`, originY: 1 }} className={`flex-1 rounded-t-[3px] ${i === 7 ? 'bg-accent' : 'bg-fg/20'}`} title={`${w} visits`} />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-faint"><span>8 wk ago</span><span>This week</span></div>
          </section>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-line p-4">
          <button className="btn-ghost h-10"><MessageCircle size={14} /> WhatsApp</button>
          <button className="btn-primary h-10">{m.status === 'Overdue' ? 'Send payment reminder' : 'Book a session'}</button>
        </div>
      </motion.aside>
    </>
  )
}
