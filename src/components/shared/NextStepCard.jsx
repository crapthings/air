export function NextStepCard ({ description, onClick }) {
  return (
    <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
      <div className='mb-4'>
        <p className='text-sm font-medium text-slate-500'>下一步</p>
        <p className='mt-2 text-sm leading-6 text-slate-600'>{description}</p>
      </div>
      <button
        type='button'
        onClick={onClick}
        className='rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800'
      >
        直接帮我改
      </button>
    </article>
  )
}
