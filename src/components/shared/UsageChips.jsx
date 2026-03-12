export function UsageChips ({ usage }) {
  if (!usage) return null

  return (
    <div className='mt-5 flex flex-wrap gap-2 text-xs text-slate-500'>
      <span className='rounded-full bg-slate-100 px-3 py-1'>输入 {usage.prompt_tokens ?? 0}</span>
      <span className='rounded-full bg-slate-100 px-3 py-1'>输出 {usage.completion_tokens ?? 0}</span>
      <span className='rounded-full bg-slate-100 px-3 py-1'>总计 {usage.total_tokens ?? 0}</span>
    </div>
  )
}
