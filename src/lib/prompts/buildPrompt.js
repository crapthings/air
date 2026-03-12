function formatSection (title, content) {
  if (!content) {
    return ''
  }

  if (Array.isArray(content)) {
    return `${title}\n${content.join('\n')}`
  }

  return `${title}\n${String(content)}`
}

export function buildPrompt (sections) {
  return sections.filter(Boolean).join('\n\n')
}

export function buildAnalysisPrompt ({ base, taskIntro, metrics, contexts, schema, constraints }) {
  return buildPrompt([
    Array.isArray(base) ? base.join('\n') : base,
    formatSection('任务说明：', taskIntro),
    formatSection('指标说明：', metrics),
    formatSection('上下文要求：', contexts),
    formatSection('输出结构：', schema),
    formatSection('额外要求：', constraints)
  ])
}
