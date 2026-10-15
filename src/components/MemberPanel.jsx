import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, Dumbbell, MapPin, MessageCircle, Target, X } from 'lucide-react'
import { Avatar, formatDate, lastVisit, PlanTag, StatusBadge } from './ui'
import { planPrice } from '../data/members'

export default function MemberPanel({ m, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const max = Math.max(...m.weekly, 1)
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`${m.name} details`}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 38 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-line bg-surface"
      >
        <div className="relative overflow-hidden p-6 pb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-accent/5 to-transparent" />
          <div className="relative flex items-start justify-between">
            <Avatar m={m} size={64} />
            <motion.button whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} aria-label="Close panel" className="grid h-9 w-9 place-items-center rounded-full bg-raised">
              <X size={16} />
            </motion.button>
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative mt-4">
            <h2 className="font-display text-2xl font-bold">{m.name}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted">{m.id} · <PlanTag plan={m.plan} /> · <StatusBadge status={m.status} /></p>
          </motion.div>
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
          className="flex flex-1 flex-col gap-4 px-6 pb-6"
        >
          <motion.dl variants={item} className="grid grid-cols-2 gap-3 text-sm">
            {[
              [MapPin, 'Branch', m.branch],
              [Dumbbell, 'Coach', m.coach],
              [CalendarClock, 'Member since', formatDate(m.joined)],
              [Target, 'Goal', m.goal],
            ].map(([Icon, k, v]) => (
              <div key={k} className="rounded-xl bg-raised p-3">
                <dt className="flex items-center gap-1.5 text-xs text-muted"><Icon size={12} />{k}</dt>
                <dd className="mt-1 font-semibold">{v}</dd>
              </div>
            ))}
          </motion.dl>
          <motion.section variants={item} className="rounded-xl border border-line p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">Check-ins, last 8 weeks</h3>
              <span className="text-xs text-muted">Last visit: {lastVisit(m.lastVisitDaysAgo)}</span>
            </div>
            <div className="mt-4 flex h-24 items-end gap-2">
              {m.weekly.map((w, i) => (
                <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.35 + i * 0.05, type: 'spring', stiffness: 140, damping: 16 }} style={{ height: `${Math.max(4, (w / max) * 100)}%`, originY: 1 }} className={`flex-1 rounded-md ${i === 7 ? 'bg-accent' : 'bg-accent/30'}`} title={`${w} visits`} />
              ))}
            </div>
          </motion.section>
          <motion.section variants={item} className="flex items-center justify-between rounded-xl border border-line p-4 text-sm">
            <div>
              <p className="text-muted">Monthly plan</p>
              <p className="font-display text-lg font-bold">{planPrice[m.plan]} MAD</p>
            </div>
            <div className="text-right">
              <p className="text-muted">Visits this month</p>
              <p className="font-display text-lg font-bold">{m.visits}</p>
            </div>
          </motion.section>
          <motion.div variants={item} className="mt-auto grid grid-cols-2 gap-3 pt-2">
            <motion.button whileTap={{ scale: 0.96 }} className="flex items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold hover:bg-raised">
              <MessageCircle size={16} /> Message
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} className="rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-glow hover:brightness-110">
              {m.status === 'Overdue' ? 'Send reminder' : 'Book session'}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.aside>
    </>
  )
}

const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }
