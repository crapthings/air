import { requestOpenRouter } from './openrouter/client'
import {
  normalizeAnalysis,
  normalizeLanguageAnalysis,
  normalizeReview,
  normalizeRewrite,
  normalizeScriptEvaluation
} from './openrouter/normalizers'
import { parseJsonPayload } from './openrouter/utils'

function buildOpenRouterHandler ({ normalizer, errorMessage, resultKey }) {
  return async function handler ({
    apiKey,
    model,
    input,
    systemPrompt,
    temperature,
    maxTokens
  }) {
    const { payload, text } = await requestOpenRouter({
      apiKey,
      model,
      systemPrompt,
      input,
      temperature,
      maxTokens
    })

    try {
      return {
        [resultKey]: normalizer(parseJsonPayload(text)),
        model: payload?.model || model,
        usage: payload?.usage ?? null
      }
    } catch {
      throw new Error(errorMessage)
    }
  }
}

export const analyzeWithOpenRouter = buildOpenRouterHandler({
  normalizer: normalizeAnalysis,
  errorMessage: '模型返回内容不是有效 JSON，请更换模型或调整提示词。',
  resultKey: 'analysis'
})

export const analyzeContentReview = buildOpenRouterHandler({
  normalizer: normalizeReview,
  errorMessage: '审查结果不是有效 JSON，请更换模型或调整提示词。',
  resultKey: 'review'
})

export const analyzeScriptEvaluation = buildOpenRouterHandler({
  normalizer: normalizeScriptEvaluation,
  errorMessage: '脚本评估结果不是有效 JSON，请更换模型或稍后重试。',
  resultKey: 'evaluation'
})

export const analyzeLanguage = buildOpenRouterHandler({
  normalizer: normalizeLanguageAnalysis,
  errorMessage: '语言分析结果不是有效 JSON，请更换模型或稍后重试。',
  resultKey: 'analysis'
})

export const rewriteWithOpenRouter = buildOpenRouterHandler({
  normalizer: normalizeRewrite,
  errorMessage: '改写结果不是有效 JSON，请更换模型或稍后重试。',
  resultKey: 'rewrite'
})
