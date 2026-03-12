const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

function extractTextContent (content) {
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

function parseJsonPayload (text) {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '')
  return JSON.parse(cleaned)
}

function normalizeScore (value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round(numeric)))
}

function normalizeAnalysis (data) {
  return {
    scores: {
      confidence: normalizeScore(data?.scores?.confidence),
      verifiability: normalizeScore(data?.scores?.verifiability),
      signal: normalizeScore(data?.scores?.signal),
      clarity: normalizeScore(data?.scores?.clarity),
      insight: normalizeScore(data?.scores?.insight),
      taste: normalizeScore(data?.scores?.taste),
      manipulation: normalizeScore(data?.scores?.manipulation)
    },
    reasons: {
      confidence: String(data?.reasons?.confidence ?? ''),
      verifiability: String(data?.reasons?.verifiability ?? ''),
      signal: String(data?.reasons?.signal ?? ''),
      clarity: String(data?.reasons?.clarity ?? ''),
      insight: String(data?.reasons?.insight ?? ''),
      taste: String(data?.reasons?.taste ?? ''),
      manipulation: String(data?.reasons?.manipulation ?? '')
    },
    summary: String(data?.summary ?? ''),
    profile: {
      thoughtSystemLabel: String(data?.profile?.thought_system_label ?? ''),
      thoughtSystemReason: String(data?.profile?.thought_system_reason ?? ''),
      coreJudgment: String(data?.profile?.core_judgment ?? ''),
      slopRisk: String(data?.profile?.slop_risk ?? ''),
      argumentShape: String(data?.profile?.argument_shape ?? ''),
      attentionWorth: String(data?.profile?.attention_worth ?? ''),
      weakestLink: String(data?.profile?.weakest_link ?? '')
    }
  }
}

function normalizeReview (data) {
  const hitPoints = Array.isArray(data?.hit_points)
    ? data.hit_points.slice(0, 5).map((item) => ({
      text: String(item?.text ?? ''),
      reason: String(item?.reason ?? ''),
      severity: String(item?.severity ?? '中'),
      platformNote: String(item?.platform_note ?? '')
    }))
    : []

  const fixSuggestions = Array.isArray(data?.fix_suggestions)
    ? data.fix_suggestions.slice(0, 4).map((item) => String(item ?? ''))
    : []

  return {
    riskLevel: String(data?.risk_level ?? ''),
    publishRecommendation: String(data?.publish_recommendation ?? ''),
    scores: {
      violation_risk: normalizeScore(data?.scores?.violation_risk),
      marketing_risk: normalizeScore(data?.scores?.marketing_risk),
      medical_risk: normalizeScore(data?.scores?.medical_risk),
      financial_risk: normalizeScore(data?.scores?.financial_risk),
      vulgarity_risk: normalizeScore(data?.scores?.vulgarity_risk),
      traffic_redirect_risk: normalizeScore(data?.scores?.traffic_redirect_risk),
      headline_misleading_risk: normalizeScore(data?.scores?.headline_misleading_risk)
    },
    reasons: {
      violation_risk: String(data?.reasons?.violation_risk ?? ''),
      marketing_risk: String(data?.reasons?.marketing_risk ?? ''),
      medical_risk: String(data?.reasons?.medical_risk ?? ''),
      financial_risk: String(data?.reasons?.financial_risk ?? ''),
      vulgarity_risk: String(data?.reasons?.vulgarity_risk ?? ''),
      traffic_redirect_risk: String(data?.reasons?.traffic_redirect_risk ?? ''),
      headline_misleading_risk: String(data?.reasons?.headline_misleading_risk ?? '')
    },
    hitPoints,
    fixSuggestions,
    appealPotential: String(data?.appeal_potential ?? ''),
    appealReason: String(data?.appeal_reason ?? ''),
    reviewProfile: {
      coreIssue: String(data?.review_profile?.core_issue ?? ''),
      riskStyle: String(data?.review_profile?.risk_style ?? ''),
      platformSensitivity: String(data?.review_profile?.platform_sensitivity ?? ''),
      suggestedAction: String(data?.review_profile?.suggested_action ?? '')
    }
  }
}

function normalizeScriptEvaluation (data) {
  const strengths = Array.isArray(data?.strengths)
    ? data.strengths.slice(0, 4).map((item) => String(item ?? ''))
    : []

  const problems = Array.isArray(data?.problems)
    ? data.problems.slice(0, 5).map((item) => String(item ?? ''))
    : []

  return {
    summary: String(data?.summary ?? ''),
    totals: {
      hook_power: normalizeScore(data?.totals?.hook_power),
      narrative_power: normalizeScore(data?.totals?.narrative_power)
    },
    scores: {
      hook_strength: normalizeScore(data?.scores?.hook_strength),
      retention_potential: normalizeScore(data?.scores?.retention_potential),
      rhythm_control: normalizeScore(data?.scores?.rhythm_control),
      memorability: normalizeScore(data?.scores?.memorability),
      setup_clarity: normalizeScore(data?.scores?.setup_clarity),
      conflict_strength: normalizeScore(data?.scores?.conflict_strength),
      structure_integrity: normalizeScore(data?.scores?.structure_integrity),
      emotion_build: normalizeScore(data?.scores?.emotion_build)
    },
    reasons: {
      hook_strength: String(data?.reasons?.hook_strength ?? ''),
      retention_potential: String(data?.reasons?.retention_potential ?? ''),
      rhythm_control: String(data?.reasons?.rhythm_control ?? ''),
      memorability: String(data?.reasons?.memorability ?? ''),
      setup_clarity: String(data?.reasons?.setup_clarity ?? ''),
      conflict_strength: String(data?.reasons?.conflict_strength ?? ''),
      structure_integrity: String(data?.reasons?.structure_integrity ?? ''),
      emotion_build: String(data?.reasons?.emotion_build ?? '')
    },
    strengths,
    problems,
    revisionSuggestions: {
      opening: String(data?.revision_suggestions?.opening ?? ''),
      middle: String(data?.revision_suggestions?.middle ?? ''),
      ending: String(data?.revision_suggestions?.ending ?? ''),
      format: String(data?.revision_suggestions?.format ?? '')
    },
    fit: {
      bestFormat: String(data?.fit?.best_format ?? ''),
      shortVideoFit: String(data?.fit?.short_video_fit ?? ''),
      longVideoFit: String(data?.fit?.long_video_fit ?? ''),
      platformNote: String(data?.fit?.platform_note ?? '')
    },
    profile: {
      coreSellingPoint: String(data?.profile?.core_selling_point ?? ''),
      biggestWeakness: String(data?.profile?.biggest_weakness ?? ''),
      audiencePull: String(data?.profile?.audience_pull ?? ''),
      storyShape: String(data?.profile?.story_shape ?? '')
    }
  }
}

function normalizeLanguageAnalysis (data) {
  const rhetoricalDevices = Array.isArray(data?.detected_features?.rhetorical_devices)
    ? data.detected_features.rhetorical_devices.slice(0, 5).map((item) => String(item ?? ''))
    : []

  const sentencePatterns = Array.isArray(data?.detected_features?.sentence_patterns)
    ? data.detected_features.sentence_patterns.slice(0, 5).map((item) => String(item ?? ''))
    : []

  const styleModes = Array.isArray(data?.detected_features?.style_modes)
    ? data.detected_features.style_modes.slice(0, 5).map((item) => String(item ?? ''))
    : []

  const problems = Array.isArray(data?.problems)
    ? data.problems.slice(0, 5).map((item) => String(item ?? ''))
    : []

  return {
    summary: String(data?.summary ?? ''),
    scores: {
      syntax_control: normalizeScore(data?.scores?.syntax_control),
      long_sentence_control: normalizeScore(data?.scores?.long_sentence_control),
      rhetoric_effectiveness: normalizeScore(data?.scores?.rhetoric_effectiveness),
      rhythm_structure: normalizeScore(data?.scores?.rhythm_structure),
      tone_stability: normalizeScore(data?.scores?.tone_stability),
      expressive_tension: normalizeScore(data?.scores?.expressive_tension),
      style_distinctness: normalizeScore(data?.scores?.style_distinctness),
      posture_density: normalizeScore(data?.scores?.posture_density)
    },
    reasons: {
      syntax_control: String(data?.reasons?.syntax_control ?? ''),
      long_sentence_control: String(data?.reasons?.long_sentence_control ?? ''),
      rhetoric_effectiveness: String(data?.reasons?.rhetoric_effectiveness ?? ''),
      rhythm_structure: String(data?.reasons?.rhythm_structure ?? ''),
      tone_stability: String(data?.reasons?.tone_stability ?? ''),
      expressive_tension: String(data?.reasons?.expressive_tension ?? ''),
      style_distinctness: String(data?.reasons?.style_distinctness ?? ''),
      posture_density: String(data?.reasons?.posture_density ?? '')
    },
    detectedFeatures: {
      rhetoricalDevices,
      sentencePatterns,
      styleModes
    },
    problems,
    revisionSuggestions: {
      sentence: String(data?.revision_suggestions?.sentence ?? ''),
      rhythm: String(data?.revision_suggestions?.rhythm ?? ''),
      rhetoric: String(data?.revision_suggestions?.rhetoric ?? ''),
      tone: String(data?.revision_suggestions?.tone ?? '')
    },
    commentary: {
      styleSummary: String(data?.commentary?.style_summary ?? ''),
      languageMechanism: String(data?.commentary?.language_mechanism ?? ''),
      dominantEffect: String(data?.commentary?.dominant_effect ?? ''),
      riskNote: String(data?.commentary?.risk_note ?? '')
    },
    profile: {
      coreStrength: String(data?.profile?.core_strength ?? ''),
      coreWeakness: String(data?.profile?.core_weakness ?? ''),
      writerTendency: String(data?.profile?.writer_tendency ?? ''),
      readingExperience: String(data?.profile?.reading_experience ?? '')
    }
  }
}

async function requestOpenRouter ({ apiKey, model, systemPrompt, input, temperature, maxTokens }) {
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

export async function analyzeWithOpenRouter ({
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
      analysis: normalizeAnalysis(parseJsonPayload(text)),
      model: payload?.model || model,
      usage: payload?.usage ?? null
    }
  } catch {
    throw new Error('模型返回内容不是有效 JSON，请更换模型或调整提示词。')
  }
}

export async function analyzeContentReview ({
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
      review: normalizeReview(parseJsonPayload(text)),
      model: payload?.model || model,
      usage: payload?.usage ?? null
    }
  } catch {
    throw new Error('审查结果不是有效 JSON，请更换模型或调整提示词。')
  }
}

export async function analyzeScriptEvaluation ({
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
      evaluation: normalizeScriptEvaluation(parseJsonPayload(text)),
      model: payload?.model || model,
      usage: payload?.usage ?? null
    }
  } catch {
    throw new Error('脚本评估结果不是有效 JSON，请更换模型或稍后重试。')
  }
}

export async function analyzeLanguage ({
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
      analysis: normalizeLanguageAnalysis(parseJsonPayload(text)),
      model: payload?.model || model,
      usage: payload?.usage ?? null
    }
  } catch {
    throw new Error('语言分析结果不是有效 JSON，请更换模型或稍后重试。')
  }
}
