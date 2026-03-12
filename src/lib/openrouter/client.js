import { extractTextContent } from './utils'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function requestOpenRouter ({ apiKey, model, systemPrompt, input, temperature, maxTokens }) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AIR'
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: maxTokens,
      response_format: {
        type: 'json_object'
      },
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: input
        }
      ]
    })
  })

  const payload = await response.json()

  if (!response.ok) {
    const message =
      payload?.error?.message || payload?.message || 'OpenRouter 请求失败，请检查 key、模型或网络。'
    throw new Error(message)
  }

  const content = payload?.choices?.[0]?.message?.content
  const text = extractTextContent(content)

  if (!text) {
    throw new Error('模型没有返回可解析的内容。')
  }

  return {
    payload,
    text
  }
}
