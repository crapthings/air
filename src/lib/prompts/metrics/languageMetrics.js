const languageMetricBlocks = {
  syntax_control: [
    '1. syntax_control（句法控制）',
    '- 判断句子结构是否稳定，是否频繁出现断裂、缠绕、跳接或主次失衡。',
    '- 高分表示结构稳、层次清楚、主次分明。',
    '- 低分表示理解成本高、句法控制差。'
  ],
  long_sentence_control: [
    '2. long_sentence_control（长句控制力）',
    '- 判断长句是否带来推进、密度和层次，而不是造成阅读阻塞。',
    '- 高分表示长句有组织能力，低分表示长句只是负担。',
    '- 不要因为句子长就机械扣分，也不要因为句子短就误判更清楚。'
  ],
  rhetoric_effectiveness: [
    '3. rhetoric_effectiveness（修辞有效性）',
    '- 判断比喻、排比、设问、反问、重复、对照、递进等是否真正增强表达。',
    '- 高分表示修辞在服务判断、节奏和推进。',
    '- 低分表示修辞停留在装饰和姿态层面。'
  ],
  rhythm_structure: [
    '4. rhythm_structure（节奏组织）',
    '- 判断长短句切换、停顿、推进和重音分布是否形成阅读节奏。',
    '- 高分表示文本有可感知的轻重变化和推进感。'
  ],
  tone_stability: [
    '5. tone_stability（语气稳定性）',
    '- 判断判断、抒情、讽刺、冷静分析、煽动等语气是否稳定。',
    '- 低分通常意味着文本在不同姿态之间无序跳转。'
  ],
  expressive_tension: [
    '6. expressive_tension（表达张力）',
    '- 判断语言是否具有压强、牵引力和推进感。',
    '- 高分表示不只字面漂亮，而是真的有表达力量。'
  ],
  style_distinctness: [
    '7. style_distinctness（文风辨识度）',
    '- 判断文本是否形成可识别的表达方式，而不是散乱混杂。',
    '- 高分表示文风稳定且有辨识度。'
  ],
  posture_density: [
    '8. posture_density（姿态密度）',
    '- 判断文本中“立姿态、摆气质、演判断”的密度。',
    '- 该项不是越高越好，分数高仅表示姿态密度强。',
    '- 你必须在 reasons 和 commentary 中说明这是一种增益还是负担。'
  ]
}

export const languageMetricOrder = [
  'syntax_control',
  'long_sentence_control',
  'rhetoric_effectiveness',
  'rhythm_structure',
  'tone_stability',
  'expressive_tension',
  'style_distinctness',
  'posture_density'
]

export function getLanguageMetricPromptBlocks () {
  return languageMetricOrder.flatMap((key) => languageMetricBlocks[key])
}
