import { MetricScoreCard } from '../shared/MetricScoreCard'
import { MasonryMetricGrid } from '../shared/MasonryMetricGrid'
import { NextStepCard } from '../shared/NextStepCard'
import { UsageChips } from '../shared/UsageChips'
import { riskLevelClass, severityClass } from '../../lib/ui/appHelpers'

export function ReviewSection (props) {
  const {
    reviewModeMeta,
    reviewMode,
    setReviewMode,
    reviewPlatform,
    setReviewPlatform,
    reviewPlatforms,
    reviewTitle,
    setReviewTitle,
    reviewBody,
    setReviewBody,
    reviewCover,
    setReviewCover,
    handleReviewAnalyze,
    isReviewAnalyzing,
    reviewError,
    reviewMetricMeta,
    reviewResult,
    reviewUsage,
    openRewriteDrawer
  } = props

  const metricItems = reviewMetricMeta.map((metric) => {
    const value = reviewResult.scores[metric.key]

    return {
      id: metric.key,
      content: (
        <MetricScoreCard
          metric={metric}
          value={value}
          reason={reviewResult.reasons[metric.key] || '等待模型返回该项风险的解释。'}
          isRiskMetric
          unitLabel='风险分 100'
        />
      )
    }
  })

  return (
    <section className='grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.04fr)_minmax(320px,0.72fr)]'>
      <div className='flex flex-col rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)]'>
        <div className='mb-3 flex items-start justify-between gap-3'>
          <div>
            <h2 className='text-xl font-semibold'>审查输入</h2>
            <p className='mt-1 text-sm leading-5 text-slate-300'>标题、正文和封面文案的发布前自检。</p>
          </div>
          <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300'>
            中文平台风险扫描
          </span>
        </div>

        <div className='mb-3 grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-200'>
          <div className='flex flex-wrap gap-2'>
            {Object.entries(reviewModeMeta).map(([key, item]) => (
              <button
                key={key}
                type='button'
                onClick={() => setReviewMode(key)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  reviewMode === key
                    ? 'bg-white text-slate-950'
                    : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className='text-sm leading-5 text-slate-300'>{reviewModeMeta[reviewMode].description}</p>
          <div>
            <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>平台</div>
            <select
              value={reviewPlatform}
              onChange={(event) => setReviewPlatform(event.target.value)}
              className='w-full rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none'
            >
              {reviewPlatforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='grid gap-3'>
          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>标题</div>
            <input
              type='text'
              value={reviewTitle}
              onChange={(event) => setReviewTitle(event.target.value)}
              placeholder='例如：三天逆袭、亲测有效、官方终于回应...'
              className='w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>

          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>正文</div>
            <textarea
              value={reviewBody}
              onChange={(event) => setReviewBody(event.target.value)}
              placeholder='把正文粘贴到这里...'
              className='min-h-[200px] w-full resize-y rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>

          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>封面文案 / 口播摘录</div>
            <textarea
              value={reviewCover}
              onChange={(event) => setReviewCover(event.target.value)}
              placeholder='可选，适合视频标题、封面短句、开场口播...'
              className='min-h-[120px] w-full resize-y rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>
        </div>

        <div className='mt-3 flex justify-end'>
          <button
            type='button'
            onClick={handleReviewAnalyze}
            disabled={isReviewAnalyzing}
            className='rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'
          >
            {isReviewAnalyzing ? '审查中...' : '开始审查'}
          </button>
        </div>

        {reviewError
          ? (
            <div className='mt-3 rounded-[1.25rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100'>
              {reviewError}
            </div>
            )
          : null}
      </div>

      <div className='grid gap-4'>
        <MasonryMetricGrid items={metricItems} columnWidth={220} maxColumnCount={3} itemHeightEstimate={280} />
      </div>

      <div className='grid auto-rows-min gap-4'>
        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3 flex items-start justify-between gap-3'>
            <div>
              <p className='text-sm font-medium text-slate-500'>命中点</p>
            </div>
            <span className='rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
              {reviewResult.hitPoints.length} 项
            </span>
          </div>

          {reviewResult.hitPoints.length
            ? (
              <div className='grid gap-3'>
                {reviewResult.hitPoints.map((item, index) => (
                  <div
                    key={`${item.text}-${index}`}
                    className='rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3'
                  >
                    <div className='mb-2 flex flex-wrap items-center gap-2'>
                      <span className='rounded-full bg-slate-950 px-3 py-1 text-xs text-white'>命中内容</span>
                      <span className={`rounded-full px-3 py-1 text-xs ${severityClass(item.severity)}`}>
                        {item.severity}
                      </span>
                    </div>
                    <div className='text-sm leading-6 text-slate-900'>{item.text || '未返回命中内容。'}</div>
                    <div className='mt-2 text-sm leading-6 text-slate-600'>{item.reason}</div>
                    <div className='mt-2 text-xs leading-5 text-slate-500'>
                      平台关注点：{item.platformNote || '未补充平台说明。'}
                    </div>
                  </div>
                ))}
              </div>
              )
            : (
              <div className='rounded-[1.25rem] bg-slate-100 p-4 text-sm leading-6 text-slate-600'>
                开始审查后，这里会列出最值得注意的命中风险点。
              </div>
              )}
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3 flex items-start justify-between gap-3'>
            <div>
              <p className='text-sm font-medium text-slate-500'>总体风险</p>
            </div>
            <span
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${riskLevelClass(
                reviewResult.riskLevel
              )}`}
            >
              {reviewResult.riskLevel || '待判定'}
            </span>
          </div>

          <div className='space-y-3'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>审查结论</div>
              <div className='text-sm leading-6 text-slate-900'>
                {reviewResult.publishRecommendation || '审查后这里会给出是否建议发布的结论。'}
              </div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>申诉潜力</div>
              <div className='text-sm leading-6 text-slate-900'>
                {reviewResult.appealPotential || '待判定'}
              </div>
              <div className='mt-2 text-sm leading-6 text-slate-600'>
                {reviewResult.appealReason || '申诉模式下，这里会说明哪些点值得争取。'}
              </div>
            </div>
          </div>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3'>
            <p className='text-sm font-medium text-slate-500'>整改与申诉</p>
          </div>

          <div className='space-y-4'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>建议动作</div>
              <div className='text-sm leading-6 text-slate-900'>
                {reviewResult.reviewProfile.suggestedAction || '等待模型给出下一步动作建议。'}
              </div>
            </div>

            {reviewResult.fixSuggestions.length
              ? (
                <div className='space-y-2'>
                  {reviewResult.fixSuggestions.map((item, index) => (
                    <div key={`${item}-${index}`} className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-900'>
                      {index + 1}. {item}
                    </div>
                  ))}
                </div>
                )
              : (
                <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-600'>
                  发布前自检或复核后，这里会列出可执行的修改建议。
                </div>
                )}
          </div>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3'>
            <p className='text-sm font-medium text-slate-500'>审查剖面</p>
          </div>

          <div className='space-y-3'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>核心问题</div>
              <div className='text-sm leading-6 text-slate-900'>
                {reviewResult.reviewProfile.coreIssue || '等待模型概括最大的问题。'}
              </div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>风险风格</div>
              <div className='text-sm leading-6 text-slate-900'>
                {reviewResult.reviewProfile.riskStyle || '等待模型概括风险风格。'}
              </div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>平台敏感点</div>
              <div className='text-sm leading-6 text-slate-900'>
                {reviewResult.reviewProfile.platformSensitivity || '等待模型说明平台会敏感在哪里。'}
              </div>
            </div>
          </div>

          <UsageChips usage={reviewUsage} />
        </article>

        <NextStepCard
          description='如果需要保留原意但降低风险表达，可以直接进入改写工作台生成一版更稳的版本。'
          onClick={() => openRewriteDrawer('review')}
        />
      </div>
    </section>
  )
}
