import { buildLanguageAnalysisPrompt } from './prompts/languageAnalysisPrompt'

export const defaultLanguageAnalysisProfile = {
  temperature: 0.2,
  maxTokens: 1400,
  systemPrompt: buildLanguageAnalysisPrompt()
}
