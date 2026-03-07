# AIR

**AIR** 是一个中文内容分析 Web 应用：用大模型对文本做「信息质量评分」和「合规风险审查」，适合写作者自检、自媒体发布前复核或申诉辅助。前端直连 OpenRouter，本地配置 API Key 即可使用。

---

一个基于 `Vite + React + Tailwind CSS` 的中文内容分析工具，当前包含两个主要页面：

- `信息评分器`
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
