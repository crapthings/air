import { buildScriptEvaluationPrompt } from './prompts/scriptEvaluationPrompt'

export const defaultScriptEvaluationProfile = {
  temperature: 0.2,
  maxTokens: 1400,
  systemPrompt: buildScriptEvaluationPrompt('通用')
}

export { buildScriptEvaluationPrompt }
