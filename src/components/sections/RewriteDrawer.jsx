import { UsageChips } from '../shared/UsageChips'

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
    rewriteSummary,
    rewriteProblems,
    rewriteCustomInstruction,
    setRewriteCustomInstruction,
    handleRewriteGenerate,
    isRewriting,
    rewriteError,
    rewriteResult,
    rewriteActiveModel,
    openRouterModelId,
    applyRewriteToInput,
    rewriteUsage
  } = props

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-sm'>
      <div className='flex h-full w-full max-w-2xl flex-col border-l border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] p-4 shadow-[-24px_0_80px_-40px_rgba(15,23,42,0.65)] sm:p-5'>
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
            <div className='mb-4 flex items-start justify-between gap-4'>
              <div>
                <div className='text-sm font-medium text-slate-500'>改写结果</div>
                <p className='mt-2 text-sm leading-6 text-slate-600'>先给一版可直接使用的结果，再用简短说明告诉你这次重点动了什么。</p>
              </div>
              <span className='rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
                {rewriteActiveModel || openRouterModelId || '未设置'}
              </span>
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
            </div>

            <UsageChips usage={rewriteUsage} />
          </article>
        </div>
      </div>
    </div>
  )
}
