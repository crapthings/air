import { buildInfoAnalysisPrompt } from './prompts/infoAnalysisPrompt'

export const defaultEvaluationProfile = {
  temperature: 0.2,
  maxTokens: 950,
  systemPrompt: buildInfoAnalysisPrompt()
}
