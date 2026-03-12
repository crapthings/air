import { rewriteModeMeta } from './appConfig'

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
