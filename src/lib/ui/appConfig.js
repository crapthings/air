export const infoMetricMeta = [
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

export const reviewMetricMeta = [
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

export const scriptMetricMeta = [
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

export const languageMetricMeta = [
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

export const emptyInfoScores = {
  confidence: 0,
  verifiability: 0,
  signal: 0,
  clarity: 0,
  insight: 0,
  taste: 0,
  manipulation: 0
}

export const emptyInfoReasons = {
  confidence: '',
  verifiability: '',
  signal: '',
  clarity: '',
  insight: '',
  taste: '',
  manipulation: ''
}

export const emptyInfoProfile = {
  coreJudgment: '',
  slopRisk: '',
  argumentShape: '',
  attentionWorth: '',
  weakestLink: '',
  thoughtSystemLabel: '',
  thoughtSystemReason: ''
}

export const emptyReviewResult = {
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

export const emptyScriptResult = {
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

export const emptyLanguageResult = {
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
  auxiliary: {
    keywords: [],
    repetitionNote: '',
    transitionNote: '',
    homogenizationNote: ''
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

export const reviewModeMeta = {
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

export const reviewPlatforms = ['通用', '小红书', '抖音', '视频号', '公众号']
export const scriptPlatforms = ['通用', '抖音', '小红书', '视频号', 'B站']
export const scriptLengthOptions = ['短视频', '长视频']
export const scriptFormatOptions = ['纯文案', '分镜脚本']
export const languageTextTypes = ['通用', '评论', '随笔', '议论文', '叙述文']

export const rewriteModeMeta = {
  conservative: { label: '保守优化' },
  stronger: { label: '强化表达' },
  rewrite: { label: '重写一版' },
  densify: { label: '提高信息密度' },
  shootable: { label: '更适合拍' },
  reduce_posture: { label: '降低姿态感' },
  reduce_risk: { label: '降低风险表达' }
}

export const rewriteModesByView = {
  analyzer: ['conservative', 'stronger', 'rewrite', 'densify'],
  script: ['conservative', 'stronger', 'rewrite', 'shootable'],
  language: ['conservative', 'stronger', 'rewrite', 'reduce_posture'],
  review: ['conservative', 'stronger', 'rewrite', 'reduce_risk']
}

export const headerCopy = {
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
