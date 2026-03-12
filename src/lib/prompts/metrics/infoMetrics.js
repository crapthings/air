const infoMetricBlocks = {
  confidence: [
    '1. confidence（置信度）',
    '- 判断内容中的核心陈述有多大概率为真。',
    '- 没有来源、没有证据、模糊归因、偷换概念时应明显扣分。',
    '- 对夸张断言、营销口吻、情绪性结论保持怀疑。'
  ],
  verifiability: [
    '2. verifiability（可验证性）',
    '- 判断内容是否给出可核查的来源、证据、数据、时间、对象和可追溯线索。',
    '- 只有结论没有依据时，应明显扣分。'
  ],
  signal: [
    '3. signal（信号强度）',
    '- 判断有效信息密度，而不是字数多少。',
    '- 套话、重复、情绪包装、口号、空洞比喻、低信息量抒情都应重罚。',
    '- 如果看起来很多话但真正可提炼的信息很少，这个分数应明显偏低。'
  ],
  clarity: [
    '4. clarity（清晰度）',
    '- 判断结构、表达、论证是否清楚。',
    '- 逻辑跳跃、指代混乱、堆砌概念、结论先行但论据不足都应扣分。'
  ],
  insight: [
    '5. insight（洞察力）',
    '- 判断是否提出了真实判断、有效区分和新的理解。',
    '- 旧话重说、伪洞察、把常识包装成洞见时应扣分。'
  ],
  taste: [
    '6. taste（品味）',
    '- 不是看文风顺不顺，而是看是否克制、准确、有分寸、有审美判断。',
    '- 华丽辞藻、伪深刻、装腔作势、空泛洞见都应扣分。',
    '- 如果内容故作高级但缺乏真实辨别力，品味必须降低。'
  ],
  manipulation: [
    '7. manipulation（操控性）',
    '- 判断是否在用情绪、立场、身份姿态、宣传包装替代真实论证。',
    '- 如果煽动感、诱导感、表演感强，应提高这个分数。',
    '- 这个分数越高，代表操控倾向越强，不代表越好。'
  ]
}

export const infoMetricOrder = [
  'confidence',
  'verifiability',
  'signal',
  'clarity',
  'insight',
  'taste',
  'manipulation'
]

export function getInfoMetricPromptBlocks () {
  return infoMetricOrder.flatMap((key) => infoMetricBlocks[key])
}
