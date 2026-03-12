# 脚本实验室设计稿

## 目标

为 AIR 新增第三个页面“脚本实验室”，用于评估短视频和长视频脚本的传播效果与叙事质量，并输出结构化改稿建议。

该页面服务于发片前评估，而不是脚本自动生成。它延续 AIR 现有产品形态：输入内容，返回多维评分、问题提炼、结构化剖面和可执行建议。

## 页面定位

- 页面名称：脚本实验室
- 输入对象：纯文案脚本、分镜脚本
- 内容类型：短视频、长视频
- 主要用途：判断“能不能拍”“哪里弱”“应该先改哪里”

## 输入字段

- 标题
- 目标平台：通用 / 抖音 / 小红书 / 视频号 / B站
- 视频长度：短视频 / 长视频
- 脚本形态：纯文案 / 分镜脚本
- 脚本正文

分镜脚本不强制固定模板，允许用户自由输入镜头、台词、旁白、字幕、音效等内容。

## 输出结构

- 一句话总评
- 传播效果总分
- 叙事质量总分
- 八个主指标评分与短解释
- 优势清单
- 问题清单
- 改稿建议
- 适配判断
- 脚本剖面

## 主指标

### 传播效果

- hook_strength：3 秒抓力
- retention_potential：完播潜力
- rhythm_control：节奏控制
- memorability：传播记忆点

### 叙事质量

- setup_clarity：设定清晰度
- conflict_strength：冲突强度
- structure_integrity：结构完整性
- emotion_build：情绪递进

## 辅助判断

以下内容不作为主卡片评分，但应出现在分析和建议中：

- 角色驱动
- 反转回报
- 主题表达
- 转化承接
- 短视频适配度
- 长视频支撑度

## 结果 JSON

```json
{
  "summary": "string",
  "totals": {
    "hook_power": 0,
    "narrative_power": 0
  },
  "scores": {
    "hook_strength": 0,
    "retention_potential": 0,
    "rhythm_control": 0,
    "memorability": 0,
    "setup_clarity": 0,
    "conflict_strength": 0,
    "structure_integrity": 0,
    "emotion_build": 0
  },
  "reasons": {
    "hook_strength": "string",
    "retention_potential": "string",
    "rhythm_control": "string",
    "memorability": "string",
    "setup_clarity": "string",
    "conflict_strength": "string",
    "structure_integrity": "string",
    "emotion_build": "string"
  },
  "strengths": ["string"],
  "problems": ["string"],
  "revision_suggestions": {
    "opening": "string",
    "middle": "string",
    "ending": "string",
    "format": "string"
  },
  "fit": {
    "best_format": "string",
    "short_video_fit": "string",
    "long_video_fit": "string",
    "platform_note": "string"
  },
  "profile": {
    "core_selling_point": "string",
    "biggest_weakness": "string",
    "audience_pull": "string",
    "story_shape": "string"
  }
}
```

## 提示词策略

系统提示词固定以下边界：

- 任务是评估视频脚本，不是代写脚本
- 输入可能是纯文案，也可能是分镜脚本
- 必须结合平台、视频长度、脚本形态判断
- 返回纯 JSON

动态上下文由用户输入拼接：

- 平台
- 视频长度
- 脚本形态
- 标题
- 正文

### 短视频评估侧重点

- 更重 3 秒抓力
- 更重 完播潜力
- 更重 节奏控制
- 更重 传播记忆点

### 长视频评估侧重点

- 更重 结构完整性
- 更重 冲突强度
- 更重 情绪递进
- 更重 设定清晰度

### 纯文案脚本规则

- 重点看语言推进和口播可说性
- 不因缺少镜头信息机械扣分

### 分镜脚本规则

- 判断镜头、台词、旁白、字幕是否互相增强
- 镜头密度高但推进弱时，应降低节奏与完播判断

## 第一版不做

- 自动重写整版脚本
- 分镜结构化表单编辑器
- 平台官方规则库
- 长短视频独立页面拆分
- 多版本脚本对比

## 实施建议

第一版直接复用 AIR 现有页面结构和卡片视觉：

- 新增一个脚本评估 profile 文件
- 在 OpenRouter 适配层新增脚本结果解析函数
- 在 App 中新增第三个 view 和对应状态
- 复用当前分数卡片、总结卡片、建议卡片的视觉样式
