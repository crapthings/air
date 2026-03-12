import {
  infoMetricMeta,
  languageMetricMeta,
  reviewMetricMeta,
  rewriteModeMeta,
  scriptMetricMeta
} from './appConfig'

export function scoreTone (score) {
  if (score >= 80) return '很高'
  if (score >= 60) return '较强'
  if (score >= 40) return '一般'
  return '偏弱'
}

export function scoreBadgeClass (score, isRiskMetric = false) {
  if (isRiskMetric) {
    if (score >= 80) return 'border border-rose-700/40 bg-rose-600 text-white shadow-sm shadow-rose-900/15'
    if (score >= 60) return 'border border-rose-200 bg-rose-100 text-rose-700 shadow-sm shadow-rose-900/8'
    if (score >= 40) return 'border border-amber-200 bg-amber-100 text-amber-700 shadow-sm shadow-amber-900/8'
    return 'border border-emerald-200 bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-900/8'
  }

  if (score >= 80) return 'border border-emerald-700/40 bg-emerald-600 text-white shadow-sm shadow-emerald-900/15'
  if (score >= 60) return 'border border-emerald-200 bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-900/8'
  if (score >= 40) return 'border border-amber-200 bg-amber-100 text-amber-700 shadow-sm shadow-amber-900/8'
  return 'border border-rose-200 bg-rose-100 text-rose-700 shadow-sm shadow-rose-900/8'
}

export function riskLevelClass (level) {
  if (level === '高') return 'border border-rose-700/40 bg-rose-600 text-white'
  if (level === '中') return 'border border-amber-200 bg-amber-100 text-amber-700'
  if (level === '低') return 'border border-emerald-200 bg-emerald-100 text-emerald-700'
  return 'border border-slate-200 bg-slate-100 text-slate-700'
}

export function severityClass (level) {
  if (level === '高') return 'bg-rose-100 text-rose-700'
  if (level === '中') return 'bg-amber-100 text-amber-700'
  return 'bg-emerald-100 text-emerald-700'
}

export function progressBarClass (score, isRiskMetric = false) {
  if (isRiskMetric) {
    if (score >= 80) return 'bg-rose-600'
    if (score >= 60) return 'bg-rose-400'
    if (score >= 40) return 'bg-amber-400'
    return 'bg-emerald-400'
  }

  if (score >= 80) return 'bg-emerald-600'
  if (score >= 60) return 'bg-emerald-400'
  if (score >= 40) return 'bg-amber-400'
  return 'bg-rose-400'
}

export function buildReviewInput ({ mode, platform, title, body, cover, reviewModeMeta }) {
  return [
    `模式：${reviewModeMeta[mode].label}`,
    `平台：${platform}`,
    `标题：${title || '无'}`,
    `正文：${body || '无'}`,
    `封面文案/口播摘录：${cover || '无'}`
  ].join('\n\n')
}

export function buildScriptInput ({ platform, videoLength, scriptFormat, title, body }) {
  return [
    `平台：${platform}`,
    `视频长度：${videoLength}`,
    `脚本形态：${scriptFormat}`,
    `标题：${title || '无'}`,
    `脚本正文：${body || '无'}`
  ].join('\n\n')
}

export function buildLanguageInput ({ textType, title, body }) {
  return [
    `文本类型：${textType}`,
    `标题：${title || '无'}`,
    `正文：${body || '无'}`
  ].join('\n\n')
}

export function buildRewriteInput ({ view, mode, originalText, summary, problems, suggestions, customInstruction }) {
  return [
    `页面：${view}`,
    `改写目标：${rewriteModeMeta[mode]?.label || mode}`,
    `原文：${originalText || '无'}`,
    `分析总结：${summary || '无'}`,
    `主要问题：${problems.length ? problems.join('；') : '无'}`,
    `改进建议：${suggestions.length ? suggestions.join('；') : '无'}`,
    `补充要求：${customInstruction || '无'}`
  ].join('\n\n')
}

const scriptTotalMeta = [
  { key: 'hook_power', label: '传播效果', isRiskMetric: false },
  { key: 'narrative_power', label: '叙事质量', isRiskMetric: false }
]

function getMetricValue (result, bucket, key) {
  return Number(result?.[bucket]?.[key] ?? 0)
}

export function buildRewriteComparisonRows (view, comparison) {
  const beforeResult = comparison?.beforeResult
  const afterResult = comparison?.afterResult

  if (!beforeResult || !afterResult) {
    return []
  }

  if (view === 'analyzer') {
    return infoMetricMeta.map((metric) => {
      const before = getMetricValue(beforeResult, 'scores', metric.key)
      const after = getMetricValue(afterResult, 'scores', metric.key)
      return { key: metric.key, label: metric.label, before, after, delta: after - before, isRiskMetric: metric.key === 'manipulation' }
    })
  }

  if (view === 'script') {
    const totalRows = scriptTotalMeta.map((metric) => {
      const before = getMetricValue(beforeResult, 'totals', metric.key)
      const after = getMetricValue(afterResult, 'totals', metric.key)
      return { key: metric.key, label: metric.label, before, after, delta: after - before, isRiskMetric: false }
    })

    const metricRows = scriptMetricMeta.map((metric) => {
      const before = getMetricValue(beforeResult, 'scores', metric.key)
      const after = getMetricValue(afterResult, 'scores', metric.key)
      return { key: metric.key, label: metric.label, before, after, delta: after - before, isRiskMetric: false }
    })

    return [...totalRows, ...metricRows]
  }

  if (view === 'language') {
    return languageMetricMeta.map((metric) => {
      const before = getMetricValue(beforeResult, 'scores', metric.key)
      const after = getMetricValue(afterResult, 'scores', metric.key)
      return { key: metric.key, label: metric.label, before, after, delta: after - before, isRiskMetric: false }
    })
  }

  if (view === 'review') {
    return reviewMetricMeta.map((metric) => {
      const before = getMetricValue(beforeResult, 'scores', metric.key)
      const after = getMetricValue(afterResult, 'scores', metric.key)
      return { key: metric.key, label: metric.label, before, after, delta: after - before, isRiskMetric: true }
    })
  }

  return []
}

function splitDiffParagraphs (text) {
  return String(text ?? '')
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function buildTextDiffBlocks (beforeText, afterText) {
  const beforeBlocks = splitDiffParagraphs(beforeText)
  const afterBlocks = splitDiffParagraphs(afterText)

  if (!beforeBlocks.length && !afterBlocks.length) {
    return []
  }

  const dp = Array.from({ length: beforeBlocks.length + 1 }, () =>
    Array.from({ length: afterBlocks.length + 1 }, () => 0)
  )

  for (let i = beforeBlocks.length - 1; i >= 0; i -= 1) {
    for (let j = afterBlocks.length - 1; j >= 0; j -= 1) {
      if (beforeBlocks[i] === afterBlocks[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  const blocks = []
  let i = 0
  let j = 0

  while (i < beforeBlocks.length && j < afterBlocks.length) {
    if (beforeBlocks[i] === afterBlocks[j]) {
      blocks.push({ type: 'same', text: beforeBlocks[i] })
      i += 1
      j += 1
      continue
    }

    if (dp[i + 1][j] >= dp[i][j + 1]) {
      blocks.push({ type: 'removed', text: beforeBlocks[i] })
      i += 1
      continue
    }

    blocks.push({ type: 'added', text: afterBlocks[j] })
    j += 1
  }

  while (i < beforeBlocks.length) {
    blocks.push({ type: 'removed', text: beforeBlocks[i] })
    i += 1
  }

  while (j < afterBlocks.length) {
    blocks.push({ type: 'added', text: afterBlocks[j] })
    j += 1
  }

  return blocks
}

function tokenizeDiffText (text) {
  return String(text ?? '').match(/\s+|[\u4e00-\u9fff]|[A-Za-z0-9_]+|[^\s]/g) || []
}

export function buildInlineDiffSegments (beforeText, afterText) {
  const beforeTokens = tokenizeDiffText(beforeText)
  const afterTokens = tokenizeDiffText(afterText)

  if (!beforeTokens.length && !afterTokens.length) {
    return { before: [], after: [] }
  }

  const dp = Array.from({ length: beforeTokens.length + 1 }, () =>
    Array.from({ length: afterTokens.length + 1 }, () => 0)
  )

  for (let i = beforeTokens.length - 1; i >= 0; i -= 1) {
    for (let j = afterTokens.length - 1; j >= 0; j -= 1) {
      if (beforeTokens[i] === afterTokens[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  const beforeSegments = []
  const afterSegments = []
  let i = 0
  let j = 0

  while (i < beforeTokens.length && j < afterTokens.length) {
    if (beforeTokens[i] === afterTokens[j]) {
      beforeSegments.push({ text: beforeTokens[i], changed: false })
      afterSegments.push({ text: afterTokens[j], changed: false })
      i += 1
      j += 1
      continue
    }

    if (dp[i + 1][j] >= dp[i][j + 1]) {
      beforeSegments.push({ text: beforeTokens[i], changed: true })
      i += 1
      continue
    }

    afterSegments.push({ text: afterTokens[j], changed: true })
    j += 1
  }

  while (i < beforeTokens.length) {
    beforeSegments.push({ text: beforeTokens[i], changed: true })
    i += 1
  }

  while (j < afterTokens.length) {
    afterSegments.push({ text: afterTokens[j], changed: true })
    j += 1
  }

  return {
    before: beforeSegments,
    after: afterSegments
  }
}

export function buildSideBySideDiffRows (beforeText, afterText) {
  const blocks = buildTextDiffBlocks(beforeText, afterText)

  if (!blocks.length) {
    return []
  }

  const rows = []

  for (let index = 0; index < blocks.length; index += 1) {
    const currentBlock = blocks[index]
    const nextBlock = blocks[index + 1]
    const isReplacementPair =
      currentBlock?.type === 'removed' && nextBlock?.type === 'added'

    if (isReplacementPair) {
      const inlineSegments = buildInlineDiffSegments(currentBlock.text, nextBlock.text)
      rows.push({
        type: 'replace',
        beforeText: currentBlock.text,
        afterText: nextBlock.text,
        beforeSegments: inlineSegments.before,
        afterSegments: inlineSegments.after
      })
      index += 1
      continue
    }

    if (currentBlock.type === 'same') {
      const sameSegments = [{ text: currentBlock.text, changed: false }]
      rows.push({
        type: 'same',
        beforeText: currentBlock.text,
        afterText: currentBlock.text,
        beforeSegments: sameSegments,
        afterSegments: sameSegments
      })
      continue
    }

    if (currentBlock.type === 'removed') {
      rows.push({
        type: 'removed',
        beforeText: currentBlock.text,
        afterText: '',
        beforeSegments: [{ text: currentBlock.text, changed: true }],
        afterSegments: []
      })
      continue
    }

    rows.push({
      type: 'added',
      beforeText: '',
      afterText: currentBlock.text,
      beforeSegments: [],
      afterSegments: [{ text: currentBlock.text, changed: true }]
    })
  }

  return rows
}

export function replaceFirstOccurrence (fullText, targetText, replacementText) {
  const source = String(fullText ?? '')
  const target = String(targetText ?? '')
  const replacement = String(replacementText ?? '')

  if (!target) {
    return source
  }

  const index = source.indexOf(target)

  if (index === -1) {
    return source
  }

  return `${source.slice(0, index)}${replacement}${source.slice(index + target.length)}`
}

export function buildLocalRewriteHint (beforeText, afterText) {
  const beforeLength = String(beforeText ?? '').trim().length
  const afterLength = String(afterText ?? '').trim().length

  if (!beforeLength || !afterLength) {
    return {
      tone: 'neutral',
      label: '等待判断',
      message: '生成局部改写后，这里会给出一条轻量提示。'
    }
  }

  const ratio = afterLength / beforeLength

  if (ratio < 0.72) {
    return {
      tone: 'positive',
      label: '更压缩',
      message: '这段明显更短，通常更利于收紧表达，但要留意是否删掉了关键限定。'
    }
  }

  if (ratio > 1.45) {
    return {
      tone: 'warning',
      label: '更展开',
      message: '这段被明显拉长了，可能补充了信息，也可能开始拖慢节奏。'
    }
  }

  if (ratio > 1.15 || ratio < 0.9) {
    return {
      tone: 'neutral',
      label: '改动适中',
      message: '长度变化可控，重点看它是否真的把问题改准了。'
    }
  }

  return {
    tone: 'neutral',
    label: '结构稳定',
    message: '长度变化不大，更像是在原表达上做局部提纯或措辞调整。'
  }
}

export function buildLocalReanalysisSummary (view, beforeResult, afterResult) {
  const rows = buildRewriteComparisonRows(view, {
    beforeResult,
    afterResult
  })

  const topChanges = rows
    .filter((row) => row.delta !== 0)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))
    .slice(0, 3)

  return {
    rows,
    topChanges
  }
}
