import { useState } from 'react'
import { buildContentReviewPrompt, defaultContentReviewProfile } from './lib/contentReviewProfile'
import { defaultEvaluationProfile } from './lib/evaluationProfile'
import { defaultLanguageAnalysisProfile } from './lib/languageAnalysisProfile'
import { buildScriptEvaluationPrompt, defaultScriptEvaluationProfile } from './lib/scriptEvaluationProfile'
import { analyzeContentReview, analyzeLanguage, analyzeScriptEvaluation, analyzeWithOpenRouter } from './lib/openrouter'
import { useSettingsStore } from './store/useSettingsStore'

const infoMetricMeta = [
  {
    key: 'confidence',
    label: '置信度',
    description: '核心陈述为真的概率有多高。',
    tint: 'from-emerald-400/30 to-emerald-500/5'
  },
  {
    key: 'verifiability',
    label: '可验证性',
    description: '有没有来源、证据、数据和可追溯依据。',
    tint: 'from-cyan-400/30 to-sky-500/5'
  },
  {
    key: 'signal',
    label: '信号强度',
    description: '去掉噪声之后，真正有价值的信息剩下多少。',
    tint: 'from-sky-400/30 to-blue-500/5'
  },
  {
    key: 'clarity',
    label: '清晰度',
    description: '表达是否清楚、结构是否容易理解。',
    tint: 'from-fuchsia-400/25 to-pink-500/5'
  },
  {
    key: 'insight',
    label: '洞察力',
    description: '有没有真实判断，而不是旧话重说或伪深刻。',
    tint: 'from-violet-400/25 to-indigo-500/5'
  },
  {
    key: 'taste',
    label: '品味',
    description: '表达是否克制、准确、有分寸、有审美判断。',
    tint: 'from-amber-300/30 to-orange-400/5'
  },
  {
    key: 'manipulation',
    label: '操控性',
    description: '是否在用情绪、包装和姿态替代真实论证。',
    tint: 'from-rose-400/30 to-red-500/5'
  }
]

const reviewMetricMeta = [
  {
    key: 'violation_risk',
    label: '违规风险',
    description: '整体触碰平台规则或风控阈值的可能性。',
    tint: 'from-rose-400/30 to-red-500/5'
  },
  {
    key: 'marketing_risk',
    label: '广告营销风险',
    description: '极限词、承诺型转化、夸张营销话术。',
    tint: 'from-orange-400/30 to-amber-500/5'
  },
  {
    key: 'medical_risk',
    label: '医疗健康风险',
    description: '疗效、治愈、偏方、替代专业建议。',
    tint: 'from-pink-400/30 to-rose-500/5'
  },
  {
    key: 'financial_risk',
    label: '金融收益风险',
    description: '荐股、带单、保本、收益承诺。',
    tint: 'from-red-400/30 to-orange-500/5'
  },
  {
    key: 'vulgarity_risk',
    label: '低俗攻击风险',
    description: '擦边、侮辱、恶俗、群体攻击。',
    tint: 'from-fuchsia-400/30 to-rose-500/5'
  },
  {
    key: 'traffic_redirect_risk',
    label: '引流导流风险',
    description: '私联、加微、进群、导流私域。',
    tint: 'from-sky-400/30 to-cyan-500/5'
  },
  {
    key: 'headline_misleading_risk',
    label: '误导标题风险',
    description: '标题党、封面党、诱导点击、文案不一致。',
    tint: 'from-violet-400/30 to-purple-500/5'
  }
]

const scriptMetricMeta = [
  {
    key: 'hook_strength',
    label: '3 秒抓力',
    description: '开头有没有立刻建立悬念、反差或利益点。',
    tint: 'from-emerald-400/30 to-lime-500/5'
  },
  {
    key: 'retention_potential',
    label: '完播潜力',
    description: '中段有没有持续推进，观众是否愿意继续看。',
    tint: 'from-cyan-400/30 to-sky-500/5'
  },
  {
    key: 'rhythm_control',
    label: '节奏控制',
    description: '信息爆点、停顿和推进是否安排得当。',
    tint: 'from-blue-400/30 to-indigo-500/5'
  },
  {
    key: 'memorability',
    label: '传播记忆点',
    description: '有没有一句钩子、一个设定或一个画面让人记住。',
    tint: 'from-fuchsia-400/25 to-pink-500/5'
  },
  {
    key: 'setup_clarity',
    label: '设定清晰度',
    description: '人物、目标、关系和前提是否容易理解。',
    tint: 'from-amber-300/30 to-orange-400/5'
  },
  {
    key: 'conflict_strength',
    label: '冲突强度',
    description: '矛盾是否成立，能否真正推动内容往前走。',
    tint: 'from-orange-400/30 to-rose-500/5'
  },
  {
    key: 'structure_integrity',
    label: '结构完整性',
    description: '开场、推进、转折和收束是否成型。',
    tint: 'from-violet-400/30 to-purple-500/5'
  },
  {
    key: 'emotion_build',
    label: '情绪递进',
    description: '情绪是否一层层推上去，而不是始终平着走。',
    tint: 'from-rose-400/30 to-red-500/5'
  }
]

const languageMetricMeta = [
  {
    key: 'syntax_control',
    label: '句法控制',
    description: '句子结构是否稳定，不缠绕、不跳接。',
    tint: 'from-sky-400/30 to-cyan-500/5'
  },
  {
    key: 'long_sentence_control',
    label: '长句控制力',
    description: '长句是否带来推进和层次，而不是纯负担。',
    tint: 'from-indigo-400/30 to-blue-500/5'
  },
  {
    key: 'rhetoric_effectiveness',
    label: '修辞有效性',
    description: '修辞是在增强判断，还是只在装饰表达。',
    tint: 'from-violet-400/30 to-fuchsia-500/5'
  },
  {
    key: 'rhythm_structure',
    label: '节奏组织',
    description: '长短句、停顿和推进是否形成可感知的节奏。',
    tint: 'from-emerald-400/30 to-lime-500/5'
  },
  {
    key: 'tone_stability',
    label: '语气稳定性',
    description: '判断、抒情、讽刺等语气是否稳定，不乱跳。',
    tint: 'from-amber-300/30 to-orange-400/5'
  },
  {
    key: 'expressive_tension',
    label: '表达张力',
    description: '语言是否有压强、牵引力和推进感。',
    tint: 'from-orange-400/30 to-rose-500/5'
  },
  {
    key: 'style_distinctness',
    label: '文风辨识度',
    description: '有没有形成可识别的表达方式。',
    tint: 'from-fuchsia-400/25 to-pink-500/5'
  },
  {
    key: 'posture_density',
    label: '姿态密度',
    description: '立姿态、摆气质、演判断的密度是否过量。',
    tint: 'from-rose-400/30 to-red-500/5'
  }
]

const emptyInfoScores = {
  confidence: 0,
  verifiability: 0,
  signal: 0,
  clarity: 0,
  insight: 0,
  taste: 0,
  manipulation: 0
}

const emptyInfoReasons = {
  confidence: '',
  verifiability: '',
  signal: '',
  clarity: '',
  insight: '',
  taste: '',
  manipulation: ''
}

const emptyInfoProfile = {
  coreJudgment: '',
  slopRisk: '',
  argumentShape: '',
  attentionWorth: '',
  weakestLink: '',
  thoughtSystemLabel: '',
  thoughtSystemReason: ''
}

const emptyReviewResult = {
  riskLevel: '',
  publishRecommendation: '',
  scores: {
    violation_risk: 0,
    marketing_risk: 0,
    medical_risk: 0,
    financial_risk: 0,
    vulgarity_risk: 0,
    traffic_redirect_risk: 0,
    headline_misleading_risk: 0
  },
  reasons: {
    violation_risk: '',
    marketing_risk: '',
    medical_risk: '',
    financial_risk: '',
    vulgarity_risk: '',
    traffic_redirect_risk: '',
    headline_misleading_risk: ''
  },
  hitPoints: [],
  fixSuggestions: [],
  appealPotential: '',
  appealReason: '',
  reviewProfile: {
    coreIssue: '',
    riskStyle: '',
    platformSensitivity: '',
    suggestedAction: ''
  }
}

const emptyScriptResult = {
  summary: '',
  totals: {
    hook_power: 0,
    narrative_power: 0
  },
  scores: {
    hook_strength: 0,
    retention_potential: 0,
    rhythm_control: 0,
    memorability: 0,
    setup_clarity: 0,
    conflict_strength: 0,
    structure_integrity: 0,
    emotion_build: 0
  },
  reasons: {
    hook_strength: '',
    retention_potential: '',
    rhythm_control: '',
    memorability: '',
    setup_clarity: '',
    conflict_strength: '',
    structure_integrity: '',
    emotion_build: ''
  },
  strengths: [],
  problems: [],
  revisionSuggestions: {
    opening: '',
    middle: '',
    ending: '',
    format: ''
  },
  fit: {
    bestFormat: '',
    shortVideoFit: '',
    longVideoFit: '',
    platformNote: ''
  },
  profile: {
    coreSellingPoint: '',
    biggestWeakness: '',
    audiencePull: '',
    storyShape: ''
  }
}

const emptyLanguageResult = {
  summary: '',
  scores: {
    syntax_control: 0,
    long_sentence_control: 0,
    rhetoric_effectiveness: 0,
    rhythm_structure: 0,
    tone_stability: 0,
    expressive_tension: 0,
    style_distinctness: 0,
    posture_density: 0
  },
  reasons: {
    syntax_control: '',
    long_sentence_control: '',
    rhetoric_effectiveness: '',
    rhythm_structure: '',
    tone_stability: '',
    expressive_tension: '',
    style_distinctness: '',
    posture_density: ''
  },
  detectedFeatures: {
    rhetoricalDevices: [],
    sentencePatterns: [],
    styleModes: []
  },
  problems: [],
  revisionSuggestions: {
    sentence: '',
    rhythm: '',
    rhetoric: '',
    tone: ''
  },
  commentary: {
    styleSummary: '',
    languageMechanism: '',
    dominantEffect: '',
    riskNote: ''
  },
  profile: {
    coreStrength: '',
    coreWeakness: '',
    writerTendency: '',
    readingExperience: ''
  }
}

const reviewModeMeta = {
  preflight: {
    label: '发布前自检',
    description: '重点看哪些地方危险、怎么改能过。'
  },
  review: {
    label: '内容复核',
    description: '重点解释为什么会被判风险、依据是什么。'
  },
  appeal: {
    label: '申诉辅助',
    description: '重点区分哪些点适合申诉，哪些点不值得申诉。'
  }
}

const reviewPlatforms = ['通用', '小红书', '抖音', '视频号', '公众号']
const scriptPlatforms = ['通用', '抖音', '小红书', '视频号', 'B站']
const scriptLengthOptions = ['短视频', '长视频']
const scriptFormatOptions = ['纯文案', '分镜脚本']
const languageTextTypes = ['通用', '评论', '随笔', '议论文', '叙述文']

function scoreTone (score) {
  if (score >= 80) return '很高'
  if (score >= 60) return '较强'
  if (score >= 40) return '一般'
  return '偏弱'
}

function scoreBadgeClass (score, isRiskMetric = false) {
  if (isRiskMetric) {
    if (score >= 80) return 'border border-rose-700/40 bg-rose-600 text-white shadow-sm shadow-rose-900/15'
    if (score >= 60) { return 'border border-rose-200 bg-rose-100 text-rose-700 shadow-sm shadow-rose-900/8' }
    if (score >= 40) { return 'border border-amber-200 bg-amber-100 text-amber-700 shadow-sm shadow-amber-900/8' }
    return 'border border-emerald-200 bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-900/8'
  }

  if (score >= 80) return 'border border-emerald-700/40 bg-emerald-600 text-white shadow-sm shadow-emerald-900/15'
  if (score >= 60) { return 'border border-emerald-200 bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-900/8' }
  if (score >= 40) { return 'border border-amber-200 bg-amber-100 text-amber-700 shadow-sm shadow-amber-900/8' }
  return 'border border-rose-200 bg-rose-100 text-rose-700 shadow-sm shadow-rose-900/8'
}

function riskLevelClass (level) {
  if (level === '高') return 'border border-rose-700/40 bg-rose-600 text-white'
  if (level === '中') return 'border border-amber-200 bg-amber-100 text-amber-700'
  if (level === '低') return 'border border-emerald-200 bg-emerald-100 text-emerald-700'
  return 'border border-slate-200 bg-slate-100 text-slate-700'
}

function severityClass (level) {
  if (level === '高') return 'bg-rose-100 text-rose-700'
  if (level === '中') return 'bg-amber-100 text-amber-700'
  return 'bg-emerald-100 text-emerald-700'
}

function progressBarClass (score, isRiskMetric = false) {
  if (isRiskMetric) {
    if (score >= 80) return 'bg-rose-600'
    if (score >= 60) return 'bg-rose-400'
    if (score >= 40) return 'bg-amber-400'
    return 'bg-emerald-400'
  }

  if (score >= 80) return 'bg-emerald-600'
  if (score >= 60) return 'bg-emerald-400'
  if (score >= 40) return 'bg-amber-400'
  return 'bg-rose-400'
}

function buildReviewInput ({ mode, platform, title, body, cover }) {
  return [
    `模式：${reviewModeMeta[mode].label}`,
    `平台：${platform}`,
    `标题：${title || '无'}`,
    `正文：${body || '无'}`,
    `封面文案/口播摘录：${cover || '无'}`
  ].join('\n\n')
}

function buildScriptInput ({ platform, videoLength, scriptFormat, title, body }) {
  return [
    `平台：${platform}`,
    `视频长度：${videoLength}`,
    `脚本形态：${scriptFormat}`,
    `标题：${title || '无'}`,
    `脚本正文：${body || '无'}`
  ].join('\n\n')
}

function buildLanguageInput ({ textType, title, body }) {
  return [
    `文本类型：${textType}`,
    `标题：${title || '无'}`,
    `正文：${body || '无'}`
  ].join('\n\n')
}

export default function App () {
  const [view, setView] = useState('analyzer')

  const [infoInput, setInfoInput] = useState('')
  const [infoScores, setInfoScores] = useState(emptyInfoScores)
  const [infoReasons, setInfoReasons] = useState(emptyInfoReasons)
  const [infoSummary, setInfoSummary] = useState('')
  const [infoProfile, setInfoProfile] = useState(emptyInfoProfile)
  const [infoUsage, setInfoUsage] = useState(null)
  const [infoActiveModel, setInfoActiveModel] = useState('')
  const [infoError, setInfoError] = useState('')
  const [isInfoAnalyzing, setIsInfoAnalyzing] = useState(false)

  const [reviewMode, setReviewMode] = useState('preflight')
  const [reviewPlatform, setReviewPlatform] = useState('通用')
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewBody, setReviewBody] = useState('')
  const [reviewCover, setReviewCover] = useState('')
  const [reviewResult, setReviewResult] = useState(emptyReviewResult)
  const [reviewUsage, setReviewUsage] = useState(null)
  const [reviewActiveModel, setReviewActiveModel] = useState('')
  const [reviewError, setReviewError] = useState('')
  const [isReviewAnalyzing, setIsReviewAnalyzing] = useState(false)

  const [scriptPlatform, setScriptPlatform] = useState('通用')
  const [scriptVideoLength, setScriptVideoLength] = useState('短视频')
  const [scriptFormat, setScriptFormat] = useState('纯文案')
  const [scriptTitle, setScriptTitle] = useState('')
  const [scriptBody, setScriptBody] = useState('')
  const [scriptResult, setScriptResult] = useState(emptyScriptResult)
  const [scriptUsage, setScriptUsage] = useState(null)
  const [scriptActiveModel, setScriptActiveModel] = useState('')
  const [scriptError, setScriptError] = useState('')
  const [isScriptAnalyzing, setIsScriptAnalyzing] = useState(false)

  const [languageTextType, setLanguageTextType] = useState('通用')
  const [languageTitle, setLanguageTitle] = useState('')
  const [languageBody, setLanguageBody] = useState('')
  const [languageResult, setLanguageResult] = useState(emptyLanguageResult)
  const [languageUsage, setLanguageUsage] = useState(null)
  const [languageActiveModel, setLanguageActiveModel] = useState('')
  const [languageError, setLanguageError] = useState('')
  const [isLanguageAnalyzing, setIsLanguageAnalyzing] = useState(false)

  const openRouterApiKey = useSettingsStore((state) => state.openRouterApiKey)
  const openRouterModelId = useSettingsStore((state) => state.openRouterModelId)
  const customSystemPrompt = useSettingsStore((state) => state.customSystemPrompt)
  const customTemperature = useSettingsStore((state) => state.customTemperature)
  const setOpenRouterApiKey = useSettingsStore((state) => state.setOpenRouterApiKey)
  const setOpenRouterModelId = useSettingsStore((state) => state.setOpenRouterModelId)
  const setCustomSystemPrompt = useSettingsStore((state) => state.setCustomSystemPrompt)
  const setCustomTemperature = useSettingsStore((state) => state.setCustomTemperature)
  const resetEvaluationSettings = useSettingsStore((state) => state.resetEvaluationSettings)

  const parsedTemperature = Number(customTemperature)
  const resolvedInfoTemperature =
    customTemperature === '' || !Number.isFinite(parsedTemperature)
      ? defaultEvaluationProfile.temperature
      : Math.min(2, Math.max(0, parsedTemperature))
  const resolvedReviewTemperature =
    customTemperature === '' || !Number.isFinite(parsedTemperature)
      ? defaultContentReviewProfile.temperature
      : Math.min(2, Math.max(0, parsedTemperature))
  const resolvedScriptTemperature =
    customTemperature === '' || !Number.isFinite(parsedTemperature)
      ? defaultScriptEvaluationProfile.temperature
      : Math.min(2, Math.max(0, parsedTemperature))
  const resolvedLanguageTemperature =
    customTemperature === '' || !Number.isFinite(parsedTemperature)
      ? defaultLanguageAnalysisProfile.temperature
      : Math.min(2, Math.max(0, parsedTemperature))
  const resolvedInfoPrompt = customSystemPrompt.trim() || defaultEvaluationProfile.systemPrompt

  const maskedApiKey = openRouterApiKey
    ? `${openRouterApiKey.slice(0, 6)}...${openRouterApiKey.slice(-4)}`
    : '未配置'

  async function handleInfoAnalyze () {
    const trimmedInput = infoInput.trim()

    if (!trimmedInput) {
      setInfoError('请先输入要分析的内容。')
      return
    }

    if (!openRouterApiKey.trim()) {
      setInfoError('请先在设置页填写 OpenRouter API Key。')
      setView('settings')
      return
    }

    if (!openRouterModelId.trim()) {
      setInfoError('请先在设置页填写模型 ID。')
      setView('settings')
      return
    }

    setIsInfoAnalyzing(true)
    setInfoError('')

    try {
      const result = await analyzeWithOpenRouter({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: trimmedInput,
        systemPrompt: resolvedInfoPrompt,
        temperature: resolvedInfoTemperature,
        maxTokens: defaultEvaluationProfile.maxTokens
      })

      setInfoScores(result.analysis.scores)
      setInfoReasons(result.analysis.reasons)
      setInfoSummary(result.analysis.summary)
      setInfoProfile(result.analysis.profile)
      setInfoActiveModel(result.model)
      setInfoUsage(result.usage)
    } catch (analysisError) {
      setInfoError(analysisError.message)
    } finally {
      setIsInfoAnalyzing(false)
    }
  }

  async function handleReviewAnalyze () {
    if (!reviewTitle.trim() && !reviewBody.trim() && !reviewCover.trim()) {
      setReviewError('请至少输入标题、正文或封面文案中的一项。')
      return
    }

    if (!openRouterApiKey.trim()) {
      setReviewError('请先在设置页填写 OpenRouter API Key。')
      setView('settings')
      return
    }

    if (!openRouterModelId.trim()) {
      setReviewError('请先在设置页填写模型 ID。')
      setView('settings')
      return
    }

    setIsReviewAnalyzing(true)
    setReviewError('')

    try {
      const result = await analyzeContentReview({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: buildReviewInput({
          mode: reviewMode,
          platform: reviewPlatform,
          title: reviewTitle.trim(),
          body: reviewBody.trim(),
          cover: reviewCover.trim()
        }),
        systemPrompt: buildContentReviewPrompt(reviewPlatform),
        temperature: resolvedReviewTemperature,
        maxTokens: defaultContentReviewProfile.maxTokens
      })

      setReviewResult(result.review)
      setReviewActiveModel(result.model)
      setReviewUsage(result.usage)
    } catch (analysisError) {
      setReviewError(analysisError.message)
    } finally {
      setIsReviewAnalyzing(false)
    }
  }

  async function handleScriptAnalyze () {
    if (!scriptTitle.trim() && !scriptBody.trim()) {
      setScriptError('请至少输入标题或脚本正文。')
      return
    }

    if (!openRouterApiKey.trim()) {
      setScriptError('请先在设置页填写 OpenRouter API Key。')
      setView('settings')
      return
    }

    if (!openRouterModelId.trim()) {
      setScriptError('请先在设置页填写模型 ID。')
      setView('settings')
      return
    }

    setIsScriptAnalyzing(true)
    setScriptError('')

    try {
      const result = await analyzeScriptEvaluation({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: buildScriptInput({
          platform: scriptPlatform,
          videoLength: scriptVideoLength,
          scriptFormat,
          title: scriptTitle.trim(),
          body: scriptBody.trim()
        }),
        systemPrompt: buildScriptEvaluationPrompt(scriptPlatform),
        temperature: resolvedScriptTemperature,
        maxTokens: defaultScriptEvaluationProfile.maxTokens
      })

      setScriptResult(result.evaluation)
      setScriptActiveModel(result.model)
      setScriptUsage(result.usage)
    } catch (analysisError) {
      setScriptError(analysisError.message)
    } finally {
      setIsScriptAnalyzing(false)
    }
  }

  async function handleLanguageAnalyze () {
    if (!languageTitle.trim() && !languageBody.trim()) {
      setLanguageError('请至少输入标题或正文。')
      return
    }

    if (!openRouterApiKey.trim()) {
      setLanguageError('请先在设置页填写 OpenRouter API Key。')
      setView('settings')
      return
    }

    if (!openRouterModelId.trim()) {
      setLanguageError('请先在设置页填写模型 ID。')
      setView('settings')
      return
    }

    setIsLanguageAnalyzing(true)
    setLanguageError('')

    try {
      const result = await analyzeLanguage({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: buildLanguageInput({
          textType: languageTextType,
          title: languageTitle.trim(),
          body: languageBody.trim()
        }),
        systemPrompt: defaultLanguageAnalysisProfile.systemPrompt,
        temperature: resolvedLanguageTemperature,
        maxTokens: defaultLanguageAnalysisProfile.maxTokens
      })

      setLanguageResult(result.analysis)
      setLanguageActiveModel(result.model)
      setLanguageUsage(result.usage)
    } catch (analysisError) {
      setLanguageError(analysisError.message)
    } finally {
      setIsLanguageAnalyzing(false)
    }
  }

  const headerCopy = {
    analyzer: {
      kicker: 'AIR / 信息评分器',
      title: '用更细的评价维度，判断一段内容到底值不值得读。',
      description: '从真假、证据、信息量、洞察力到操控性，做一轮更像人的拆解。'
    },
    review: {
      kicker: 'AIR / 内容审查台',
      title: '把自媒体内容在发出去之前，先做一轮中文语境下的违规审查。',
      description: '统一覆盖发布前自检、内容复核和申诉辅助，不装成官方判定，只做高可用的风险预警。'
    },
    language: {
      kicker: 'AIR / 语言解剖台',
      title: '从句法、修辞、节奏到文风机制，判断这段中文写作到底怎么成立。',
      description: '上层做技术诊断，下层做评论拆解，不把术语识别误当成真正分析。'
    },
    script: {
      kicker: 'AIR / 脚本实验室',
      title: '用传播效果和叙事质量两套引擎，判断这份视频脚本到底能不能拍。',
      description: '同页兼容短视频、长视频、纯文案和分镜脚本，重点输出诊断而不是代写。'
    },
    settings: {
      kicker: 'AIR / 设置页',
      title: '配置 OpenRouter，给分析器和审查台接上你自己的模型。',
      description: '设置通过 zustand 持久化保存在当前浏览器中，四个页面共用同一套模型配置。'
    }
  }

  return (
    <main className='min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(236,242,255,0.9))] text-slate-900'>
      <div className='flex min-h-screen w-full flex-col px-4 py-4 sm:px-5 lg:px-6'>
        <header className='mb-5 flex flex-col gap-3 rounded-[1.5rem] border border-white/70 bg-white/55 px-5 py-4 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur xl:flex-row xl:items-end xl:justify-between'>
          <div className='max-w-4xl'>
            <div className='mb-2 flex flex-wrap items-center gap-2'>
              <p className='text-xs font-semibold uppercase tracking-[0.28em] text-slate-500'>
                {headerCopy[view].kicker}
              </p>
              <span className='rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-600'>
                {openRouterApiKey ? 'OpenRouter 已配置' : 'OpenRouter 未配置'}
              </span>
            </div>
            <div className='mb-5 flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={() => setView('analyzer')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === 'analyzer'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                信息评分器
              </button>
              <button
                type='button'
                onClick={() => setView('script')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === 'script'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                脚本实验室
              </button>
              <button
                type='button'
                onClick={() => setView('language')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === 'language'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                语言解剖台
              </button>
              <button
                type='button'
                onClick={() => setView('review')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === 'review'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                内容审查台
              </button>
              <button
                type='button'
                onClick={() => setView('settings')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === 'settings'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                设置页
              </button>
            </div>
            <h1 className='text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl'>
              {headerCopy[view].title}
            </h1>
          </div>
          <p className='max-w-lg text-sm leading-6 text-slate-600 xl:self-center'>
            {headerCopy[view].description}
          </p>
        </header>

        {view === 'analyzer'
          ? (
            <section className='grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.06fr)_minmax(300px,0.68fr)]'>
              <div className='flex flex-col rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)] sm:p-5'>
                <div className='mb-4 flex items-start justify-between gap-4'>
                  <div>
                    <h2 className='text-xl font-semibold'>输入内容</h2>
                    <p className='mt-2 text-sm leading-6 text-slate-300'>
                      粘贴一段帖子、观点、段落，或者转录文本。
                    </p>
                  </div>
                  <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300'>
                    实时模型分析
                  </span>
                </div>

                <div className='mb-4 grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-200 sm:grid-cols-2'>
                  <div>
                    <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>
                      当前模型
                    </div>
                    <div className='truncate'>{infoActiveModel || openRouterModelId || '未设置'}</div>
                  </div>
                  <div>
                    <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>
                      评价温度
                    </div>
                    <div>{resolvedInfoTemperature}</div>
                  </div>
                </div>

                <textarea
                  value={infoInput}
                  onChange={(event) => setInfoInput(event.target.value)}
                  placeholder='把要分析的内容粘贴到这里...'
                  className='min-h-[320px] flex-1 resize-none rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-base leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                />

                <div className='mt-4 flex justify-end'>
                  <button
                    type='button'
                    onClick={handleInfoAnalyze}
                    disabled={isInfoAnalyzing}
                    className='rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'
                  >
                    {isInfoAnalyzing ? '分析中...' : '开始分析'}
                  </button>
                </div>

                {infoError
                  ? (
                    <div className='mt-3 rounded-[1.25rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100'>
                      {infoError}
                    </div>
                    )
                  : null}
              </div>

              <div className='grid gap-4 md:grid-cols-2 2xl:grid-cols-3'>
                {infoMetricMeta.map((metric) => {
                  const value = infoScores[metric.key]
                  const isRiskMetric = metric.key === 'manipulation'

                  return (
                    <article
                      key={metric.key}
                      className='relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metric.tint}`}
                      />
                      <div className='relative'>
                        <div className='mb-4 flex items-start justify-between gap-4'>
                          <div>
                            <p className='text-sm font-medium text-slate-500'>{metric.label}</p>
                            <p className='mt-2 max-w-[18rem] text-sm leading-6 text-slate-600'>
                              {metric.description}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${scoreBadgeClass(
                            value,
                            isRiskMetric
                          )}`}
                          >
                            {scoreTone(value)}
                          </span>
                        </div>

                        <div className='text-4xl font-semibold tracking-tight text-slate-950'>{value}</div>
                        <div className='mt-2 text-xs uppercase tracking-[0.24em] text-slate-400'>
                          满分 100
                        </div>

                        <div className='mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200'>
                          <div
                            className={`h-full rounded-full transition-[width,background-color] duration-500 ${progressBarClass(
                            value,
                            isRiskMetric
                          )}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>

                        <p className='mt-4 text-sm leading-6 text-slate-600'>
                          {infoReasons[metric.key] || '等待模型返回该指标的判断依据。'}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className='grid auto-rows-min gap-4'>
                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4 flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-medium text-slate-500'>综合结论</p>
                      <p className='mt-2 text-sm leading-6 text-slate-600'>
                        模型给出一句压缩后的总体判断。
                      </p>
                    </div>
                    <span className='shrink-0 whitespace-nowrap rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
                      {isInfoAnalyzing ? '处理中' : '已就绪'}
                    </span>
                  </div>

                  <p className='text-base leading-7 text-slate-900'>
                    {infoSummary || '开始分析后，这里会显示一段整体评语。'}
                  </p>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>分析剖面</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      比综合结论更技术化，专门拆最值得关注的结构性问题。
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        思想体系标签
                      </div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {infoProfile.thoughtSystemLabel || '等待模型给出该内容的思想体系标签。'}
                      </div>
                      <div className='mt-2 text-sm leading-6 text-slate-600'>
                        {infoProfile.thoughtSystemReason || '等待模型说明为什么贴上这个标签。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        核心判断
                      </div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {infoProfile.coreJudgment || '等待模型生成结构化判断。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        Slop 风险
                      </div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {infoProfile.slopRisk || '等待模型判断这段内容的 slop 倾向。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        论证形态
                      </div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {infoProfile.argumentShape || '等待模型概括内容的论证形态。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        注意力价值
                      </div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {infoProfile.attentionWorth || '等待模型判断是否值得继续投入注意力。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        最弱环节
                      </div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {infoProfile.weakestLink || '等待模型指出这段内容最薄弱的地方。'}
                      </div>
                    </div>
                  </div>

                  {infoUsage
                    ? (
                      <div className='mt-5 flex flex-wrap gap-2 text-xs text-slate-500'>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>输入 {infoUsage.prompt_tokens ?? 0}</span>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>输出 {infoUsage.completion_tokens ?? 0}</span>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>总计 {infoUsage.total_tokens ?? 0}</span>
                      </div>
                      )
                    : null}
                </article>
              </div>
            </section>
            )
          : null}

        {view === 'review'
          ? (
            <section className='grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.04fr)_minmax(320px,0.72fr)]'>
              <div className='flex flex-col rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)] sm:p-5'>
                <div className='mb-4 flex items-start justify-between gap-4'>
                  <div>
                    <h2 className='text-xl font-semibold'>审查输入</h2>
                    <p className='mt-2 text-sm leading-6 text-slate-300'>
                      分模式输入标题、正文和封面文案，适合中文自媒体发前自检和复核。
                    </p>
                  </div>
                  <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300'>
                    中文平台风险扫描
                  </span>
                </div>

                <div className='mb-4 grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-200'>
                  <div className='flex flex-wrap gap-2'>
                    {Object.entries(reviewModeMeta).map(([key, item]) => (
                      <button
                        key={key}
                        type='button'
                        onClick={() => setReviewMode(key)}
                        className={`rounded-full px-4 py-2 text-sm transition ${
                        reviewMode === key
                          ? 'bg-white text-slate-950'
                          : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                      }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className='text-sm leading-6 text-slate-300'>{reviewModeMeta[reviewMode].description}</p>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    <div>
                      <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>平台</div>
                      <select
                        value={reviewPlatform}
                        onChange={(event) => setReviewPlatform(event.target.value)}
                        className='w-full rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none'
                      >
                        {reviewPlatforms.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>当前模型</div>
                      <div className='truncate rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-3'>
                        {reviewActiveModel || openRouterModelId || '未设置'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='grid gap-3'>
                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>标题</div>
                    <input
                      type='text'
                      value={reviewTitle}
                      onChange={(event) => setReviewTitle(event.target.value)}
                      placeholder='例如：三天逆袭、亲测有效、官方终于回应...'
                      className='w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>

                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>正文</div>
                    <textarea
                      value={reviewBody}
                      onChange={(event) => setReviewBody(event.target.value)}
                      placeholder='把正文粘贴到这里...'
                      className='min-h-[200px] w-full resize-y rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>

                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>封面文案 / 口播摘录</div>
                    <textarea
                      value={reviewCover}
                      onChange={(event) => setReviewCover(event.target.value)}
                      placeholder='可选，适合视频标题、封面短句、开场口播...'
                      className='min-h-[120px] w-full resize-y rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>
                </div>

                <div className='mt-4 flex justify-end'>
                  <button
                    type='button'
                    onClick={handleReviewAnalyze}
                    disabled={isReviewAnalyzing}
                    className='rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'
                  >
                    {isReviewAnalyzing ? '审查中...' : '开始审查'}
                  </button>
                </div>

                {reviewError
                  ? (
                    <div className='mt-3 rounded-[1.25rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100'>
                      {reviewError}
                    </div>
                    )
                  : null}
              </div>

              <div className='grid gap-4 md:grid-cols-2 2xl:grid-cols-3'>
                {reviewMetricMeta.map((metric) => {
                  const value = reviewResult.scores[metric.key]

                  return (
                    <article
                      key={metric.key}
                      className='relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metric.tint}`}
                      />
                      <div className='relative'>
                        <div className='mb-4 flex items-start justify-between gap-4'>
                          <div>
                            <p className='text-sm font-medium text-slate-500'>{metric.label}</p>
                            <p className='mt-2 max-w-[18rem] text-sm leading-6 text-slate-600'>
                              {metric.description}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${scoreBadgeClass(
                            value,
                            true
                          )}`}
                          >
                            {scoreTone(value)}
                          </span>
                        </div>

                        <div className='text-4xl font-semibold tracking-tight text-slate-950'>{value}</div>
                        <div className='mt-2 text-xs uppercase tracking-[0.24em] text-slate-400'>
                          风险分 100
                        </div>

                        <div className='mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200'>
                          <div
                            className={`h-full rounded-full transition-[width,background-color] duration-500 ${progressBarClass(
                            value,
                            true
                          )}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>

                        <p className='mt-4 text-sm leading-6 text-slate-600'>
                          {reviewResult.reasons[metric.key] || '等待模型返回该项风险的解释。'}
                        </p>
                      </div>
                    </article>
                  )
                })}

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)] md:col-span-2 2xl:col-span-3'>
                  <div className='mb-4 flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-medium text-slate-500'>命中点</p>
                      <p className='mt-2 text-sm leading-6 text-slate-600'>
                        直接指出哪一句危险、危险在哪里、平台会怎么看。
                      </p>
                    </div>
                    <span className='rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
                      {reviewResult.hitPoints.length} 项
                    </span>
                  </div>

                  {reviewResult.hitPoints.length
                    ? (
                      <div className='grid gap-3'>
                        {reviewResult.hitPoints.map((item, index) => (
                          <div
                            key={`${item.text}-${index}`}
                            className='rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3'
                          >
                            <div className='mb-2 flex flex-wrap items-center gap-2'>
                              <span className='rounded-full bg-slate-950 px-3 py-1 text-xs text-white'>
                                命中内容
                              </span>
                              <span className={`rounded-full px-3 py-1 text-xs ${severityClass(item.severity)}`}>
                                {item.severity}
                              </span>
                            </div>
                            <div className='text-sm leading-6 text-slate-900'>{item.text || '未返回命中内容。'}</div>
                            <div className='mt-2 text-sm leading-6 text-slate-600'>{item.reason}</div>
                            <div className='mt-2 text-xs leading-5 text-slate-500'>
                              平台关注点：{item.platformNote || '未补充平台说明。'}
                            </div>
                          </div>
                        ))}
                      </div>
                      )
                    : (
                      <div className='rounded-[1.25rem] bg-slate-100 p-4 text-sm leading-6 text-slate-600'>
                        开始审查后，这里会列出最值得注意的命中风险点。
                      </div>
                      )}
                </article>
              </div>

              <div className='grid auto-rows-min gap-4'>
                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4 flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-medium text-slate-500'>总体风险</p>
                      <p className='mt-2 text-sm leading-6 text-slate-600'>
                        综合风险等级、建议动作和发布判断。
                      </p>
                    </div>
                    <span
                      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${riskLevelClass(
                      reviewResult.riskLevel
                    )}`}
                    >
                      {reviewResult.riskLevel || '待判定'}
                    </span>
                  </div>

                  <div className='space-y-3'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        审查结论
                      </div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {reviewResult.publishRecommendation || '审查后这里会给出是否建议发布的结论。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        申诉潜力
                      </div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {reviewResult.appealPotential || '待判定'}
                      </div>
                      <div className='mt-2 text-sm leading-6 text-slate-600'>
                        {reviewResult.appealReason || '申诉模式下，这里会说明哪些点值得争取。'}
                      </div>
                    </div>
                  </div>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>整改与申诉</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      随模式变化给出修改动作、复核依据或申诉方向。
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        建议动作
                      </div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {reviewResult.reviewProfile.suggestedAction || '等待模型给出下一步动作建议。'}
                      </div>
                    </div>

                    {reviewResult.fixSuggestions.length
                      ? (
                        <div className='space-y-2'>
                          {reviewResult.fixSuggestions.map((item, index) => (
                            <div key={`${item}-${index}`} className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-900'>
                              {index + 1}. {item}
                            </div>
                          ))}
                        </div>
                        )
                      : (
                        <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-600'>
                          发布前自检或复核后，这里会列出可执行的修改建议。
                        </div>
                        )}
                  </div>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>审查剖面</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      从平台敏感性和风险风格角度，快速判断这类内容为什么容易出问题。
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>核心问题</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {reviewResult.reviewProfile.coreIssue || '等待模型概括最大的问题。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>风险风格</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {reviewResult.reviewProfile.riskStyle || '等待模型概括风险风格。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        平台敏感点
                      </div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {reviewResult.reviewProfile.platformSensitivity || '等待模型说明平台会敏感在哪里。'}
                      </div>
                    </div>
                  </div>

                  {reviewUsage
                    ? (
                      <div className='mt-5 flex flex-wrap gap-2 text-xs text-slate-500'>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>输入 {reviewUsage.prompt_tokens ?? 0}</span>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>输出 {reviewUsage.completion_tokens ?? 0}</span>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>总计 {reviewUsage.total_tokens ?? 0}</span>
                      </div>
                      )
                    : null}
                </article>
              </div>
            </section>
            )
          : null}

        {view === 'language'
          ? (
            <section className='grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.06fr)_minmax(320px,0.74fr)]'>
              <div className='flex flex-col rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)] sm:p-5'>
                <div className='mb-4 flex items-start justify-between gap-4'>
                  <div>
                    <h2 className='text-xl font-semibold'>语言输入</h2>
                    <p className='mt-2 text-sm leading-6 text-slate-300'>
                      分析普通中文写作中的句法、修辞、长句控制、节奏、语气和文风机制。
                    </p>
                  </div>
                  <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300'>
                    双层分析
                  </span>
                </div>

                <div className='mb-4 grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-200'>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    <div>
                      <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>文本类型</div>
                      <select
                        value={languageTextType}
                        onChange={(event) => setLanguageTextType(event.target.value)}
                        className='w-full rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none'
                      >
                        {languageTextTypes.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>当前模型</div>
                      <div className='truncate rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-3'>
                        {languageActiveModel || openRouterModelId || '未设置'}
                      </div>
                    </div>
                  </div>
                  <p className='text-sm leading-6 text-slate-300'>
                    这里不是识别术语名词，而是判断这些语言手法到底有没有服务表达。
                  </p>
                </div>

                <div className='grid gap-3'>
                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>标题</div>
                    <input
                      type='text'
                      value={languageTitle}
                      onChange={(event) => setLanguageTitle(event.target.value)}
                      placeholder='可选，用来帮助判断文本意图和语气方向'
                      className='w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>

                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>正文</div>
                    <textarea
                      value={languageBody}
                      onChange={(event) => setLanguageBody(event.target.value)}
                      placeholder='粘贴要分析的评论、随笔、议论文或叙述文片段...'
                      className='min-h-[360px] w-full resize-y rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>
                </div>

                <div className='mt-4 flex justify-end'>
                  <button
                    type='button'
                    onClick={handleLanguageAnalyze}
                    disabled={isLanguageAnalyzing}
                    className='rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'
                  >
                    {isLanguageAnalyzing ? '分析中...' : '开始分析'}
                  </button>
                </div>

                {languageError
                  ? (
                    <div className='mt-3 rounded-[1.25rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100'>
                      {languageError}
                    </div>
                    )
                  : null}
              </div>

              <div className='grid gap-4 md:grid-cols-2 2xl:grid-cols-2'>
                {languageMetricMeta.map((metric) => {
                  const value = languageResult.scores[metric.key]
                  const isPostureMetric = metric.key === 'posture_density'

                  return (
                    <article
                      key={metric.key}
                      className='relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'
                    >
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metric.tint}`} />
                      <div className='relative'>
                        <div className='mb-4 flex items-start justify-between gap-4'>
                          <div>
                            <p className='text-sm font-medium text-slate-500'>{metric.label}</p>
                            <p className='mt-2 max-w-[18rem] text-sm leading-6 text-slate-600'>
                              {metric.description}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${scoreBadgeClass(
                              value,
                              isPostureMetric
                            )}`}
                          >
                            {scoreTone(value)}
                          </span>
                        </div>

                        <div className='text-4xl font-semibold tracking-tight text-slate-950'>{value}</div>
                        <div className='mt-2 text-xs uppercase tracking-[0.24em] text-slate-400'>
                          满分 100
                        </div>

                        <div className='mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200'>
                          <div
                            className={`h-full rounded-full transition-[width,background-color] duration-500 ${progressBarClass(
                              value,
                              isPostureMetric
                            )}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>

                        <p className='mt-4 text-sm leading-6 text-slate-600'>
                          {languageResult.reasons[metric.key] || '等待模型返回该项语言判断。'}
                        </p>
                      </div>
                    </article>
                  )
                })}

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)] md:col-span-2'>
                  <div className='mb-4 flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-medium text-slate-500'>识别到的语言现象</p>
                      <p className='mt-2 text-sm leading-6 text-slate-600'>
                        不只是点术语，而是保留最有解释力的修辞、句法和文风标签。
                      </p>
                    </div>
                    <span className='rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
                      {languageResult.detectedFeatures.rhetoricalDevices.length +
                        languageResult.detectedFeatures.sentencePatterns.length +
                        languageResult.detectedFeatures.styleModes.length} 项
                    </span>
                  </div>

                  <div className='grid gap-3 md:grid-cols-3'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>修辞手法</div>
                      {languageResult.detectedFeatures.rhetoricalDevices.length
                        ? (
                          <div className='flex flex-wrap gap-2'>
                            {languageResult.detectedFeatures.rhetoricalDevices.map((item, index) => (
                              <span key={`${item}-${index}`} className='rounded-full bg-white px-3 py-1 text-sm text-slate-900'>
                                {item}
                              </span>
                            ))}
                          </div>
                          )
                        : <div className='text-sm leading-6 text-slate-600'>等待识别结果。</div>}
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>句法模式</div>
                      {languageResult.detectedFeatures.sentencePatterns.length
                        ? (
                          <div className='flex flex-wrap gap-2'>
                            {languageResult.detectedFeatures.sentencePatterns.map((item, index) => (
                              <span key={`${item}-${index}`} className='rounded-full bg-white px-3 py-1 text-sm text-slate-900'>
                                {item}
                              </span>
                            ))}
                          </div>
                          )
                        : <div className='text-sm leading-6 text-slate-600'>等待识别结果。</div>}
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>文风模式</div>
                      {languageResult.detectedFeatures.styleModes.length
                        ? (
                          <div className='flex flex-wrap gap-2'>
                            {languageResult.detectedFeatures.styleModes.map((item, index) => (
                              <span key={`${item}-${index}`} className='rounded-full bg-white px-3 py-1 text-sm text-slate-900'>
                                {item}
                              </span>
                            ))}
                          </div>
                          )
                        : <div className='text-sm leading-6 text-slate-600'>等待识别结果。</div>}
                    </div>
                  </div>
                </article>
              </div>

              <div className='grid auto-rows-min gap-4'>
                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4 flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-medium text-slate-500'>一句话总评</p>
                      <p className='mt-2 text-sm leading-6 text-slate-600'>
                        先判断技术上成不成立，再指出最大优点和最大毛病。
                      </p>
                    </div>
                    <span className='shrink-0 whitespace-nowrap rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
                      {isLanguageAnalyzing ? '处理中' : '已就绪'}
                    </span>
                  </div>

                  <p className='text-base leading-7 text-slate-900'>
                    {languageResult.summary || '开始分析后，这里会显示一段压缩后的总体判断。'}
                  </p>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>主要问题</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      聚焦最影响阅读体验和表达质量的结构问题。
                    </p>
                  </div>

                  {languageResult.problems.length
                    ? (
                      <div className='space-y-2'>
                        {languageResult.problems.map((item, index) => (
                          <div key={`${item}-${index}`} className='rounded-[1.25rem] bg-rose-50 p-3 text-sm leading-6 text-slate-900'>
                            {index + 1}. {item}
                          </div>
                        ))}
                      </div>
                      )
                    : (
                      <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-600'>
                        分析后，这里会列出最需要优先处理的语言问题。
                      </div>
                      )}
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>修改建议</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      固定拆成句子、节奏、修辞、语气四类，避免只有空泛点评。
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>句子</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.revisionSuggestions.sentence || '等待模型指出句法层面的修改方向。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>节奏</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.revisionSuggestions.rhythm || '等待模型指出节奏层面的修改方向。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>修辞</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.revisionSuggestions.rhetoric || '等待模型指出修辞层面的修改方向。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>语气</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.revisionSuggestions.tone || '等待模型指出语气层面的修改方向。'}
                      </div>
                    </div>
                  </div>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>评论拆解</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      从语言机制和风格气质角度，解释这段文本是怎样产生效果的。
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>风格总结</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.commentary.styleSummary || '等待模型总结这段文字的风格气质。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>语言机制</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.commentary.languageMechanism || '等待模型说明文本主要靠什么语言机制成立。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>主要效果</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.commentary.dominantEffect || '等待模型指出这段文字最强的表达效果。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>风险提示</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.commentary.riskNote || '等待模型指出这段文字可能滑向的风险。'}
                      </div>
                    </div>
                  </div>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>表达剖面</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      用更压缩的方式总结这段文字的核心优点、弱点和作者倾向。
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>核心优点</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.profile.coreStrength || '等待模型概括最值得保留的语言优点。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>核心弱点</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.profile.coreWeakness || '等待模型概括最突出的语言短板。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>作者倾向</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.profile.writerTendency || '等待模型概括常见表达倾向。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>阅读体验</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {languageResult.profile.readingExperience || '等待模型概括读者会感受到什么。'}
                      </div>
                    </div>
                  </div>

                  {languageUsage
                    ? (
                      <div className='mt-5 flex flex-wrap gap-2 text-xs text-slate-500'>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>输入 {languageUsage.prompt_tokens ?? 0}</span>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>输出 {languageUsage.completion_tokens ?? 0}</span>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>总计 {languageUsage.total_tokens ?? 0}</span>
                      </div>
                      )
                    : null}
                </article>
              </div>
            </section>
            )
          : null}

        {view === 'script'
          ? (
            <section className='grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.06fr)_minmax(320px,0.72fr)]'>
              <div className='flex flex-col rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)] sm:p-5'>
                <div className='mb-4 flex items-start justify-between gap-4'>
                  <div>
                    <h2 className='text-xl font-semibold'>脚本输入</h2>
                    <p className='mt-2 text-sm leading-6 text-slate-300'>
                      支持短视频、长视频、纯文案和分镜脚本，重点判断能不能拍和该先改哪里。
                    </p>
                  </div>
                  <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300'>
                    双引擎评估
                  </span>
                </div>

                <div className='mb-4 grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-200'>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    <div>
                      <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>平台</div>
                      <select
                        value={scriptPlatform}
                        onChange={(event) => setScriptPlatform(event.target.value)}
                        className='w-full rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none'
                      >
                        {scriptPlatforms.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className='mb-1 text-xs uppercase tracking-[0.22em] text-slate-400'>当前模型</div>
                      <div className='truncate rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-3'>
                        {scriptActiveModel || openRouterModelId || '未设置'}
                      </div>
                    </div>
                  </div>

                  <div className='grid gap-3 sm:grid-cols-2'>
                    <div>
                      <div className='mb-2 text-xs uppercase tracking-[0.22em] text-slate-400'>视频长度</div>
                      <div className='flex flex-wrap gap-2'>
                        {scriptLengthOptions.map((item) => (
                          <button
                            key={item}
                            type='button'
                            onClick={() => setScriptVideoLength(item)}
                            className={`rounded-full px-4 py-2 text-sm transition ${
                              scriptVideoLength === item
                                ? 'bg-white text-slate-950'
                                : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className='mb-2 text-xs uppercase tracking-[0.22em] text-slate-400'>脚本形态</div>
                      <div className='flex flex-wrap gap-2'>
                        {scriptFormatOptions.map((item) => (
                          <button
                            key={item}
                            type='button'
                            onClick={() => setScriptFormat(item)}
                            className={`rounded-full px-4 py-2 text-sm transition ${
                              scriptFormat === item
                                ? 'bg-white text-slate-950'
                                : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className='text-sm leading-6 text-slate-300'>
                    短视频更看钩子和完播，长视频更看结构和情绪；分镜脚本会额外判断画面推进是否真的服务内容。
                  </p>
                </div>

                <div className='grid gap-3'>
                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>标题</div>
                    <input
                      type='text'
                      value={scriptTitle}
                      onChange={(event) => setScriptTitle(event.target.value)}
                      placeholder='例如：她花三年逃离这座城 / 这个反转我留到了最后一分钟'
                      className='w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>

                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>脚本正文</div>
                    <textarea
                      value={scriptBody}
                      onChange={(event) => setScriptBody(event.target.value)}
                      placeholder={scriptFormat === '分镜脚本'
                        ? '可自由输入镜头、画面、台词、旁白、字幕、音效，不强制固定模板。'
                        : '粘贴口播稿、剧情稿、解说稿或长视频脚本正文...'}
                      className='min-h-[360px] w-full resize-y rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>
                </div>

                <div className='mt-4 flex justify-end'>
                  <button
                    type='button'
                    onClick={handleScriptAnalyze}
                    disabled={isScriptAnalyzing}
                    className='rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'
                  >
                    {isScriptAnalyzing ? '评估中...' : '开始评估'}
                  </button>
                </div>

                {scriptError
                  ? (
                    <div className='mt-3 rounded-[1.25rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100'>
                      {scriptError}
                    </div>
                    )
                  : null}
              </div>

              <div className='grid gap-4 md:grid-cols-2 2xl:grid-cols-2'>
                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4 flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-medium text-slate-500'>传播效果</p>
                      <p className='mt-2 text-sm leading-6 text-slate-600'>
                        回答这份脚本能不能拉住观众，并把观众带到后面。
                      </p>
                    </div>
                    <span className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${scoreBadgeClass(scriptResult.totals.hook_power)}`}>
                      {scoreTone(scriptResult.totals.hook_power)}
                    </span>
                  </div>
                  <div className='text-4xl font-semibold tracking-tight text-slate-950'>
                    {scriptResult.totals.hook_power}
                  </div>
                  <div className='mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200'>
                    <div
                      className={`h-full rounded-full transition-[width,background-color] duration-500 ${progressBarClass(scriptResult.totals.hook_power)}`}
                      style={{ width: `${scriptResult.totals.hook_power}%` }}
                    />
                  </div>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4 flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-medium text-slate-500'>叙事质量</p>
                      <p className='mt-2 text-sm leading-6 text-slate-600'>
                        回答这份脚本结构是否成立，情绪和冲突能不能真正撑住内容。
                      </p>
                    </div>
                    <span className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${scoreBadgeClass(scriptResult.totals.narrative_power)}`}>
                      {scoreTone(scriptResult.totals.narrative_power)}
                    </span>
                  </div>
                  <div className='text-4xl font-semibold tracking-tight text-slate-950'>
                    {scriptResult.totals.narrative_power}
                  </div>
                  <div className='mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200'>
                    <div
                      className={`h-full rounded-full transition-[width,background-color] duration-500 ${progressBarClass(scriptResult.totals.narrative_power)}`}
                      style={{ width: `${scriptResult.totals.narrative_power}%` }}
                    />
                  </div>
                </article>

                {scriptMetricMeta.map((metric) => {
                  const value = scriptResult.scores[metric.key]

                  return (
                    <article
                      key={metric.key}
                      className='relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'
                    >
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metric.tint}`} />
                      <div className='relative'>
                        <div className='mb-4 flex items-start justify-between gap-4'>
                          <div>
                            <p className='text-sm font-medium text-slate-500'>{metric.label}</p>
                            <p className='mt-2 max-w-[18rem] text-sm leading-6 text-slate-600'>
                              {metric.description}
                            </p>
                          </div>
                          <span className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${scoreBadgeClass(value)}`}>
                            {scoreTone(value)}
                          </span>
                        </div>

                        <div className='text-4xl font-semibold tracking-tight text-slate-950'>{value}</div>
                        <div className='mt-2 text-xs uppercase tracking-[0.24em] text-slate-400'>
                          满分 100
                        </div>

                        <div className='mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200'>
                          <div
                            className={`h-full rounded-full transition-[width,background-color] duration-500 ${progressBarClass(value)}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>

                        <p className='mt-4 text-sm leading-6 text-slate-600'>
                          {scriptResult.reasons[metric.key] || '等待模型返回该项脚本判断。'}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className='grid auto-rows-min gap-4'>
                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4 flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-medium text-slate-500'>一句话总评</p>
                      <p className='mt-2 text-sm leading-6 text-slate-600'>
                        快速判断这稿子现在值不值得拍，主要强项和短板是什么。
                      </p>
                    </div>
                    <span className='shrink-0 whitespace-nowrap rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
                      {isScriptAnalyzing ? '处理中' : '已就绪'}
                    </span>
                  </div>

                  <p className='text-base leading-7 text-slate-900'>
                    {scriptResult.summary || '开始评估后，这里会给出一段压缩后的总体判断。'}
                  </p>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>优势与问题</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      先抓最能打的点，再抓最影响成片效果的点。
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>主要优势</div>
                      {scriptResult.strengths.length
                        ? (
                          <div className='space-y-2'>
                            {scriptResult.strengths.map((item, index) => (
                              <div key={`${item}-${index}`} className='rounded-[1.25rem] bg-emerald-50 p-3 text-sm leading-6 text-slate-900'>
                                {index + 1}. {item}
                              </div>
                            ))}
                          </div>
                          )
                        : (
                          <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-600'>
                            评估后，这里会列出最值得保留的亮点。
                          </div>
                          )}
                    </div>

                    <div>
                      <div className='mb-2 text-xs uppercase tracking-[0.24em] text-slate-400'>主要问题</div>
                      {scriptResult.problems.length
                        ? (
                          <div className='space-y-2'>
                            {scriptResult.problems.map((item, index) => (
                              <div key={`${item}-${index}`} className='rounded-[1.25rem] bg-rose-50 p-3 text-sm leading-6 text-slate-900'>
                                {index + 1}. {item}
                              </div>
                            ))}
                          </div>
                          )
                        : (
                          <div className='rounded-[1.25rem] bg-slate-100 p-3 text-sm leading-6 text-slate-600'>
                            评估后，这里会列出最影响传播和叙事的关键问题。
                          </div>
                          )}
                    </div>
                  </div>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>改稿建议</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      按开头、中段、结尾和表现形式拆开给建议，避免只给空泛点评。
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>开头</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.revisionSuggestions.opening || '等待模型指出开头应该如何更快建立吸引力。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>中段</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.revisionSuggestions.middle || '等待模型指出中段该如何补推进和节奏。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>结尾</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.revisionSuggestions.ending || '等待模型指出结尾该如何形成回报或收束。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>表现形式</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.revisionSuggestions.format || '等待模型说明更适合口播、剧情、分镜还是字幕推进。'}
                      </div>
                    </div>
                  </div>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>适配判断</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      告诉你这份稿子更适合什么长度、什么表达方式，以及平台侧注意点。
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>最佳形式</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.fit.bestFormat || '等待模型判断这份脚本更适合的成片形式。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>短视频适配</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.fit.shortVideoFit || '等待模型判断这份脚本是否适合短视频表达。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>长视频适配</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.fit.longVideoFit || '等待模型判断这份脚本是否支撑长视频展开。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>平台注意点</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.fit.platformNote || '等待模型补充当前平台下的表达建议。'}
                      </div>
                    </div>
                  </div>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-slate-500'>脚本剖面</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                      用更压缩的方式总结这稿子的卖点、短板和结构形态。
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>核心卖点</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.profile.coreSellingPoint || '等待模型概括这份脚本最应该被保留的卖点。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>最大短板</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.profile.biggestWeakness || '等待模型概括这份脚本最大的结构短板。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>观众拉力</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.profile.audiencePull || '等待模型说明观众被什么东西拉住。'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>结构形态</div>
                      <div className='text-sm leading-6 text-slate-900'>
                        {scriptResult.profile.storyShape || '等待模型概括它整体像什么结构。'}
                      </div>
                    </div>
                  </div>

                  {scriptUsage
                    ? (
                      <div className='mt-5 flex flex-wrap gap-2 text-xs text-slate-500'>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>输入 {scriptUsage.prompt_tokens ?? 0}</span>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>输出 {scriptUsage.completion_tokens ?? 0}</span>
                        <span className='rounded-full bg-slate-100 px-3 py-1'>总计 {scriptUsage.total_tokens ?? 0}</span>
                      </div>
                      )
                    : null}
                </article>
              </div>
            </section>
            )
          : null}

        {view === 'settings'
          ? (
            <section className='grid flex-1 gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]'>
              <div className='rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)]'>
                <div className='mb-6'>
                  <h2 className='text-2xl font-semibold'>OpenRouter 设置</h2>
                  <p className='mt-3 text-sm leading-6 text-slate-300'>
                    信息评分器、语言解剖台、脚本实验室和内容审查台共用这一套模型配置。
                  </p>
                </div>

                <div className='space-y-5'>
                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>OpenRouter API Key</div>
                    <input
                      type='password'
                      value={openRouterApiKey}
                      onChange={(event) => setOpenRouterApiKey(event.target.value)}
                      placeholder='请输入 sk-or-v1-...'
                      className='w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>

                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>模型 ID</div>
                    <input
                      type='text'
                      value={openRouterModelId}
                      onChange={(event) => setOpenRouterModelId(event.target.value)}
                      placeholder='例如 openai/gpt-4.1-mini'
                      className='w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>

                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>信息评分器提示词</div>
                    <textarea
                      value={customSystemPrompt}
                      onChange={(event) => setCustomSystemPrompt(event.target.value)}
                      placeholder='留空时使用内置默认评价体系...'
                      className='min-h-[240px] w-full resize-y rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>

                  <label className='block'>
                    <div className='mb-2 text-sm font-medium text-white'>Temperature</div>
                    <input
                      type='number'
                      min='0'
                      max='2'
                      step='0.1'
                      value={customTemperature}
                      onChange={(event) => setCustomTemperature(event.target.value)}
                      placeholder={`留空时使用默认值 ${defaultEvaluationProfile.temperature}`}
                      className='w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60'
                    />
                  </label>

                  <button
                    type='button'
                    onClick={resetEvaluationSettings}
                    className='rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10'
                  >
                    恢复默认信息评分体系
                  </button>
                </div>
              </div>

              <div className='grid gap-4'>
                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <div className='mb-6 flex items-center justify-between gap-4'>
                    <h3 className='text-xl font-semibold text-slate-950'>当前配置</h3>
                    <span className='rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white'>
                      {openRouterApiKey ? '已配置' : '未配置'}
                    </span>
                  </div>
                  <div className='space-y-4 text-sm text-slate-600'>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>API Key</div>
                      <div className='break-all text-slate-900'>{maskedApiKey}</div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>模型 ID</div>
                      <div className='break-all text-slate-900'>{openRouterModelId || '未设置'}</div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>
                        信息评分器提示词
                      </div>
                      <div className='text-slate-900'>
                        {customSystemPrompt.trim() ? '使用用户覆盖' : '使用内置默认评价体系'}
                      </div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>信息评分温度</div>
                      <div className='text-slate-900'>{resolvedInfoTemperature}</div>
                    </div>
                    <div className='rounded-[1.25rem] bg-slate-100 p-3'>
                      <div className='mb-1 text-xs uppercase tracking-[0.24em] text-slate-400'>审查台温度</div>
                      <div className='text-slate-900'>{resolvedReviewTemperature}</div>
                    </div>
                  </div>
                </article>

                <article className='rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]'>
                  <h3 className='text-xl font-semibold text-slate-950'>说明</h3>
                  <div className='mt-4 space-y-3 text-sm leading-6 text-slate-600'>
                    <p>设置保存在当前浏览器，本地持久化，不需要重复输入。</p>
                    <p>当前版本由浏览器直接请求 OpenRouter，API Key 会在本地浏览器中使用。</p>
                    <p>信息评分器支持自定义提示词；语言解剖台、脚本实验室和内容审查台当前固定使用内置中文评估体系。</p>
                  </div>
                </article>
              </div>
            </section>
            )
          : null}
      </div>
    </main>
  )
}
