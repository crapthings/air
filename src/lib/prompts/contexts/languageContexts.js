const languageContextBlocks = {
  base: [
    '输入中会包含：文本类型、标题和正文。',
    '你需要同时完成两层输出：',
    '- 技术诊断：指出表达结构是否成立、哪里失控、应该先改什么。',
    '- 评论拆解：解释文本靠什么语言机制形成效果、气质和姿态。'
  ],
  common: [
    '识别到的语言现象要优先保留最有解释力的标签，不要堆术语。',
    '评论拆解必须回到阅读效果，不要写成空泛学术展示。',
    '额外补充辅助观察：提取核心关键词，并判断重复回词、过渡衔接和同质化风险。',
    '这些辅助观察不参与主分项，只作为补充判断。'
  ],
  type_guidance: [
    '文本类型引导：',
    '- 评论：允许更强判断和论断句，但仍要检验句法稳定性和节奏组织。',
    '- 随笔：允许抒情和流动性，但不能只有氛围没有推进。',
    '- 议论文：更重逻辑稳定、句法清晰和判断链条。',
    '- 叙述文：更重画面推进、句间转换和叙事语气。',
    '- 通用：按中性中文写作标准分析。'
  ]
}

export function getLanguageContextPromptBlocks () {
  return [
    ...languageContextBlocks.base,
    ...languageContextBlocks.common,
    ...languageContextBlocks.type_guidance
  ]
}
