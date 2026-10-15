import { motion } from 'framer-motion'
import { planPrice } from '../data/members'

const tone = ['bg-accent', 'bg-fg/60', 'bg-fg/20']

export default function PlanMix({ data, total }) {
  return (
    <div>
      <div className="flex h-2 gap-0.5 overflow-hidden rounded-sm" role="img" aria-label={data.map((d) => `${d.plan} ${d.share}%`).join(', ')}>
        {data.map((d, i) => (
          <motion.span key={d.plan} className={`${tone[i]} h-full first:rounded-l-sm last:rounded-r-sm`} initial={{ width: 0 }} animate={{ width: `${d.share}%` }} transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.4, 0, 0.2, 1] }} />
        ))}
      </div>
      <table className="mt-5 w-full text-[13px]">
        <thead>
          <tr className="text-left text-2xs uppercase tracking-[0.06em] text-muted">
            <th scope="col" className="pb-2 font-medium">Plan</th>
            <th scope="col" className="pb-2 text-right font-medium">Members</th>
            <th scope="col" className="pb-2 text-right font-medium">Share</th>
            <th scope="col" className="pb-2 text-right font-medium">MAD / mo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d.plan} className="border-t border-line">
              <td className="py-2.5"><span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-[2px] ${tone[i]}`} />{d.plan}</span></td>
              <td className="tnum py-2.5 text-right">{Math.round((total * d.share) / 100).toLocaleString('en-US')}</td>
              <td className="tnum py-2.5 text-right text-muted">{d.share}%</td>
              <td className="tnum py-2.5 text-right text-muted">{planPrice[d.plan]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
