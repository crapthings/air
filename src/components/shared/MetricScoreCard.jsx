import { progressBarClass, scoreBadgeClass, scoreTone } from '../../lib/ui/appHelpers'

export function MetricScoreCard ({ metric, value, reason, isRiskMetric = false, unitLabel = '满分 100' }) {
  return (
    <article className='relative self-start overflow-hidden rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metric.tint}`} />
      <div className='relative'>
        <div className='mb-3 flex items-start justify-between gap-3'>
          <div>
            <p className='text-sm font-medium text-slate-500'>{metric.label}</p>
            <p className='mt-1.5 max-w-[18rem] text-sm leading-5 text-slate-600'>
              {metric.description}
            </p>
          </div>
          <span
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${scoreBadgeClass(
              value,
              isRiskMetric
            )}`}
          >
            {scoreTone(value)}
          </span>
        </div>

        <div className='text-4xl font-semibold tracking-tight text-slate-950'>{value}</div>
        <div className='mt-1.5 text-[11px] uppercase tracking-[0.24em] text-slate-400'>{unitLabel}</div>

        <div className='mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200'>
          <div
            className={`h-full rounded-full transition-[width,background-color] duration-500 ${progressBarClass(
              value,
              isRiskMetric
            )}`}
            style={{ width: `${value}%` }}
          />
        </div>

        <p className='mt-3 text-sm leading-5 text-slate-600'>{reason}</p>
      </div>
    </article>
  )
}
