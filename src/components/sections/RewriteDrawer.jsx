import { UsageChips } from '../shared/UsageChips'
import { RewriteComparisonPanel } from '../shared/RewriteComparisonPanel'
import { RewriteTextComparePanel } from '../shared/RewriteTextComparePanel'
import { buildLocalReanalysisSummary, buildLocalRewriteHint } from '../../lib/ui/appHelpers'

export function RewriteDrawer (props) {
  const {
    isOpen,
    setIsOpen,
    headerCopy,
    rewriteSourceView,
    rewriteModesByView,
    rewriteMode,
    setRewriteMode,
    rewriteModeMeta,
    rewriteOriginalText,
    rewriteSummary,
    rewriteProblems,
    rewriteCustomInstruction,
    setRewriteCustomInstruction,
    handleRewriteGenerate,
    isRewriting,
    rewriteError,
    rewriteResult,
    applyRewriteToInput,
    applyRewriteAndReanalyze,
    handleReanalyzeSelectedSegment,
    rewriteUsage,
    rewriteComparison,
    rewriteTextView,
    rewriteSelection,
    rewriteLocalReanalysis,
    setRewriteTextView,
    handleSelectRewriteSegment,
    clearRewriteSelection,
    isRewriteReanalyzing
  } = props

  if (!isOpen) return null

  const localRewriteHint = buildLocalRewriteHint(rewriteSelection?.targetText, rewriteResult.rewrittenText)
  const localReanalysisSummary = buildLocalReanalysisSummary(
    rewriteSourceView,
    rewriteLocalReanalysis?.beforeResult,
    rewriteLocalReanalysis?.afterResult
  )
  const localHintClass =
    localRewriteHint.tone === 'positive'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : localRewriteHint.tone === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-slate-200 bg-slate-50 text-slate-800'
  const hasRewriteOutput = Boolean(rewriteResult.rewrittenText.trim())

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm'>
      <div className='ml-auto flex h-full w-full max-w-[min(96vw,1680px)] gap-4 p-4 sm:p-5'>
        {hasRewriteOutput
          ? (
            <RewriteTextComparePanel
              rewriteOriginalText={rewriteOriginalText}
              rewrittenText={rewriteResult.rewrittenText}
              rewriteTextView={rewriteTextView}
              setRewriteTextView={setRewriteTextView}
              rewriteSelection={rewriteSelection}
              rewriteLocalReanalysis={rewriteLocalReanalysis}
              handleSelectRewriteSegment={handleSelectRewriteSegment}
            />
            )
          : null}

        <div className='flex h-full w-full max-w-2xl flex-col rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] p-4 shadow-[-24px_0_80px_-40px_rgba(15,23,42,0.65)] sm:p-5'>
          <div className='mb-4 flex items-start justify-between gap-4'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.28em] text-slate-500'>AIR / 改写工作台</p>
              <h2 className='mt-2 text-2xl font-semibold tracking-tight text-slate-950'>直接帮我改</h2>
              <p className='mt-2 text-sm leading-6 text-slate-600'>先保留当前页面的分析结论，再按选定目标生成一版可直接使用的改写。</p>
            </div>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50'
            >
              关闭
            </button>
          </div>

          <div className='grid gap-4 overflow-y-auto pb-2'>
            <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
              <div className='mb-3 text-sm font-medium text-slate-500'>当前目标</div>
              <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-900'>
                页面：{headerCopy[rewriteSourceView]?.title || rewriteSourceView}
              </div>
              {rewriteSelection?.active
                ? (
                  <div className='mt-3 rounded-[1.25rem] border border-sky-200 bg-sky-50 p-3'>
                    <div className='mb-2 flex items-center justify-between gap-3'>
                      <div className='text-sm font-medium text-sky-900'>当前为局部重写模式</div>
                      <button
                        type='button'
                        onClick={clearRewriteSelection}
                        className='rounded-full border border-sky-200 bg-white px-3 py-1 text-xs text-sky-700 transition hover:bg-sky-100'
                      >
                        退出局部模式
                      </button>
                    </div>
                    <div className='line-clamp-3 text-sm leading-6 text-sky-800'>
                      {rewriteSelection.targetText}
                    </div>
                  </div>
                  )
                : null}
              <div className='mt-3 flex flex-wrap gap-2'>
                {rewriteModesByView[rewriteSourceView]?.map((mode) => (
                  <button
                    key={mode}
                    type='button'
                    onClick={() => setRewriteMode(mode)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      rewriteMode === mode
                        ? 'bg-slate-950 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {rewriteModeMeta[mode].label}
                  </button>
                ))}
              </div>
            </article>

          <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
            <div className='mb-3 text-sm font-medium text-slate-500'>分析上下文</div>
            <div className='space-y-3'>
              <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-900'>
                {rewriteSummary || '还没有提取到总结，系统会尽量基于原文直接改写。'}
              </div>
              <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>主要问题</div>
                {rewriteProblems.length
                  ? (
                    <div className='space-y-2'>
                      {rewriteProblems.map((item, index) => (
                        <div key={`${item}-${index}`} className='text-sm leading-6 text-slate-900'>
                          {index + 1}. {item}
                        </div>
                      ))}
                    </div>
                    )
                  : <div className='text-sm leading-6 text-slate-600'>暂无结构化问题，将主要参考原文和目标动作。</div>}
              </div>
            </div>
          </article>

          <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
            <label className='block'>
              <div className='mb-2 text-sm font-medium text-slate-500'>补充要求</div>
              <textarea
                value={rewriteCustomInstruction}
                onChange={(event) => setRewriteCustomInstruction(event.target.value)}
                placeholder='例如：保留第一段判断 / 更克制一些 / 更适合口播'
                className='min-h-[120px] w-full resize-y rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400'
              />
            </label>
            <div className='mt-4 flex justify-end'>
              <button
                type='button'
                onClick={handleRewriteGenerate}
                disabled={isRewriting}
                className='rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isRewriting ? '改写中...' : '生成改写'}
              </button>
            </div>
            {rewriteError
              ? <div className='mt-3 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700'>{rewriteError}</div>
              : null}
          </article>

          <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
            <div className='mb-4'>
              <div>
                <div className='text-sm font-medium text-slate-500'>改写结果</div>
                <p className='mt-2 text-sm leading-6 text-slate-600'>先给一版可直接使用的结果，再用简短说明告诉你这次重点动了什么。</p>
              </div>
            </div>

            <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-7 text-slate-900 whitespace-pre-wrap'>
              {rewriteResult.rewrittenText || '生成后，这里会显示改写结果。'}
            </div>

            <div className='mt-4 grid gap-3'>
              <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>改写说明</div>
                {rewriteResult.changeNotes.length
                  ? (
                    <div className='space-y-2'>
                      {rewriteResult.changeNotes.map((item, index) => (
                        <div key={`${item}-${index}`} className='text-sm leading-6 text-slate-900'>
                          {index + 1}. {item}
                        </div>
                      ))}
                    </div>
                    )
                  : <div className='text-sm leading-6 text-slate-600'>生成后，这里会说明主要调整点。</div>}
              </div>
              <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>本次重点</div>
                <div className='text-sm leading-6 text-slate-900'>
                  {rewriteResult.appliedFocus || '等待模型概括这次改写主要抓的方向。'}
                </div>
              </div>
              {rewriteSelection?.active
                ? (
                  <div className={`rounded-[1.25rem] border p-3 ${localHintClass}`}>
                    <div className='mb-1 text-xs uppercase tracking-[0.24em] opacity-70'>块级提示</div>
                    <div className='text-sm font-medium leading-6'>{localRewriteHint.label}</div>
                    <div className='mt-1 text-sm leading-6 opacity-90'>{localRewriteHint.message}</div>
                  </div>
                  )
                : null}
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={handleRewriteGenerate}
                disabled={isRewriting}
                className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
              >
                重新生成
              </button>
              <button
                type='button'
                onClick={applyRewriteToInput}
                disabled={!rewriteResult.rewrittenText.trim()}
                className='rounded-full bg-slate-950 px-4 py-2 text-sm text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60'
              >
                替换到输入区
              </button>
              <button
                type='button'
                onClick={applyRewriteAndReanalyze}
                disabled={!rewriteResult.rewrittenText.trim() || isRewriting || isRewriteReanalyzing}
                className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isRewriteReanalyzing ? '复评中...' : '替换并复评'}
              </button>
              {rewriteSelection?.active
                ? (
                  <button
                    type='button'
                    onClick={handleReanalyzeSelectedSegment}
                    disabled={!rewriteResult.rewrittenText.trim() || isRewriting || rewriteLocalReanalysis?.isLoading}
                    className='rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {rewriteLocalReanalysis?.isLoading ? '片段复评中...' : '只复评这一段'}
                  </button>
                  )
                : null}
            </div>

            <UsageChips usage={rewriteUsage} />
          </article>

          {rewriteSelection?.active
            ? (
              <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                <div className='mb-4'>
                  <div className='text-sm font-medium text-slate-500'>片段复评</div>
                  <p className='mt-2 text-sm leading-6 text-slate-600'>
                    对当前选中片段单独跑一次真实模型判断，看看这次局部重写到底是在变强还是跑偏。
                  </p>
                </div>

                {rewriteLocalReanalysis?.error
                  ? <div className='rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700'>{rewriteLocalReanalysis.error}</div>
                  : null}

                {rewriteLocalReanalysis?.available
                  ? (
                    <div className='grid gap-3'>
                      <div className='grid gap-3 md:grid-cols-2'>
                        {localReanalysisSummary.topChanges.length
                          ? localReanalysisSummary.topChanges.map((row) => (
                            <div key={row.key} className='rounded-[1.25rem] bg-slate-100 p-3'>
                              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>{row.label}</div>
                              <div className='text-sm leading-6 text-slate-900'>
                                Before {row.before} {'->'} After {row.after}
                              </div>
                              <div className='mt-1 text-sm leading-6 text-slate-600'>
                                变化：{row.delta > 0 ? `+${row.delta}` : row.delta}
                              </div>
                            </div>
                          ))
                          : <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-600'>这一段目前没有出现明显指标变化。</div>}
                      </div>
                      <UsageChips usage={rewriteLocalReanalysis.usage} />
                    </div>
                    )
                  : (
                    <div className='rounded-[1.25rem] bg-slate-100 p-4 text-sm leading-6 text-slate-600'>
                      选中片段后点“只复评这一段”，这里会显示片段级 before / after 变化。
                    </div>
                    )}
              </article>
              )
            : null}

          <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
            <div className='mb-4'>
              <div className='text-sm font-medium text-slate-500'>评分变化</div>
              <p className='mt-2 text-sm leading-6 text-slate-600'>
                文本比较放在左侧，右边只保留改写前后复评结果的 before / after 变化。
              </p>
            </div>

            <RewriteComparisonPanel
              rewriteSourceView={rewriteSourceView}
              rewriteComparison={rewriteComparison}
            />
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
