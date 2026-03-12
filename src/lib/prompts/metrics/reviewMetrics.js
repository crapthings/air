const reviewMetricBlocks = {
  violation_risk: [
    '1. violation_risk（违规风险）',
    '- 判断整体触碰平台规则或风控阈值的可能性。',
    '- 高分表示整体风险很高，容易被限流、下架或处罚。'
  ],
  marketing_risk: [
    '2. marketing_risk（广告营销风险）',
    '- 判断极限词、承诺型转化、夸张营销话术的风险强度。',
    '- 高分表示营销感过重或带有承诺式引导。'
  ],
  medical_risk: [
    '3. medical_risk（医疗健康风险）',
    '- 判断疗效、治愈、偏方、替代专业建议等医疗健康风险。',
    '- 高分表示容易触发医疗健康类风控。'
  ],
  financial_risk: [
    '4. financial_risk（金融收益风险）',
    '- 判断荐股、带单、保本、收益承诺、内幕暗示等金融风险。',
    '- 高分表示存在明显的收益引导或金融敏感表达。'
  ],
  vulgarity_risk: [
    '5. vulgarity_risk（低俗攻击风险）',
    '- 判断擦边、侮辱、恶俗、群体攻击等低俗攻击风险。',
    '- 高分表示内容容易被判定为冒犯或低俗。'
  ],
  traffic_redirect_risk: [
    '6. traffic_redirect_risk（引流导流风险）',
    '- 判断私联、加微、进群、导流私域等风险。',
    '- 高分表示有明显的导流意图。'
  ],
  headline_misleading_risk: [
    '7. headline_misleading_risk（误导标题风险）',
    '- 判断标题党、封面党、夸张诱导点击、文案不一致等风险。',
    '- 高分表示诱导性和误导性较强。'
  ]
}

export const reviewMetricOrder = [
  'violation_risk',
  'marketing_risk',
  'medical_risk',
  'financial_risk',
  'vulgarity_risk',
  'traffic_redirect_risk',
  'headline_misleading_risk'
]

export function getReviewMetricPromptBlocks () {
  return reviewMetricOrder.flatMap((key) => reviewMetricBlocks[key])
}
