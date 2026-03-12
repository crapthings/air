export function SettingsSection (props) {
  const {
    openRouterApiKey,
    setOpenRouterApiKey,
    openRouterModelId,
    setOpenRouterModelId,
    customSystemPrompt,
    setCustomSystemPrompt,
    customTemperature,
    setCustomTemperature,
    defaultEvaluationProfile,
    resetEvaluationSettings,
    maskedApiKey,
    resolvedInfoTemperature,
    resolvedReviewTemperature
  } = props

  return (
    <section className='grid flex-1 gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]'>
      <div className='rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)]'>
        <div className='mb-6'>
          <h2 className='text-2xl font-semibold'>OpenRouter 设置</h2>
          <p className='mt-3 text-sm leading-6 text-slate-300'>
            信息评分器、语言解剖台、脚本实验室和内容审查台共用这一套模型配置。
          </p>
        </div>

        <div className='space-y-5'>
          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>OpenRouter API Key</div>
            <input
              type='password'
              value={openRouterApiKey}
              onChange={(event) => setOpenRouterApiKey(event.target.value)}
              placeholder='请输入 sk-or-v1-...'
              className='w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>

          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>模型 ID</div>
            <input
              type='text'
              value={openRouterModelId}
              onChange={(event) => setOpenRouterModelId(event.target.value)}
              placeholder='例如 openai/gpt-4.1-mini'
              className='w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>

          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>信息评分器提示词</div>
            <textarea
              value={customSystemPrompt}
              onChange={(event) => setCustomSystemPrompt(event.target.value)}
              placeholder='留空时使用内置默认评价体系...'
              className='min-h-[240px] w-full resize-y rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>

          <label className='block'>
            <div className='mb-2 text-sm font-medium text-white'>Temperature</div>
            <input
              type='number'
              min='0'
              max='2'
              step='0.1'
              value={customTemperature}
              onChange={(event) => setCustomTemperature(event.target.value)}
              placeholder={`留空时使用默认值 ${defaultEvaluationProfile.temperature}`}
              className='w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
            />
          </label>

          <button
            type='button'
            onClick={resetEvaluationSettings}
            className='rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10'
          >
            恢复默认信息评分体系
          </button>
        </div>
      </div>

      <div className='grid gap-4'>
        <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <div className='mb-6 flex items-center justify-between gap-4'>
            <h3 className='text-xl font-semibold text-slate-950'>当前配置</h3>
            <span className='rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
              {openRouterApiKey ? '已配置' : '未配置'}
            </span>
          </div>
          <div className='space-y-4 text-sm text-slate-600'>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>API Key</div>
              <div className='break-all text-slate-900'>{maskedApiKey}</div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>模型 ID</div>
              <div className='break-all text-slate-900'>{openRouterModelId || '未设置'}</div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>信息评分器提示词</div>
              <div className='text-slate-900'>{customSystemPrompt.trim() ? '使用用户覆盖' : '使用内置默认评价体系'}</div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>信息评分温度</div>
              <div className='text-slate-900'>{resolvedInfoTemperature}</div>
            </div>
            <div className='rounded-[1.25rem] bg-slate-100 p-3'>
              <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>审查台温度</div>
              <div className='text-slate-900'>{resolvedReviewTemperature}</div>
            </div>
          </div>
        </article>

        <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
          <h3 className='text-xl font-semibold text-slate-950'>说明</h3>
          <div className='mt-4 space-y-3 text-sm leading-6 text-slate-600'>
            <p>设置保存在当前浏览器，本地持久化，不需要重复输入。</p>
            <p>当前版本由浏览器直接请求 OpenRouter，API Key 会在本地浏览器中使用。</p>
            <p>信息评分器支持自定义提示词；语言解剖台、脚本实验室和内容审查台当前固定使用内置中文评估体系。</p>
          </div>
        </article>
      </div>
    </section>
  )
}
