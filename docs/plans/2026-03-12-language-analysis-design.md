# 语言解剖台设计稿

## 目标

为 AIR 新增一个独立页面“语言解剖台”，用于从技术角度分析中文写作中的修辞、句法、长句控制、节奏、语气和文风模式。

该页面同时服务两种用途：

- 写作诊断：指出表达结构是否成立、哪里失控、应该先改什么
- 文体拆解：解释文本靠什么语言机制形成效果、气质和姿态

它不是修辞术语识别器，也不是自动改写器。核心任务是判断语言手法是否真正服务表达。

## 页面定位

- 页面名称：语言解剖台
- 输入对象：普通中文写作文本
- 优先适配场景：评论、随笔、议论文、叙述文、通用写作
- 输出风格：上层技术诊断，下层评论拆解

## 输入字段

- 标题（可选）
- 文本类型：通用 / 评论 / 随笔 / 议论文 / 叙述文
- 正文

## 输出结构

- 一句话总评
- 技术评分卡
- 识别到的语言现象
- 主要问题
- 修改建议
- 评论拆解
- 表达剖面

## 核心原则

- 识别修辞不是目的，判断修辞是否改善表达才是目的
- 不把“有修辞”误判为“写得好”
- 不把“句子长”误判为“高级”
- 不把“风格强”误判为“有效”
- 不把“尖锐语气”误判为“有力量”

## 主指标

### 技术诊断组

- syntax_control：句法控制
- long_sentence_control：长句控制力
- rhetoric_effectiveness：修辞有效性
- rhythm_structure：节奏组织

### 风格拆解组

- tone_stability：语气稳定性
- expressive_tension：表达张力
- style_distinctness：文风辨识度
- posture_density：姿态密度

## 指标定义

### syntax_control

判断句子结构是否稳定，是否频繁出现断裂、缠绕、跳接或主次关系失衡。

### long_sentence_control

判断长句是否带来推进、密度和层次，而不是造成阅读阻塞、拖滞和负担。

### rhetoric_effectiveness

判断比喻、排比、设问、反问、重复、对照、递进等手法是否真正增强表达，而不是停留在表面装饰。

### rhythm_structure

判断长短句切换、停顿、推进和重音分布是否形成可感知的阅读节奏。

### tone_stability

判断判断、抒情、讽刺、冷静分析、煽动等语气是否稳定，不在不同姿态间无序跳转。

### expressive_tension

判断语言是否具有压强、牵引力和推进感，而不是只有表面上的漂亮和腔调。

### style_distinctness

判断文本是否形成可识别的表达方式，而不是散乱、混杂、无中心。

### posture_density

判断文本中“立姿态、摆气质、演判断”的密度。该项不是越高越好，重点在于是否过量并遮蔽了真实表达。

## 识别到的语言现象

此模块不做长解释，而是返回短标签，分为三类：

- rhetorical_devices：修辞手法
- sentence_patterns：句法模式
- style_modes：文风模式

### rhetorical_devices 示例

- 比喻
- 排比
- 反问
- 对照
- 递进
- 重复
- 警句化表达

### sentence_patterns 示例

- 长单句推进
- 短句切断
- 并列展开
- 判断句连发
- 插入句
- 层层递进

### style_modes 示例

- 论断型
- 抒情型
- 讽刺型
- 冷静分析型
- 警句型
- 姿态型

## 结果 JSON

```json
{
  "summary": "string",
  "scores": {
    "syntax_control": 0,
    "long_sentence_control": 0,
    "rhetoric_effectiveness": 0,
    "rhythm_structure": 0,
    "tone_stability": 0,
    "expressive_tension": 0,
    "style_distinctness": 0,
    "posture_density": 0
  },
  "reasons": {
    "syntax_control": "string",
    "long_sentence_control": "string",
    "rhetoric_effectiveness": "string",
    "rhythm_structure": "string",
    "tone_stability": "string",
    "expressive_tension": "string",
    "style_distinctness": "string",
    "posture_density": "string"
  },
  "detected_features": {
    "rhetorical_devices": ["string"],
    "sentence_patterns": ["string"],
    "style_modes": ["string"]
  },
  "problems": ["string"],
  "revision_suggestions": {
    "sentence": "string",
    "rhythm": "string",
    "rhetoric": "string",
    "tone": "string"
  },
  "commentary": {
    "style_summary": "string",
    "language_mechanism": "string",
    "dominant_effect": "string",
    "risk_note": "string"
  },
  "profile": {
    "core_strength": "string",
    "core_weakness": "string",
    "writer_tendency": "string",
    "reading_experience": "string"
  }
}
```

## 输出模块说明

### 一句话总评

快速说明文本技术上是否成立，最大的优点和最大的毛病分别是什么。

### 技术评分卡

展示 8 个主指标，每项同时返回分数和一句解释。

### 识别到的语言现象

以标签形式列出最关键的修辞手法、句法模式和文风模式，避免堆砌长术语说明。

### 主要问题

列出 3 到 5 个最影响阅读体验和表达质量的问题。

### 修改建议

固定输出四类建议：

- sentence：句子层面的调整
- rhythm：节奏层面的调整
- rhetoric：修辞使用层面的调整
- tone：语气控制层面的调整

### 评论拆解

偏评论式解释文本的风格机制，重点回答：

- 文本主要靠什么语言机制成立
- 它形成了什么风格气质
- 它最强的效果是什么
- 它最大的风险是什么

### 表达剖面

压缩总结为四项：

- core_strength：核心优点
- core_weakness：核心弱点
- writer_tendency：作者倾向
- reading_experience：阅读体验

## 文本类型策略

文本类型仅作为轻量引导，不做硬性规则。

### 评论

允许更强判断和论断句，但仍需检验句法稳定性和节奏组织。

### 随笔

允许更高抒情和流动性，但不能只有氛围而没有推进。

### 议论文

更重逻辑稳定、句法清晰和判断链条。

### 叙述文

更重画面推进、句间转换和叙事语气的稳定。

### 通用

按中性中文写作标准分析。

## 提示词策略

系统提示词应固定以下边界：

- 任务不是夸文本，也不是自动代写全文
- 任务是分析语言技术结构和文风机制
- 需要同时给出技术诊断和评论拆解
- 不要把术语堆成学术展示，必须回到阅读效果
- 必须输出纯 JSON

模型需要遵守的判断逻辑：

- 先识别语言手法
- 再判断这些手法在阅读中产生了什么效果
- 再判断这些效果是否值得保留或需要削弱

## 第一版不做

- 逐句批注全文
- 原文高亮每个修辞点
- 自动重写整段文章
- 修辞学术语大全
- 作者流派识别
- “像谁”的文风模仿判断

## 实施建议

第一版直接复用 AIR 现有结构：

- 新增一个语言分析 profile 文件
- 在 OpenRouter 适配层新增语言分析结果解析函数
- 在 App 中新增一个独立 view
- 复用现有分数卡片、问题卡片、建议卡片和剖面卡片的视觉样式

该页面的产品定义为：

“一个从句法、修辞、节奏和文风机制出发，判断中文写作表达技术是否成立的独立分析页。”
