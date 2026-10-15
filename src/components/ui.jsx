export function Avatar({ m, size = 36 }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-display text-xs font-bold text-white"
      style={{ width: size, height: size, background: `linear-gradient(135deg, hsl(${m.hue} 80% 62%), hsl(${m.hue + 40} 70% 45%))` }}
      aria-hidden="true"
    >
      {m.initials}
    </span>
  )
}

const statusStyle = {
  Active: 'bg-lime/15 text-[#5E8A00] dark:text-lime',
  Paused: 'bg-sky/15 text-[#1F86BF] dark:text-sky',
  Overdue: 'bg-coral/15 text-coral',
}

export function StatusBadge({ status }) {
  return (
    <span className={`chip ${statusStyle[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

const planStyle = { Basic: 'text-sky', Premium: 'text-accent', Elite: 'text-[#7FAF00] dark:text-lime' }
export function PlanTag({ plan }) {
  return <span className={`text-xs font-semibold ${planStyle[plan]}`}>{plan}</span>
}

export function lastVisit(days) {
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
