const scriptPlatformGuidanceMap = {
  通用: '按泛中文视频平台判断，兼顾传播效率和内容结构，不要过度偏向单一平台话术。',
  抖音: '更关注开头钩子、反差、推进速度、记忆点和短时间内的情绪拉力。',
  小红书: '更关注真实感、人设稳定性、表达清晰度和内容是否有可被复述的心得或体验感。',
  视频号: '更关注表达直给、信息完整、情绪不过火，以及更稳妥的叙事推进。',
  B站: '更接受铺垫和解释，但要求结构完整、回报明确、设定自洽，不能只有开头刺激。'
}

const scriptContextBlocks = {
  base: [
    '输入中会包含：平台、视频长度、脚本形态、标题和脚本正文。',
    '你需要同时评估两条主线：',
    '- 传播效果：观众会不会停下来看，并愿不愿意继续看下去。',
    '- 叙事质量：这份脚本是否形成了成立且有推进力的内容结构。'
  ],
  length_guidance: [
    '视频长度引导：',
    '- 短视频时，更重视 3秒抓力、完播潜力、节奏控制、传播记忆点。',
    '- 长视频时，更重视 设定清晰度、冲突强度、结构完整性、情绪递进。'
  ],
  format_guidance: [
    '脚本形态引导：',
    '- 纯文案脚本：重点看语言推进、表达清晰度和口播可说性，不要因缺少镜头描述而机械扣分。',
    '- 分镜脚本：判断镜头、台词、旁白、字幕是否彼此增强；镜头很多但推进弱时，应下调节奏和完播判断。'
  ],
  auxiliary_guidance: [
    '辅助判断可在解释中补充，但不要扩展成新主评分项：',
    '- 角色驱动',
    '- 反转回报',
    '- 主题表达',
    '- 转化承接',
    '- 短视频适配度',
    '- 长视频支撑度'
  ]
}

export function getScriptContextPromptBlocks (platform) {
  const platformGuidance = scriptPlatformGuidanceMap[platform] || scriptPlatformGuidanceMap['通用']

  return [
    ...scriptContextBlocks.base,
    ...scriptContextBlocks.length_guidance,
    ...scriptContextBlocks.format_guidance,
    ...scriptContextBlocks.auxiliary_guidance,
    `平台补充说明：${platformGuidance}`
  ]
}
