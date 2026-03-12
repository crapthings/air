export const commonRewriteActionBlocks = {
  conservative: [
    '改写目标：保守优化。',
    '尽量不改变原意和整体结构，优先修句子、删重复、提高清晰度和完成度。'
  ],
  stronger: [
    '改写目标：强化表达。',
    '保留核心意思，但可以增强力度、推进感、节奏和完成度。'
  ],
  rewrite: [
    '改写目标：重写一版。',
    '允许重组结构，但必须保留原文最核心的意思和功能。'
  ]
}

export const pageSpecificRewriteActionBlocks = {
  analyzer: {
    densify: [
      '改写目标：提高信息密度。',
      '删掉空话、包装和重复表达，保留真实判断，让信息更集中、更清楚。'
    ]
  },
  script: {
    shootable: [
      '改写目标：更适合拍。',
      '提升开头抓力、节奏推进、口播可说性或镜头推进感，让脚本更适合成片。'
    ]
  },
  language: {
    reduce_posture: [
      '改写目标：降低姿态感。',
      '保留原文气质，但减少腔调、过度表演和空转判断，让语言更稳。'
    ]
  },
  review: {
    reduce_risk: [
      '改写目标：降低风险表达。',
      '在尽量保留原意的前提下，去掉高风险措辞、承诺型表达和敏感表述。'
    ]
  }
}

export function getRewriteActionBlock (view, mode) {
  if (commonRewriteActionBlocks[mode]) {
    return commonRewriteActionBlocks[mode]
  }

  return pageSpecificRewriteActionBlocks[view]?.[mode] || []
}
