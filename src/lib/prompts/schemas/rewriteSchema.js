export const rewriteSchemaPrompt = [
  '{',
  '  "rewritten_text": "string",',
  '  "change_notes": ["string"],',
  '  "applied_focus": "string"',
  '}'
]

export const rewriteConstraintPrompt = [
  '- rewritten_text 必须直接给出改写后的完整结果。',
  '- change_notes 返回 2 到 4 条短说明，每项控制在 28 个中文字符以内。',
  '- applied_focus 控制在 40 个中文字符以内。',
  '- 不要输出多个候选版本。'
]
