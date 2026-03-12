import {
  buildRewriteComparisonRows,
  scoreBadgeClass
} from '../../lib/ui/appHelpers'

function deltaClass (delta, isRiskMetric) {
  if (delta === 0) return 'bg-slate-100 text-slate-600'

  if (isRiskMetric) {
    return delta > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
  }

  return delta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
}

function deltaLabel (delta) {
  if (delta === 0) return '0'
  return delta > 0 ? `+${delta}` : String(delta)
}

export function RewriteComparisonPanel ({
  rewriteSourceView,
  rewriteComparison
}) {
  if (!rewriteComparison?.available) {
    return (
      <div className='rounded-[1.25rem] bg-slate-100 p-4 text-sm leading-6 text-slate-600'>
        触发一次“替换并复评”后，这里会显示改写前后分数变化和文本差异。
      </div>
    )
  }

  const rows = buildRewriteComparisonRows(rewriteSourceView, rewriteComparison)
  return (
    <div className='grid gap-4'>
      <div className='grid gap-3 md:grid-cols-2'>
        <div className='rounded-[1.25rem] bg-slate-100 p-3'>
          <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>改写前总结</div>
          <div className='text-sm leading-6 text-slate-900'>
            {rewriteComparison.beforeResult?.summary || rewriteComparison.beforeResult?.publishRecommendation || '未记录改写前总结。'}
          </div>
        </div>
        <div className='rounded-[1.25rem] bg-slate-100 p-3'>
          <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>改写后总结</div>
          <div className='text-sm leading-6 text-slate-900'>
            {rewriteComparison.afterResult?.summary || rewriteComparison.afterResult?.publishRecommendation || '未记录改写后总结。'}
          </div>
        </div>
      </div>

      <div className='grid gap-3 md:grid-cols-2'>
        {rows.map((row) => (
          <article key={row.key} className='rounded-[1.25rem] border border-slate-200 bg-white p-4'>
            <div className='mb-3 flex items-start justify-between gap-3'>
              <div className='text-sm font-medium text-slate-700'>{row.label}</div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${deltaClass(row.delta, row.isRiskMetric)}`}>
                {deltaLabel(row.delta)}
              </span>
            </div>
            <div className='flex items-center gap-3 text-sm text-slate-500'>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${scoreBadgeClass(row.before, row.isRiskMetric)}`}>
                Before {row.before}
              </span>
              <span className='text-slate-400'>-&gt;</span>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${scoreBadgeClass(row.after, row.isRiskMetric)}`}>
                After {row.after}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
