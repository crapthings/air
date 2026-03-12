const reviewPlatformGuidanceMap = {
  通用: '按通用中文内容平台的风控视角判断，重点看夸张承诺、导流、医疗金融敏感项、低俗攻击和误导标题。',
  小红书: '重点关注种草、软广、疗效暗示、过度种草引导、私信导流、夸张前后对比、封面党和笔记商业化表达。',
  抖音: '重点关注强诱导成交、导流私域、夸张收益、低俗擦边、口播里的承诺型表达，以及封面和短标题的刺激性文案。',
  视频号: '重点关注私域导流、课程成交、养生和健康承诺、情绪煽动、群体攻击，以及公众号联动引流。',
  公众号: '重点关注标题党、医疗与金融权威背书、长文中的夸张论断、私域导流、广告软文伪装成资讯或观点。'
}

const reviewContextBlocks = {
  base: [
    '输入中会包含：模式、平台、标题、正文、封面文案或口播摘录。',
    '你的任务不是给出法律结论，而是从平台审核和内容风控角度做结构化审查。'
  ],
  mode_guidance: [
    '模式说明：',
    '- 发布前自检：重点给出风险、命中点和怎么改。',
    '- 内容复核：重点说明为什么会被判风险，依据是什么。',
    '- 申诉辅助：重点区分哪些点适合申诉，哪些点不适合。'
  ],
  detection_guidance: [
    '重点检测点：',
    '- 极限词、绝对化表述、结果保证',
    '- 疗效、治愈、偏方、替代专业建议',
    '- 保本、稳赚、荐股、带单、内幕消息',
    '- 加微、私信、进群、导流私域',
    '- 擦边、低俗、侮辱、群体攻击',
    '- 标题党、封面党、夸张诱导点击',
    '- 规避审核、暗示绕规则、虚假权威背书'
  ]
}

export function getReviewContextPromptBlocks (platform) {
  const platformGuidance = reviewPlatformGuidanceMap[platform] || reviewPlatformGuidanceMap['通用']

  return [
    ...reviewContextBlocks.base,
    ...reviewContextBlocks.mode_guidance,
    ...reviewContextBlocks.detection_guidance,
    `平台补充说明：${platformGuidance}`
  ]
}
