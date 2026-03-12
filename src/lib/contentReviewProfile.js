import { buildContentReviewPrompt } from './prompts/contentReviewPrompt'

export const defaultContentReviewProfile = {
  temperature: 0.1,
  maxTokens: 1200,
  systemPrompt: buildContentReviewPrompt('通用')
}

export { buildContentReviewPrompt }
