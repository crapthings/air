# AIR

**AIR** 是一个中文内容分析 Web 应用：用大模型对文本做「信息质量评分」和「合规风险审查」，适合写作者自检、自媒体发布前复核或申诉辅助。前端直连 OpenRouter，本地配置 API Key 即可使用。

---

一个基于 `Vite + React + Tailwind CSS` 的中文内容分析工具，当前包含四个主要页面：

- `信息评分器`
- `语言解剖台`
- `脚本实验室`
- `内容审查台`

## 功能

### 信息评分器

用于评估一段内容的认知质量，当前包含这些指标：

- 置信度
- 可验证性
- 信号强度
- 清晰度
- 洞察力
- 品味
- 操控性

同时会返回：

- 综合结论
- 分析剖面
- 思想体系标签

### 内容审查台

面向中文自媒体场景，支持三种模式：

- 发布前自检
- 内容复核
- 申诉辅助

当前审查指标：

- 违规风险
- 广告营销风险
- 医疗健康风险
- 金融收益风险
- 低俗攻击风险
- 引流导流风险
- 误导标题风险

同时会返回：

- 总体风险等级
- 命中点
- 整改建议
- 申诉潜力
- 审查剖面

### 脚本实验室

用于评估短视频和长视频脚本，兼容两种输入形态：

- 纯文案脚本
- 分镜脚本

当前从两条主线判断：

- 传播效果
- 叙事质量

主指标包括：

- 3 秒抓力
- 完播潜力
- 节奏控制
- 传播记忆点
- 设定清晰度
- 冲突强度
- 结构完整性
- 情绪递进

同时会返回：

- 一句话总评
- 优势清单
- 问题清单
- 开头 / 中段 / 结尾 / 表现形式改稿建议
- 短视频 / 长视频适配判断
- 脚本剖面

### 语言解剖台

用于从技术角度分析普通中文写作中的语言结构与风格机制，兼顾：

- 写作诊断
- 文体拆解

当前重点分析：

- 句法控制
- 长句控制力
- 修辞有效性
- 节奏组织
- 语气稳定性
- 表达张力
- 文风辨识度
- 姿态密度

同时会返回：

- 一句话总评
- 修辞手法 / 句法模式 / 文风模式识别
- 主要问题
- 句子 / 节奏 / 修辞 / 语气修改建议
- 评论拆解
- 表达剖面

## 技术栈

- React
- Vite
- Tailwind CSS
- Zustand

## 本地开发

安装依赖：

```bash
pnpm install
```

启动开发环境：

```bash
pnpm dev
```

生产构建：

```bash
pnpm build
```

本地预览构建产物：

```bash
pnpm preview
```

## OpenRouter 配置

项目通过设置页填写：

- `OpenRouter API Key`
- `模型 ID`

配置会保存在当前浏览器本地。

注意：

- 当前版本是前端直连 OpenRouter
- `README`、源码和构建产物里不会内置你的个人 key
- 但如果这是公开站点，不应把你自己的 key 交给访客共用

如果要公开提供给多人使用，建议改成后端代理模式。

## GitHub Pages 部署

项目已经配置为相对资源路径，适合直接部署 `dist` 到 GitHub Pages。

构建后：

```bash
pnpm build
```

然后发布 `dist` 目录内容即可。

当前仓库也已提供 GitHub Actions workflow：

- [.github/workflows/deploy-pages.yml](/Users/monsterstep/dev/opensource/air/.github/workflows/deploy-pages.yml)

推荐做法：

1. 推送代码到 `main`
2. 打开仓库 `Settings > Pages`
3. 将 `Source` 切换为 `GitHub Actions`
4. 等待 workflow 自动构建并发布 `dist`

当前 `vite.config.js` 已设置：

```js
base: "./"
```

这样静态资源不会因为 GitHub Pages 的仓库子路径而 404。

## 目录结构

```text
src/
  App.jsx
  main.jsx
  index.css
  lib/
    contentReviewProfile.js
    evaluationProfile.js
    openrouter.js
  store/
    useSettingsStore.js
docs/
  plans/
```

## 当前限制

- 信息评分器支持自定义提示词覆盖
- 内容审查台当前使用内置中文审查体系
- 当前不是平台官方审查结果，只是风险评估
- 当前没有后端代理，OpenRouter 请求由浏览器直接发起
