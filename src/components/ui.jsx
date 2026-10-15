export function Avatar({ m, size = 28 }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-raised font-medium text-muted ring-1 ring-line"
      style={{ width: size, height: size, fontSize: size > 40 ? 15 : 11 }}
      aria-hidden="true"
    >
      {m.initials}
    </span>
  )
}

const statusDot = { Active: 'bg-up', Paused: 'bg-faint', Overdue: 'bg-down' }
const statusText = { Active: 'text-fg', Paused: 'text-muted', Overdue: 'text-down' }

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-2 text-xs font-medium ${statusText[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  )
}

export function PlanTag({ plan }) {
  return <span className="text-[13px] text-fg">{plan}</span>
}

export function Delta({ value, suffix = '%' }) {
  const up = value >= 0
  return (
    <span className={`tnum inline-flex items-center text-xs font-medium ${up ? 'text-up' : 'text-down'}`}>
      {up ? '+' : '−'}{Math.abs(value)}{suffix}
    </span>
  )
}

export function lastVisit(days) {
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function PageHeader({ title, meta, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight sm:text-[22px]">{title}</h1>
        {meta && <p className="mt-1 text-[13px] text-muted">{meta}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
