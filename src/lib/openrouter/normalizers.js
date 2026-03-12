import { normalizeScore, normalizeScoreMap } from './utils'

const INFO_SCORE_KEYS = ['confidence', 'verifiability', 'signal', 'clarity', 'insight', 'taste', 'manipulation']
const REVIEW_SCORE_KEYS = [
  'violation_risk',
  'marketing_risk',
  'medical_risk',
  'financial_risk',
  'vulgarity_risk',
  'traffic_redirect_risk',
  'headline_misleading_risk'
]
const SCRIPT_TOTAL_KEYS = ['hook_power', 'narrative_power']
const SCRIPT_SCORE_KEYS = [
  'hook_strength',
  'retention_potential',
  'rhythm_control',
  'memorability',
  'setup_clarity',
  'conflict_strength',
  'structure_integrity',
  'emotion_build'
]
const LANGUAGE_SCORE_KEYS = [
  'syntax_control',
  'long_sentence_control',
  'rhetoric_effectiveness',
  'rhythm_structure',
  'tone_stability',
  'expressive_tension',
  'style_distinctness',
  'posture_density'
]

export function normalizeAnalysis (data) {
  return {
    scores: normalizeScoreMap(data?.scores, INFO_SCORE_KEYS),
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

export function normalizeReview (data) {
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
    scores: normalizeScoreMap(data?.scores, REVIEW_SCORE_KEYS),
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

export function normalizeScriptEvaluation (data) {
  const strengths = Array.isArray(data?.strengths)
    ? data.strengths.slice(0, 4).map((item) => String(item ?? ''))
    : []

  const problems = Array.isArray(data?.problems)
    ? data.problems.slice(0, 5).map((item) => String(item ?? ''))
    : []

  const normalizedScores = normalizeScoreMap(data?.scores, SCRIPT_SCORE_KEYS)
  const shouldUpscaleTotals =
    SCRIPT_SCORE_KEYS.some((key) => Number(data?.scores?.[key]) > 0) &&
    SCRIPT_SCORE_KEYS.every((key) => {
      const value = Number(data?.scores?.[key])
      return !Number.isFinite(value) || (value >= 0 && value <= 10)
    })

  return {
    summary: String(data?.summary ?? ''),
    totals: Object.fromEntries(
      SCRIPT_TOTAL_KEYS.map((key) => {
        const rawValue = Number(data?.totals?.[key])
        const nextValue = shouldUpscaleTotals ? rawValue * 10 : rawValue
        return [key, normalizeScore(nextValue)]
      })
    ),
    scores: normalizedScores,
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

export function normalizeLanguageAnalysis (data) {
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
    scores: normalizeScoreMap(data?.scores, LANGUAGE_SCORE_KEYS),
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
    auxiliary: {
      keywords: Array.isArray(data?.auxiliary?.keywords)
        ? data.auxiliary.keywords.slice(0, 6).map((item) => String(item ?? '')).filter(Boolean)
        : [],
      repetitionNote: String(data?.auxiliary?.repetition_note ?? ''),
      transitionNote: String(data?.auxiliary?.transition_note ?? ''),
      homogenizationNote: String(data?.auxiliary?.homogenization_note ?? '')
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

export function normalizeRewrite (data) {
  const changeNotes = Array.isArray(data?.change_notes)
    ? data.change_notes.slice(0, 4).map((item) => String(item ?? ''))
    : []

  return {
    rewrittenText: String(data?.rewritten_text ?? ''),
    changeNotes,
    appliedFocus: String(data?.applied_focus ?? '')
  }
}
