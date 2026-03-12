import { getRewriteActionBlock } from './actions/rewriteActions'
import { rewriteBase } from './base/rewriteBase'
import { buildPrompt } from './buildPrompt'
import { rewriteConstraintPrompt, rewriteSchemaPrompt } from './schemas/rewriteSchema'

export function buildRewritePrompt ({ view, mode }) {
  const actionBlock = getRewriteActionBlock(view, mode)

  return buildPrompt([
    rewriteBase.join('\n'),
    '任务说明：\n请基于当前页面的分析结论和改写目标，输出一版可直接使用的改写结果。',
    `页面上下文：\n当前页面是 ${view}。`,
    `动作要求：\n${actionBlock.join('\n')}`,
    `输出结构：\n${rewriteSchemaPrompt.join('\n')}`,
    `额外要求：\n${rewriteConstraintPrompt.join('\n')}`
  ])
}
