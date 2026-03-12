import { MetricScoreCard } from '../shared/MetricScoreCard'
import { MasonryMetricGrid } from '../shared/MasonryMetricGrid'
import { NextStepCard } from '../shared/NextStepCard'
import { UsageChips } from '../shared/UsageChips'
import { progressBarClass, scoreBadgeClass, scoreTone } from '../../lib/ui/appHelpers'

export function ScriptSection (props) {
  const {
    scriptPlatform,
    setScriptPlatform,
    scriptPlatforms,
    scriptLengthOptions,
    scriptVideoLength,
    setScriptVideoLength,
    scriptFormatOptions,
    scriptFormat,
    setScriptFormat,
    scriptTitle,
    setScriptTitle,
    scriptBody,
    setScriptBody,
    handleScriptAnalyze,
    isScriptAnalyzing,
    scriptError,
    scriptResult,
    scriptMetricMeta,
    scriptUsage,
    openRewriteDrawer
  } = props

  const metricItems = scriptMetricMeta.map((metric) => {
    const value = scriptResult.scores[metric.key]

    return {
      id: metric.key,
      content: (
        <MetricScoreCard
          metric={metric}
          value={value}
          reason={scriptResult.reasons[metric.key] || '等待模型返回该项脚本判断。'}
        />
      )
    }
  })

  const scriptGridItems = [
    {
      id: 'hook-power-total',
      content: (
        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3 flex items-start justify-between gap-3'>
            <div>
              <p className='text-sm font-medium text-slate-500'>传播效果</p>
              <p className='mt-1.5 text-sm leading-5 text-slate-600'>看开头抓力、推进和观众留下来的可能性。</p>
            </div>
            <span className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${scoreBadgeClass(scriptResult.totals.hook_power)}`}>
              {scoreTone(scriptResult.totals.hook_power)}
            </span>
          </div>
          <div className='text-4xl font-semibold tracking-tight text-slate-950'>{scriptResult.totals.hook_power}</div>
          <div className='mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200'>
            <div
              className={`h-full rounded-full transition-[width,background-color] duration-500 ${progressBarClass(scriptResult.totals.hook_power)}`}
              style={{ width: `${scriptResult.totals.hook_power}%` }}
            />
          </div>
          <p className='mt-3 text-sm leading-5 text-slate-600'>
            {scriptResult.summary || '等待模型返回该项脚本判断。'}
          </p>
        </article>
      )
    },
    {
      id: 'narrative-power-total',
      content: (
        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3 flex items-start justify-between gap-3'>
            <div>
              <p className='text-sm font-medium text-slate-500'>叙事质量</p>
              <p className='mt-1.5 text-sm leading-5 text-slate-600'>看结构、冲突和情绪能不能真正撑住内容。</p>
            </div>
            <span className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${scoreBadgeClass(scriptResult.totals.narrative_power)}`}>
              {scoreTone(scriptResult.totals.narrative_power)}
            </span>
          </div>
          <div className='text-4xl font-semibold tracking-tight text-slate-950'>{scriptResult.totals.narrative_power}</div>
          <div className='mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200'>
            <div
              className={`h-full rounded-full transition-[width,background-color] duration-500 ${progressBarClass(scriptResult.totals.narrative_power)}`}
              style={{ width: `${scriptResult.totals.narrative_power}%` }}
            />
          </div>
          <p className='mt-3 text-sm leading-5 text-slate-600'>
            {scriptResult.profile.storyShape || '等待模型返回该项脚本判断。'}
          </p>
        </article>
      )
    },
    ...metricItems
  ]

  return (
    <section className='grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.06fr)_minmax(320px,0.72fr)]'>
      <div className='flex flex-col rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)]'>
        <div className='mb-3 flex items-start justify-between gap-3'>
          <div>
            <h2 className='text-xl font-semibold'>脚本输入</h2>
            <p className='mt-1 text-sm leading-5 text-slate-300'>短视频、长视频、纯文案和分镜脚本。</p>
          </div>
          <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300'>
            双引擎评估
          </span>
        </div>

        <div className='mb-3 grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-200'>
          <div>
            <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>平台</div>
            <select
              value={scriptPlatform}
              onChange={(event) => setScriptPlatform(event.target.value)}
              className='w-full rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none'
            >
              {scriptPlatforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <div className='mb-2 text-xs uppercase tracking-[0.22em] text-slate-400'>视频长度</div>
              <div className='flex flex-wrap gap-2'>
                {scriptLengthOptions.map((item) => (
                  <button
                    key={item}
                    type='button'
                    onClick={() => setScriptVideoLength(item)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      scriptVideoLength === item
                        ? 'bg-white text-slate-950'
                        : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className='mb-2 text-xs uppercase tracking-[0.22em] text-slate-400'>脚本形态</div>
              <div className='flex flex-wrap gap-2'>
                {scriptFormatOptions.map((item) => (
                  <button
                    key={item}
                    type='button'
                    onClick={() => setScriptFormat(item)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      scriptFormat === item
                        ? 'bg-white text-slate-950'
                        : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className='text-sm leading-5 text-slate-300'>短视频偏钩子与完播，长视频偏结构与情绪。</p>
        </div>

        <div className='grid gap-3'>
          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>标题</div>
            <input
              type='text'
              value={scriptTitle}
              onChange={(event) => setScriptTitle(event.target.value)}
              placeholder='例如：她花三年逃离这座城 / 这个反转我留到了最后一分钟'
              className='w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>

          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>脚本正文</div>
            <textarea
              value={scriptBody}
              onChange={(event) => setScriptBody(event.target.value)}
              placeholder={scriptFormat === '分镜脚本'
                ? '可自由输入镜头、画面、台词、旁白、字幕、音效，不强制固定模板。'
                : '粘贴口播稿、剧情稿、解说稿或长视频脚本正文...'}
              className='min-h-[320px] w-full resize-y rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>
        </div>

        <div className='mt-3 flex justify-end'>
          <button
            type='button'
            onClick={handleScriptAnalyze}
            disabled={isScriptAnalyzing}
            className='rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'
          >
            {isScriptAnalyzing ? '评估中...' : '开始评估'}
          </button>
        </div>

        {scriptError
          ? (
            <div className='mt-3 rounded-[1.25rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100'>
              {scriptError}
            </div>
            )
          : null}
      </div>

      <MasonryMetricGrid items={scriptGridItems} columnWidth={220} maxColumnCount={2} itemHeightEstimate={280} />

      <div className='grid auto-rows-min gap-3'>
        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3 flex items-start justify-between gap-3'>
            <div>
              <p className='text-sm font-medium text-slate-500'>一句话总评</p>
            </div>
            <span className='shrink-0 whitespace-nowrap rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
              {isScriptAnalyzing ? '处理中' : '已就绪'}
            </span>
          </div>
          <p className='text-base leading-7 text-slate-900'>
            {scriptResult.summary || '开始评估后，这里会给出一段压缩后的总体判断。'}
          </p>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3'>
            <p className='text-sm font-medium text-slate-500'>优势与问题</p>
          </div>
          <div className='space-y-3'>
            <div>
              <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>主要优势</div>
              {scriptResult.strengths.length
                ? (
                  <div className='space-y-2'>
                    {scriptResult.strengths.map((item, index) => (
                      <div key={`${item}-${index}`} className='rounded-[1.25rem] bg-emerald-50 p-3 text-sm leading-6 text-slate-900'>
                        {index + 1}. {item}
                      </div>
                    ))}
                  </div>
                  )
                : <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-600'>评估后，这里会列出最值得保留的亮点。</div>}
            </div>
            <div>
              <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>主要问题</div>
              {scriptResult.problems.length
                ? (
                  <div className='space-y-2'>
                    {scriptResult.problems.map((item, index) => (
                      <div key={`${item}-${index}`} className='rounded-[1.25rem] bg-rose-50 p-3 text-sm leading-6 text-slate-900'>
                        {index + 1}. {item}
                      </div>
                    ))}
                  </div>
                  )
                : <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-600'>评估后，这里会列出最影响传播和叙事的关键问题。</div>}
            </div>
          </div>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3'>
            <p className='text-sm font-medium text-slate-500'>改稿建议</p>
          </div>
          <div className='space-y-3'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>开头</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.revisionSuggestions.opening || '等待模型指出开头应该如何更快建立吸引力。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>中段</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.revisionSuggestions.middle || '等待模型指出中段该如何补推进和节奏。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>结尾</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.revisionSuggestions.ending || '等待模型指出结尾该如何形成回报或收束。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>表现形式</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.revisionSuggestions.format || '等待模型说明更适合口播、剧情、分镜还是字幕推进。'}</div></div>
          </div>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3'>
            <p className='text-sm font-medium text-slate-500'>适配判断</p>
          </div>
          <div className='space-y-3'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>最佳形式</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.fit.bestFormat || '等待模型判断这份脚本更适合的成片形式。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>短视频适配</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.fit.shortVideoFit || '等待模型判断这份脚本是否适合短视频表达。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>长视频适配</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.fit.longVideoFit || '等待模型判断这份脚本是否支撑长视频展开。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>平台注意点</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.fit.platformNote || '等待模型补充当前平台下的表达建议。'}</div></div>
          </div>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-3.5 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-3'>
            <p className='text-sm font-medium text-slate-500'>脚本剖面</p>
          </div>
          <div className='space-y-3'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>核心卖点</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.profile.coreSellingPoint || '等待模型概括这份脚本最应该被保留的卖点。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>最大短板</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.profile.biggestWeakness || '等待模型概括这份脚本最大的结构短板。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>观众拉力</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.profile.audiencePull || '等待模型说明观众被什么东西拉住。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>结构形态</div><div className='text-sm leading-6 text-slate-900'>{scriptResult.profile.storyShape || '等待模型概括它整体像什么结构。'}</div></div>
          </div>
          <UsageChips usage={scriptUsage} />
        </article>

        <NextStepCard
          description='基于当前脚本诊断直接生成一版更适合拍、更顺口或更有推进力的稿子。'
          onClick={() => openRewriteDrawer('script')}
        />
      </div>
    </section>
  )
}
