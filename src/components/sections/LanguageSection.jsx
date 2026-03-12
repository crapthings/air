import { MetricScoreCard } from '../shared/MetricScoreCard'
import { NextStepCard } from '../shared/NextStepCard'
import { UsageChips } from '../shared/UsageChips'

export function LanguageSection (props) {
  const {
    languageTextType,
    setLanguageTextType,
    languageTextTypes,
    languageActiveModel,
    openRouterModelId,
    languageTitle,
    setLanguageTitle,
    languageBody,
    setLanguageBody,
    handleLanguageAnalyze,
    isLanguageAnalyzing,
    languageError,
    languageMetricMeta,
    languageResult,
    languageUsage,
    openRewriteDrawer
  } = props

  return (
    <section className='grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.06fr)_minmax(320px,0.74fr)]'>
      <div className='flex flex-col rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)] sm:p-5'>
        <div className='mb-4 flex items-start justify-between gap-4'>
          <div>
            <h2 className='text-xl font-semibold'>语言输入</h2>
            <p className='mt-2 text-sm leading-6 text-slate-300'>分析普通中文写作中的句法、修辞、长句控制、节奏、语气和文风机制。</p>
          </div>
          <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300'>双层分析</span>
        </div>

        <div className='mb-4 grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-200'>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>文本类型</div>
              <select
                value={languageTextType}
                onChange={(event) => setLanguageTextType(event.target.value)}
                className='w-full rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none'
              >
                {languageTextTypes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div>
              <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>当前模型</div>
              <div className='truncate rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-3'>
                {languageActiveModel || openRouterModelId || '未设置'}
              </div>
            </div>
          </div>
          <p className='text-sm leading-6 text-slate-300'>这里不是识别术语名词，而是判断这些语言手法到底有没有服务表达。</p>
        </div>

        <div className='grid gap-3'>
          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>标题</div>
            <input
              type='text'
              value={languageTitle}
              onChange={(event) => setLanguageTitle(event.target.value)}
              placeholder='可选，用来帮助判断文本意图和语气方向'
              className='w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>

          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>正文</div>
            <textarea
              value={languageBody}
              onChange={(event) => setLanguageBody(event.target.value)}
              placeholder='粘贴要分析的评论、随笔、议论文或叙述文片段...'
              className='min-h-[360px] w-full resize-y rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>
        </div>

        <div className='mt-4 flex justify-end'>
          <button
            type='button'
            onClick={handleLanguageAnalyze}
            disabled={isLanguageAnalyzing}
            className='rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'
          >
            {isLanguageAnalyzing ? '分析中...' : '开始分析'}
          </button>
        </div>

        {languageError
          ? <div className='mt-3 rounded-[1.25rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100'>{languageError}</div>
          : null}
      </div>

      <div className='grid gap-4 md:grid-cols-2 2xl:grid-cols-2'>
        {languageMetricMeta.map((metric) => {
          const value = languageResult.scores[metric.key]
          const isPostureMetric = metric.key === 'posture_density'
          return (
            <MetricScoreCard
              key={metric.key}
              metric={metric}
              value={value}
              reason={languageResult.reasons[metric.key] || '等待模型返回该项语言判断。'}
              isRiskMetric={isPostureMetric}
            />
          )
        })}

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)] md:col-span-2'>
          <div className='mb-4 flex items-start justify-between gap-4'>
            <div>
              <p className='text-sm font-medium text-slate-500'>识别到的语言现象</p>
              <p className='mt-2 text-sm leading-6 text-slate-600'>不只是点术语，而是保留最有解释力的修辞、句法和文风标签。</p>
            </div>
            <span className='rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
              {languageResult.detectedFeatures.rhetoricalDevices.length +
                languageResult.detectedFeatures.sentencePatterns.length +
                languageResult.detectedFeatures.styleModes.length} 项
            </span>
          </div>

          <div className='grid gap-3 md:grid-cols-3'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>修辞手法</div>
              {languageResult.detectedFeatures.rhetoricalDevices.length
                ? <div className='flex flex-wrap gap-2'>{languageResult.detectedFeatures.rhetoricalDevices.map((item, index) => <span key={`${item}-${index}`} className='rounded-full bg-white px-3 py-1 text-sm text-slate-900'>{item}</span>)}</div>
                : <div className='text-sm leading-6 text-slate-600'>等待识别结果。</div>}
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>句法模式</div>
              {languageResult.detectedFeatures.sentencePatterns.length
                ? <div className='flex flex-wrap gap-2'>{languageResult.detectedFeatures.sentencePatterns.map((item, index) => <span key={`${item}-${index}`} className='rounded-full bg-white px-3 py-1 text-sm text-slate-900'>{item}</span>)}</div>
                : <div className='text-sm leading-6 text-slate-600'>等待识别结果。</div>}
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>文风模式</div>
              {languageResult.detectedFeatures.styleModes.length
                ? <div className='flex flex-wrap gap-2'>{languageResult.detectedFeatures.styleModes.map((item, index) => <span key={`${item}-${index}`} className='rounded-full bg-white px-3 py-1 text-sm text-slate-900'>{item}</span>)}</div>
                : <div className='text-sm leading-6 text-slate-600'>等待识别结果。</div>}
            </div>
          </div>
        </article>
      </div>

      <div className='grid auto-rows-min gap-4'>
        <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-4 flex items-start justify-between gap-4'>
            <div>
              <p className='text-sm font-medium text-slate-500'>一句话总评</p>
              <p className='mt-2 text-sm leading-6 text-slate-600'>先判断技术上成不成立，再指出最大优点和最大毛病。</p>
            </div>
            <span className='shrink-0 whitespace-nowrap rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
              {isLanguageAnalyzing ? '处理中' : '已就绪'}
            </span>
          </div>
          <p className='text-base leading-7 text-slate-900'>{languageResult.summary || '开始分析后，这里会显示一段压缩后的总体判断。'}</p>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-4'><p className='text-sm font-medium text-slate-500'>主要问题</p><p className='mt-2 text-sm leading-6 text-slate-600'>聚焦最影响阅读体验和表达质量的结构问题。</p></div>
          {languageResult.problems.length
            ? <div className='space-y-2'>{languageResult.problems.map((item, index) => <div key={`${item}-${index}`} className='rounded-[1.25rem] bg-rose-50 p-3 text-sm leading-6 text-slate-900'>{index + 1}. {item}</div>)}</div>
            : <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-600'>分析后，这里会列出最需要优先处理的语言问题。</div>}
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-4'><p className='text-sm font-medium text-slate-500'>修改建议</p><p className='mt-2 text-sm leading-6 text-slate-600'>固定拆成句子、节奏、修辞、语气四类，避免只有空泛点评。</p></div>
          <div className='space-y-3'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>句子</div><div className='text-sm leading-6 text-slate-900'>{languageResult.revisionSuggestions.sentence || '等待模型指出句法层面的修改方向。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>节奏</div><div className='text-sm leading-6 text-slate-900'>{languageResult.revisionSuggestions.rhythm || '等待模型指出节奏层面的修改方向。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>修辞</div><div className='text-sm leading-6 text-slate-900'>{languageResult.revisionSuggestions.rhetoric || '等待模型指出修辞层面的修改方向。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>语气</div><div className='text-sm leading-6 text-slate-900'>{languageResult.revisionSuggestions.tone || '等待模型指出语气层面的修改方向。'}</div></div>
          </div>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-4'><p className='text-sm font-medium text-slate-500'>评论拆解</p><p className='mt-2 text-sm leading-6 text-slate-600'>从语言机制和风格气质角度，解释这段文本是怎样产生效果的。</p></div>
          <div className='space-y-3'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>风格总结</div><div className='text-sm leading-6 text-slate-900'>{languageResult.commentary.styleSummary || '等待模型总结这段文字的风格气质。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>语言机制</div><div className='text-sm leading-6 text-slate-900'>{languageResult.commentary.languageMechanism || '等待模型说明文本主要靠什么语言机制成立。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>主要效果</div><div className='text-sm leading-6 text-slate-900'>{languageResult.commentary.dominantEffect || '等待模型指出这段文字最强的表达效果。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>风险提示</div><div className='text-sm leading-6 text-slate-900'>{languageResult.commentary.riskNote || '等待模型指出这段文字可能滑向的风险。'}</div></div>
          </div>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-4'><p className='text-sm font-medium text-slate-500'>表达剖面</p><p className='mt-2 text-sm leading-6 text-slate-600'>用更压缩的方式总结这段文字的核心优点、弱点和作者倾向。</p></div>
          <div className='space-y-3'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>核心优点</div><div className='text-sm leading-6 text-slate-900'>{languageResult.profile.coreStrength || '等待模型概括最值得保留的语言优点。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>核心弱点</div><div className='text-sm leading-6 text-slate-900'>{languageResult.profile.coreWeakness || '等待模型概括最突出的语言短板。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>作者倾向</div><div className='text-sm leading-6 text-slate-900'>{languageResult.profile.writerTendency || '等待模型概括常见表达倾向。'}</div></div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'><div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>阅读体验</div><div className='text-sm leading-6 text-slate-900'>{languageResult.profile.readingExperience || '等待模型概括读者会感受到什么。'}</div></div>
          </div>
          <UsageChips usage={languageUsage} />
        </article>

        <NextStepCard
          description='基于当前诊断直接生成一版更稳的表达，适合压姿态、理句法或强化节奏。'
          onClick={() => openRewriteDrawer('language')}
        />
      </div>
    </section>
  )
}
