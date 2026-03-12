import { analysisBase } from './base/analysisBase'
import { buildAnalysisPrompt } from './buildPrompt'
import { getLanguageContextPromptBlocks } from './contexts/languageContexts'
import { getLanguageMetricPromptBlocks } from './metrics/languageMetrics'
import {
  languageAnalysisConstraintPrompt,
  languageAnalysisSchemaPrompt
} from './schemas/languageSchema'

export function buildLanguageAnalysisPrompt () {
  return buildAnalysisPrompt({
    base: [
      ...analysisBase,
      '当前任务是分析一段中文写作在句法、长句控制、修辞、节奏、语气和文风机制上是否成立。',
      '识别修辞不是目的，判断修辞是否改善表达才是目的。',
      '不要把“有修辞”误判为“写得好”。',
      '不要把“句子长”误判为“高级”。',
      '不要把“风格强”误判为“有效”。',
      '不要把“尖锐语气”误判为“有力量”。'
    ],
    taskIntro: [
      '请基于输入文本，完成结构化语言分析。',
      '分析重点是普通中文写作中的句法、长句控制、修辞、节奏、语气和文风机制。'
    ],
    metrics: getLanguageMetricPromptBlocks(),
    contexts: getLanguageContextPromptBlocks(),
    schema: languageAnalysisSchemaPrompt,
    constraints: languageAnalysisConstraintPrompt
  })
}
