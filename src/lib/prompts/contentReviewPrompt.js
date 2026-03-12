import { analysisBase } from './base/analysisBase'
import { buildAnalysisPrompt } from './buildPrompt'
import { getReviewContextPromptBlocks } from './contexts/reviewContexts'
import { getReviewMetricPromptBlocks } from './metrics/reviewMetrics'
import { reviewAnalysisConstraintPrompt, reviewAnalysisSchemaPrompt } from './schemas/reviewSchema'

export function buildContentReviewPrompt (platform) {
  return buildAnalysisPrompt({
    base: [
      ...analysisBase,
      '当前任务是内容合规审查，不是语言风格分析，也不是法律结论判断。'
    ],
    taskIntro: [
      '请基于输入内容，完成结构化平台风险审查。',
      '分析重点是中文自媒体场景下的违规风险、命中点、整改建议和申诉辅助。'
    ],
    metrics: getReviewMetricPromptBlocks(),
    contexts: getReviewContextPromptBlocks(platform),
    schema: reviewAnalysisSchemaPrompt,
    constraints: reviewAnalysisConstraintPrompt
  })
}
