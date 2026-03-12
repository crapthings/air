const scriptMetricBlocks = {
  hook_strength: [
    '1. hook_strength（3秒抓力）',
    '- 判断开头是否迅速建立悬念、反差、利益点或情绪张力。',
    '- 高分表示观众有理由立刻停下来看。',
    '- 低分表示开头钩子弱，进入太慢。'
  ],
  retention_potential: [
    '2. retention_potential（完播潜力）',
    '- 判断中段是否持续制造推进感，让观众愿意继续看下去。',
    '- 低分通常意味着开头强但中段塌，或内容很快见底。'
  ],
  rhythm_control: [
    '3. rhythm_control（节奏控制）',
    '- 判断信息爆点、停顿、推进和转折是否安排得当。',
    '- 高分表示节奏有变化也有控制，不拖不乱。'
  ],
  memorability: [
    '4. memorability（传播记忆点）',
    '- 判断是否有一句钩子、一个设定、一个画面或一个反转让人记住。',
    '- 低分通常意味着看完没有可复述点。'
  ],
  setup_clarity: [
    '5. setup_clarity（设定清晰度）',
    '- 判断人物、目标、关系、前提和世界规则是否清楚。',
    '- 高分表示观众容易进入内容。'
  ],
  conflict_strength: [
    '6. conflict_strength（冲突强度）',
    '- 判断矛盾是否成立，是否真正推动内容往前走。',
    '- 低分表示只有信息堆砌，没有真实推动力。'
  ],
  structure_integrity: [
    '7. structure_integrity（结构完整性）',
    '- 判断开场、铺垫、推进、转折和收束是否成型。',
    '- 低分通常意味着断裂、跳步或虎头蛇尾。'
  ],
  emotion_build: [
    '8. emotion_build（情绪递进）',
    '- 判断情绪是否一层层推上去，而不是从头到尾平着走。',
    '- 高分表示高潮有铺垫，回报更成立。'
  ]
}

export const scriptMetricOrder = [
  'hook_strength',
  'retention_potential',
  'rhythm_control',
  'memorability',
  'setup_clarity',
  'conflict_strength',
  'structure_integrity',
  'emotion_build'
]

export function getScriptMetricPromptBlocks () {
  return scriptMetricOrder.flatMap((key) => scriptMetricBlocks[key])
}
