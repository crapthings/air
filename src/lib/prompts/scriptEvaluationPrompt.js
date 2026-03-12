import { analysisBase } from './base/analysisBase'
import { buildAnalysisPrompt } from './buildPrompt'
import { getScriptContextPromptBlocks } from './contexts/scriptContexts'
import { getScriptMetricPromptBlocks } from './metrics/scriptMetrics'
import {
  scriptEvaluationConstraintPrompt,
  scriptEvaluationSchemaPrompt
} from './schemas/scriptSchema'

export function buildScriptEvaluationPrompt (platform) {
  return buildAnalysisPrompt({
    base: [
      ...analysisBase,
      '当前任务是评估视频脚本，而不是评价普通文章。'
    ],
    taskIntro: [
      '请基于输入脚本，完成结构化视频脚本评估。',
      '分析重点是传播效果和叙事质量，不要把脚本直接改写成成品。'
    ],
    metrics: getScriptMetricPromptBlocks(),
    contexts: getScriptContextPromptBlocks(platform),
    schema: scriptEvaluationSchemaPrompt,
    constraints: scriptEvaluationConstraintPrompt
  })
}
