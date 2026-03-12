import { lazy, Suspense, useRef, useState } from 'react'
import { buildSideBySideDiffRows } from '../../lib/ui/appHelpers'

const SlateDiffPanel = lazy(() => import('./SlateDiffPanel').then((module) => ({ default: module.SlateDiffPanel })))

function segmentClass (tone, changed) {
  if (!changed) {
    return ''
  }

  if (tone === 'removed') {
    return 'rounded bg-rose-200/80 px-0.5 line-through'
  }

  return 'rounded bg-emerald-200/80 px-0.5'
}

function DiffSegments ({ segments, tone, emptyLabel }) {
  return (
    <div className='whitespace-pre-wrap text-sm leading-7 text-slate-800'>
      {segments.length
        ? segments.map((segment, index) => (
          <span
            key={`${segment.text}-${index}`}
            className={segmentClass(tone, segment.changed)}
          >
            {segment.text}
          </span>
        ))
        : <span className='text-slate-400'>{emptyLabel}</span>}
    </div>
  )
}

export function RewriteTextComparePanel ({
  rewriteOriginalText,
  rewrittenText,
  rewriteTextView,
  setRewriteTextView,
  rewriteSelection,
  rewriteLocalReanalysis,
  handleSelectRewriteSegment
}) {
  const [activeRowIndex, setActiveRowIndex] = useState(null)
  const beforeScrollRef = useRef(null)
  const afterScrollRef = useRef(null)
  const syncLockRef = useRef(null)
  const beforeRowRefs = useRef([])
  const afterRowRefs = useRef([])
  const sideBySideRows = buildSideBySideDiffRows(rewriteOriginalText, rewrittenText)

  function syncScroll (source, target) {
    if (!source || !target) {
      return
    }

    const sourceScrollableHeight = source.scrollHeight - source.clientHeight
    const targetScrollableHeight = target.scrollHeight - target.clientHeight

    if (sourceScrollableHeight <= 0 || targetScrollableHeight <= 0) {
      target.scrollTop = source.scrollTop
      return
    }

    const ratio = source.scrollTop / sourceScrollableHeight
    target.scrollTop = ratio * targetScrollableHeight
  }

  function handleSideScroll (sourceKey) {
    const source = sourceKey === 'before' ? beforeScrollRef.current : afterScrollRef.current
    const target = sourceKey === 'before' ? afterScrollRef.current : beforeScrollRef.current

    if (!source || !target) {
      return
    }

    if (syncLockRef.current === sourceKey) {
      syncLockRef.current = null
      return
    }

    syncLockRef.current = sourceKey === 'before' ? 'after' : 'before'
    syncScroll(source, target)
  }

  function focusRow (index, sourceKey) {
    setActiveRowIndex(index)

    const targetRow =
      sourceKey === 'before'
        ? afterRowRefs.current[index]
        : beforeRowRefs.current[index]

    if (targetRow) {
      targetRow.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      })
    }
  }

  const topLocalChange = rewriteLocalReanalysis?.available
    ? rewriteLocalReanalysis.topChanges?.[0] || null
    : null

  const localDeltaLabel = topLocalChange
    ? `${topLocalChange.label} ${topLocalChange.delta > 0 ? `+${topLocalChange.delta}` : topLocalChange.delta}`
    : ''

  const localDeltaClass = topLocalChange
    ? topLocalChange.delta > 0
      ? 'bg-emerald-100 text-emerald-700'
      : topLocalChange.delta < 0
        ? 'bg-rose-100 text-rose-700'
        : 'bg-slate-100 text-slate-600'
    : 'bg-sky-600 text-white'

  return (
    <section className='hidden min-h-0 flex-col lg:flex'>
      <div className='mb-4 flex items-start justify-between gap-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.28em] text-slate-500'>AIR / 文本比较</p>
          <h2 className='mt-2 text-2xl font-semibold tracking-tight text-slate-950'>原文与改写对照</h2>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-600'>
            左边保留原文，右边显示最新改写结果。默认先看并排全文，需要时切到差异视图看具体改动。
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={() => setRewriteTextView('side_by_side')}
            className={`rounded-full px-4 py-2 text-sm transition ${
              rewriteTextView === 'side_by_side'
                ? 'bg-slate-950 text-white'
                : 'border border-slate-200 bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            并排
          </button>
          <button
            type='button'
            onClick={() => setRewriteTextView('diff')}
            className={`rounded-full px-4 py-2 text-sm transition ${
              rewriteTextView === 'diff'
                ? 'bg-slate-950 text-white'
                : 'border border-slate-200 bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            差异
          </button>
        </div>
      </div>

      {rewriteTextView === 'side_by_side'
        ? (
          <div className='grid min-h-0 flex-1 gap-4 xl:grid-cols-2'>
            <article className='flex min-h-0 flex-col rounded-[1.5rem] border border-white/70 bg-white/95 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
              <div className='border-b border-slate-200 px-4 py-3'>
                <div className='text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>原文</div>
              </div>
              <div
                ref={beforeScrollRef}
                onScroll={() => handleSideScroll('before')}
                className='min-h-0 flex-1 overflow-y-auto px-4 py-4'
              >
                <div className='mb-4 flex flex-wrap gap-2 text-xs'>
                  <span className='rounded-full bg-rose-100 px-3 py-1 text-rose-700'>删除 / 替换前</span>
                  <span className='rounded-full bg-slate-100 px-3 py-1 text-slate-600'>保留</span>
                </div>
                <div className='grid gap-3'>
                  {sideBySideRows.length
                    ? sideBySideRows.map((row, index) => (
                      <button
                        key={`before-${index}`}
                        ref={(node) => {
                          beforeRowRefs.current[index] = node
                        }}
                        type='button'
                        onClick={() => {
                          focusRow(index, 'before')
                          handleSelectRewriteSegment({
                            rowIndex: index,
                            beforeText: row.beforeText,
                            afterText: row.afterText
                          })
                        }}
                        className={`rounded-[1.25rem] p-3 text-left transition ${
                          activeRowIndex === index
                            ? 'bg-sky-100 ring-2 ring-sky-200'
                            : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <DiffSegments segments={row.beforeSegments} tone='removed' emptyLabel='本段在改写后新增。' />
                        {row.beforeText
                          ? (
                            <div className='mt-3 flex justify-end'>
                              <span className={`rounded-full px-3 py-1 text-xs ${
                                rewriteSelection?.active && rewriteSelection?.rowIndex === index
                                  ? localDeltaClass
                                  : 'bg-white text-slate-600'
                              }`}
                              >
                                {rewriteSelection?.active && rewriteSelection?.rowIndex === index
                                  ? (localDeltaLabel || '当前局部重写段')
                                  : '点击选中局部重写'}
                              </span>
                            </div>
                            )
                          : null}
                      </button>
                    ))
                    : <div className='rounded-[1.25rem] bg-slate-100 p-4 text-sm leading-6 text-slate-600'>还没有可比较的原文内容。</div>}
                </div>
              </div>
            </article>

            <article className='flex min-h-0 flex-col rounded-[1.5rem] border border-white/70 bg-white/95 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
              <div className='border-b border-slate-200 px-4 py-3'>
                <div className='text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>改写后</div>
              </div>
              <div
                ref={afterScrollRef}
                onScroll={() => handleSideScroll('after')}
                className='min-h-0 flex-1 overflow-y-auto px-4 py-4'
              >
                <div className='mb-4 flex flex-wrap gap-2 text-xs'>
                  <span className='rounded-full bg-emerald-100 px-3 py-1 text-emerald-700'>新增 / 替换后</span>
                  <span className='rounded-full bg-slate-100 px-3 py-1 text-slate-600'>保留</span>
                </div>
                <div className='grid gap-3'>
                  {sideBySideRows.length
                    ? sideBySideRows.map((row, index) => (
                      <button
                        key={`after-${index}`}
                        ref={(node) => {
                          afterRowRefs.current[index] = node
                        }}
                        type='button'
                        onClick={() => {
                          focusRow(index, 'after')
                          handleSelectRewriteSegment({
                            rowIndex: index,
                            beforeText: row.beforeText,
                            afterText: row.afterText
                          })
                        }}
                        className={`rounded-[1.25rem] p-3 text-left transition ${
                          activeRowIndex === index
                            ? 'bg-sky-100 ring-2 ring-sky-200'
                            : 'bg-emerald-50/30 hover:bg-emerald-50/60'
                        }`}
                      >
                        <DiffSegments segments={row.afterSegments} tone='added' emptyLabel='本段在原文中已删除。' />
                        {row.beforeText
                          ? (
                            <div className='mt-3 flex justify-end'>
                              <span className={`rounded-full px-3 py-1 text-xs ${
                                rewriteSelection?.active && rewriteSelection?.rowIndex === index
                                  ? localDeltaClass
                                  : 'bg-white text-slate-600'
                              }`}
                              >
                                {rewriteSelection?.active && rewriteSelection?.rowIndex === index
                                  ? (localDeltaLabel || '当前局部重写段')
                                  : '点击选中局部重写'}
                              </span>
                            </div>
                            )
                          : null}
                      </button>
                    ))
                    : <div className='rounded-[1.25rem] bg-slate-100 p-4 text-sm leading-6 text-slate-600'>生成后，这里会显示带颜色的改写内容。</div>}
                </div>
              </div>
            </article>
          </div>
          )
        : (
          <div className='min-h-0 flex-1 overflow-y-auto rounded-[1.5rem] border border-white/70 bg-white/90 p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
            <Suspense
              fallback={
                <div className='rounded-[1.25rem] bg-slate-100 p-4 text-sm leading-6 text-slate-600'>
                  正在加载差异视图...
                </div>
              }
            >
              <SlateDiffPanel beforeText={rewriteOriginalText} afterText={rewrittenText} />
            </Suspense>
          </div>
          )}
    </section>
  )
}
