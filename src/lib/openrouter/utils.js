export function extractTextContent (content) {
  if (typeof content === 'string') {
    return content
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') {
          return item
        }

        if (item?.type === 'text') {
          return item.text ?? ''
        }

        return ''
      })
      .join('')
  }

  return ''
}

export function parseJsonPayload (text) {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '')
  return JSON.parse(cleaned)
}

export function normalizeScore (value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round(numeric)))
}

export function normalizeScoreMap (rawScores, keys, options = {}) {
  const { allowTenPointScale = true } = options
  const numericEntries = keys
    .map((key) => [key, Number(rawScores?.[key])])
    .filter(([, value]) => Number.isFinite(value))

  const shouldUpscaleTenPointScores =
    allowTenPointScale &&
    numericEntries.length >= 3 &&
    numericEntries.some(([, value]) => value > 0) &&
    numericEntries.every(([, value]) => value >= 0 && value <= 10)

  return Object.fromEntries(
    keys.map((key) => {
      const rawValue = Number(rawScores?.[key])
      const nextValue = shouldUpscaleTenPointScores ? rawValue * 10 : rawValue
      return [key, normalizeScore(nextValue)]
    })
  )
}
