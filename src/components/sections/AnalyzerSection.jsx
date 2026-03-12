import { MetricScoreCard } from '../shared/MetricScoreCard'
import { MasonryMetricGrid } from '../shared/MasonryMetricGrid'
import { NextStepCard } from '../shared/NextStepCard'
import { UsageChips } from '../shared/UsageChips'

export function AnalyzerSection ({
  infoInput,
  setInfoInput,
  handleInfoAnalyze,
  isInfoAnalyzing,
  infoError,
  infoMetricMeta,
  infoScores,
  infoReasons,
  infoSummary,
  infoProfile,
  infoUsage,
  openRewriteDrawer
}) {
  const metricItems = infoMetricMeta.map((metric) => {
    const value = infoScores[metric.key]
    const isRiskMetric = metric.key === 'manipulation'

    return {
      id: metric.key,
      content: (
        <MetricScoreCard
          metric={metric}
          value={value}
          reason={infoReasons[metric.key] || '等待模型返回该指标的判断依据。'}
          isRiskMetric={isRiskMetric}
        />
      )
    }
  })

  return (
    <section className='grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.06fr)_minmax(300px,0.68fr)]'>
      <div className='flex flex-col rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)]'>
        <div className='mb-3 flex items-start justify-between gap-3'>
          <div>
            <h2 className='text-xl font-semibold'>输入内容</h2>
            <p className='mt-1 text-sm leading-5 text-slate-300'>帖子、观点、段落或转录文本。</p>
          </div>
          <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300'>
            实时模型分析
          </span>
        </div>

        <textarea
          value={infoInput}
          onChange={(event) => setInfoInput(event.target.value)}
          placeholder='把要分析的内容粘贴到这里...'
          className='min-h-[300px] flex-1 resize-none rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-base leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
        />

        <div className='mt-3 flex justify-end'>
          <button
            type='button'
            onClick={handleInfoAnalyze}
            disabled={isInfoAnalyzing}
            className='rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'
          >
            {isInfoAnalyzing ? '分析中...' : '开始分析'}
          </button>
        </div>

        {infoError
          ? (
            <div className='mt-3 rounded-[1.25rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100'>
              {infoError}
            </div>
            )
          : null}
      </div>

      <MasonryMetricGrid items={metricItems} columnWidth={220} maxColumnCount={3} itemHeightEstimate={280} />

      <div className='grid auto-rows-min gap-4'>
        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3 flex items-start justify-between gap-3'>
            <div>
              <p className='text-sm font-medium text-slate-500'>综合结论</p>
            </div>
            <span className='shrink-0 whitespace-nowrap rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
              {isInfoAnalyzing ? '处理中' : '已就绪'}
            </span>
          </div>

          <p className='text-base leading-7 text-slate-900'>
            {infoSummary || '开始分析后，这里会显示一段整体评语。'}
          </p>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3'>
            <p className='text-sm font-medium text-slate-500'>分析剖面</p>
          </div>

          <div className='space-y-3'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>思想体系标签</div>
              <div className='text-sm leading-6 text-slate-900'>
                {infoProfile.thoughtSystemLabel || '等待模型给出该内容的思想体系标签。'}
              </div>
              <div className='mt-2 text-sm leading-6 text-slate-600'>
                {infoProfile.thoughtSystemReason || '等待模型说明为什么贴上这个标签。'}
              </div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>核心判断</div>
              <div className='text-sm leading-6 text-slate-900'>
                {infoProfile.coreJudgment || '等待模型生成结构化判断。'}
              </div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>Slop 风险</div>
              <div className='text-sm leading-6 text-slate-900'>
                {infoProfile.slopRisk || '等待模型判断这段内容的 slop 倾向。'}
              </div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>论证形态</div>
              <div className='text-sm leading-6 text-slate-900'>
                {infoProfile.argumentShape || '等待模型概括内容的论证形态。'}
              </div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>注意力价值</div>
              <div className='text-sm leading-6 text-slate-900'>
                {infoProfile.attentionWorth || '等待模型判断是否值得继续投入注意力。'}
              </div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>最弱环节</div>
              <div className='text-sm leading-6 text-slate-900'>
                {infoProfile.weakestLink || '等待模型指出这段内容最薄弱的地方。'}
              </div>
            </div>
          </div>

          <UsageChips usage={infoUsage} />
        </article>

        <NextStepCard
          description='基于当前分析结果直接生成一版更可用的改写，不把改写区常驻塞进主界面。'
          onClick={() => openRewriteDrawer('analyzer')}
        />
      </div>
    </section>
  )
}
