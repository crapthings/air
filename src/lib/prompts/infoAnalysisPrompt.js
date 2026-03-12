import { analysisBase } from './base/analysisBase'
import { buildAnalysisPrompt } from './buildPrompt'
import { getInfoMetricPromptBlocks } from './metrics/infoMetrics'
import { infoAnalysisConstraintPrompt, infoAnalysisSchemaPrompt } from './schemas/infoSchema'

export function buildInfoAnalysisPrompt () {
  return buildAnalysisPrompt({
    base: [
      ...analysisBase,
      '当前任务是评估内容是否真的有认知价值，而不是评价文风是否讨喜。'
    ],
    taskIntro: [
      '请基于输入内容，完成结构化信息质量分析。',
      '分析重点是真假、证据、信息密度、洞察力、表达清晰度与操控倾向。'
    ],
    metrics: getInfoMetricPromptBlocks(),
    contexts: [],
    schema: infoAnalysisSchemaPrompt,
    constraints: infoAnalysisConstraintPrompt
  })
}
