import { useState } from "react";
import { defaultEvaluationProfile } from "./lib/evaluationProfile";
import { analyzeWithOpenRouter } from "./lib/openrouter";
import { useSettingsStore } from "./store/useSettingsStore";

const metricMeta = [
  {
    key: "confidence",
    label: "置信度",
    description: "核心陈述为真的概率有多高。",
    tint: "from-emerald-400/30 to-emerald-500/5",
  },
  {
    key: "verifiability",
    label: "可验证性",
    description: "有没有来源、证据、数据和可追溯依据。",
    tint: "from-cyan-400/30 to-sky-500/5",
  },
  {
    key: "signal",
    label: "信号强度",
    description: "去掉噪声之后，真正有价值的信息剩下多少。",
    tint: "from-sky-400/30 to-blue-500/5",
  },
  {
    key: "clarity",
    label: "清晰度",
    description: "表达是否清楚、结构是否容易理解。",
    tint: "from-fuchsia-400/25 to-pink-500/5",
  },
  {
    key: "insight",
    label: "洞察力",
    description: "有没有真实判断，而不是旧话重说或伪深刻。",
    tint: "from-violet-400/25 to-indigo-500/5",
  },
  {
    key: "taste",
    label: "品味",
    description: "表达是否克制、准确、有分寸、有审美判断。",
    tint: "from-amber-300/30 to-orange-400/5",
  },
  {
    key: "manipulation",
    label: "操控性",
    description: "是否在用情绪、包装和姿态替代真实论证。",
    tint: "from-rose-400/30 to-red-500/5",
  },
];

const emptyScores = {
  confidence: 0,
  verifiability: 0,
  signal: 0,
  clarity: 0,
  insight: 0,
  taste: 0,
  manipulation: 0,
};

const emptyReasons = {
  confidence: "",
  verifiability: "",
  signal: "",
  clarity: "",
  insight: "",
  taste: "",
  manipulation: "",
};

const emptyProfile = {
  coreJudgment: "",
  slopRisk: "",
  argumentShape: "",
  attentionWorth: "",
  weakestLink: "",
  thoughtSystemLabel: "",
  thoughtSystemReason: "",
};

function scoreTone(score) {
  if (score >= 80) return "很高";
  if (score >= 60) return "较强";
  if (score >= 40) return "一般";
  return "偏弱";
}

function scoreBadgeClass(score, isRiskMetric = false) {
  if (isRiskMetric) {
    if (score >= 80) return "border border-rose-700/40 bg-rose-600 text-white shadow-sm shadow-rose-900/15";
    if (score >= 60)
      return "border border-rose-200 bg-rose-100 text-rose-700 shadow-sm shadow-rose-900/8";
    if (score >= 40)
      return "border border-amber-200 bg-amber-100 text-amber-700 shadow-sm shadow-amber-900/8";
    return "border border-emerald-200 bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-900/8";
  }

  if (score >= 80) return "border border-emerald-700/40 bg-emerald-600 text-white shadow-sm shadow-emerald-900/15";
  if (score >= 60)
    return "border border-emerald-200 bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-900/8";
  if (score >= 40)
    return "border border-amber-200 bg-amber-100 text-amber-700 shadow-sm shadow-amber-900/8";
  return "border border-rose-200 bg-rose-100 text-rose-700 shadow-sm shadow-rose-900/8";
}

export default function App() {
  const [view, setView] = useState("analyzer");
  const [input, setInput] = useState("");
  const [scores, setScores] = useState(emptyScores);
  const [reasons, setReasons] = useState(emptyReasons);
  const [summary, setSummary] = useState("");
  const [profile, setProfile] = useState(emptyProfile);
  const [activeModel, setActiveModel] = useState("");
  const [usage, setUsage] = useState(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const openRouterApiKey = useSettingsStore((state) => state.openRouterApiKey);
  const openRouterModelId = useSettingsStore((state) => state.openRouterModelId);
  const customSystemPrompt = useSettingsStore((state) => state.customSystemPrompt);
  const customTemperature = useSettingsStore((state) => state.customTemperature);
  const setOpenRouterApiKey = useSettingsStore((state) => state.setOpenRouterApiKey);
  const setOpenRouterModelId = useSettingsStore((state) => state.setOpenRouterModelId);
  const setCustomSystemPrompt = useSettingsStore((state) => state.setCustomSystemPrompt);
  const setCustomTemperature = useSettingsStore((state) => state.setCustomTemperature);
  const resetEvaluationSettings = useSettingsStore((state) => state.resetEvaluationSettings);

  const resolvedSystemPrompt = customSystemPrompt.trim() || defaultEvaluationProfile.systemPrompt;
  const parsedTemperature = Number(customTemperature);
  const resolvedTemperature =
    customTemperature === "" || !Number.isFinite(parsedTemperature)
      ? defaultEvaluationProfile.temperature
      : Math.min(2, Math.max(0, parsedTemperature));

  const maskedApiKey = openRouterApiKey
    ? `${openRouterApiKey.slice(0, 6)}...${openRouterApiKey.slice(-4)}`
    : "未配置";

  const handleAnalyze = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError("请先输入要分析的内容。");
      return;
    }

    if (!openRouterApiKey.trim()) {
      setError("请先在设置页填写 OpenRouter API Key。");
      setView("settings");
      return;
    }

    if (!openRouterModelId.trim()) {
      setError("请先在设置页填写模型 ID。");
      setView("settings");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const result = await analyzeWithOpenRouter({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: trimmedInput,
        systemPrompt: resolvedSystemPrompt,
        temperature: resolvedTemperature,
        maxTokens: defaultEvaluationProfile.maxTokens,
      });

      setScores(result.analysis.scores);
      setReasons(result.analysis.reasons);
      setSummary(result.analysis.summary);
      setProfile(result.analysis.profile);
      setActiveModel(result.model);
      setUsage(result.usage);
    } catch (analysisError) {
      setError(analysisError.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(236,242,255,0.9))] text-slate-900">
      <div className="flex min-h-screen w-full flex-col px-4 py-4 sm:px-5 lg:px-6">
        <header className="mb-5 flex flex-col gap-3 rounded-[1.5rem] border border-white/70 bg-white/55 px-5 py-4 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                AIR / 信息评分器
              </p>
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-600">
                {openRouterApiKey ? "OpenRouter 已配置" : "OpenRouter 未配置"}
              </span>
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setView("analyzer")}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === "analyzer"
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                }`}
              >
                分析页
              </button>
              <button
                type="button"
                onClick={() => setView("settings")}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === "settings"
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                }`}
              >
                设置页
              </button>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {view === "analyzer"
                ? "用更细的评价维度，判断一段内容到底值不值得读。"
                : "配置 OpenRouter，给分析器接上你自己的模型。"}
            </h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600 xl:self-center">
            {view === "analyzer"
              ? "从真假、证据、信息量、洞察力到操控性，做一轮更像人的拆解。"
              : "设置会通过 zustand 持久化保存在当前浏览器中。"}
          </p>
        </header>

        {view === "analyzer" ? (
          <section className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.06fr)_minmax(300px,0.68fr)]">
            <div className="flex flex-col rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)] sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">输入内容</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    粘贴一段帖子、观点、段落，或者转录文本。
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  实时模型分析
                </span>
              </div>

              <div className="mb-4 grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-200 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                    当前模型
                  </div>
                  <div className="truncate">{activeModel || openRouterModelId || "未设置"}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                    API Key
                  </div>
                  <div className="truncate">{maskedApiKey}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                    评价温度
                  </div>
                  <div>{resolvedTemperature}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                    提示词来源
                  </div>
                  <div>{customSystemPrompt.trim() ? "用户覆盖" : "默认体系"}</div>
                </div>
              </div>

              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="把要分析的内容粘贴到这里..."
                className="min-h-[320px] flex-1 resize-none rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-base leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60"
              />

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  {isAnalyzing ? "分析中..." : "开始分析"}
                </button>
              </div>

              {error ? (
                <div className="mt-3 rounded-[1.25rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {metricMeta.map((metric) => {
                const value = scores[metric.key];
                const isRiskMetric = metric.key === "manipulation";

                return (
                  <article
                    key={metric.key}
                    className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metric.tint}`}
                    />
                    <div className="relative">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                          <p className="mt-2 max-w-[18rem] text-sm leading-6 text-slate-600">
                            {metric.description}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium leading-none ${scoreBadgeClass(
                            value,
                            isRiskMetric
                          )}`}
                        >
                          {scoreTone(value)}
                        </span>
                      </div>

                      <div className="text-4xl font-semibold tracking-tight text-slate-950">
                        {value}
                      </div>
                      <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                        满分 100
                      </div>

                      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-slate-950 transition-[width] duration-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {reasons[metric.key] || "等待模型返回该指标的判断依据。"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="grid auto-rows-min gap-4">
              <article className="rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">综合结论</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      模型给出一句压缩后的总体判断。
                    </p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white">
                    {isAnalyzing ? "处理中" : "已就绪"}
                  </span>
                </div>

                <p className="text-base leading-7 text-slate-900">
                  {summary || "开始分析后，这里会显示一段整体评语。"}
                </p>
              </article>

              <article className="rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]">
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-500">分析剖面</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    比综合结论更技术化，专门拆最值得关注的结构性问题。
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.25rem] bg-slate-100 p-3">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      思想体系标签
                    </div>
                    <div className="text-sm leading-6 text-slate-900">
                      {profile.thoughtSystemLabel || "等待模型给出该内容的思想体系标签。"}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">
                      {profile.thoughtSystemReason || "等待模型说明为什么贴上这个标签。"}
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] bg-slate-100 p-3">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      核心判断
                    </div>
                    <div className="text-sm leading-6 text-slate-900">
                      {profile.coreJudgment || "等待模型生成结构化判断。"}
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] bg-slate-100 p-3">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      Slop 风险
                    </div>
                    <div className="text-sm leading-6 text-slate-900">
                      {profile.slopRisk || "等待模型判断这段内容的 slop 倾向。"}
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] bg-slate-100 p-3">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      论证形态
                    </div>
                    <div className="text-sm leading-6 text-slate-900">
                      {profile.argumentShape || "等待模型概括内容的论证形态。"}
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] bg-slate-100 p-3">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      注意力价值
                    </div>
                    <div className="text-sm leading-6 text-slate-900">
                      {profile.attentionWorth || "等待模型判断是否值得继续投入注意力。"}
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] bg-slate-100 p-3">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      最弱环节
                    </div>
                    <div className="text-sm leading-6 text-slate-900">
                      {profile.weakestLink || "等待模型指出这段内容最薄弱的地方。"}
                    </div>
                  </div>
                </div>

                {usage ? (
                  <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      输入 {usage.prompt_tokens ?? 0}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      输出 {usage.completion_tokens ?? 0}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      总计 {usage.total_tokens ?? 0}
                    </span>
                  </div>
                ) : null}
              </article>
            </div>
          </section>
        ) : (
          <section className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.7)]">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">OpenRouter 设置</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  配置完成后，分析页会直接读取你保存的 API Key 和模型 ID 发起请求。
                </p>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <div className="mb-2 text-sm font-medium text-white">OpenRouter API Key</div>
                  <input
                    type="password"
                    value={openRouterApiKey}
                    onChange={(event) => setOpenRouterApiKey(event.target.value)}
                    placeholder="请输入 sk-or-v1-..."
                    className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium text-white">模型 ID</div>
                  <input
                    type="text"
                    value={openRouterModelId}
                    onChange={(event) => setOpenRouterModelId(event.target.value)}
                    placeholder="例如 openai/gpt-4.1-mini"
                    className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium text-white">评价提示词</div>
                  <textarea
                    value={customSystemPrompt}
                    onChange={(event) => setCustomSystemPrompt(event.target.value)}
                    placeholder="留空时使用内置默认评价体系..."
                    className="min-h-[240px] w-full resize-y rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium text-white">Temperature</div>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={customTemperature}
                    onChange={(event) => setCustomTemperature(event.target.value)}
                    placeholder={`留空时使用默认值 ${defaultEvaluationProfile.temperature}`}
                    className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60"
                  />
                </label>

                <button
                  type="button"
                  onClick={resetEvaluationSettings}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                >
                  恢复默认评价体系
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <article className="rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-slate-950">当前配置</h3>
                  <span className="rounded-full bg-slate-950 px-4 py-1.5 text-xs font-medium leading-none text-white">
                    {openRouterApiKey ? "已配置" : "未配置"}
                  </span>
                </div>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="rounded-[1.25rem] bg-slate-100 p-3">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      API Key
                    </div>
                    <div className="break-all text-slate-900">{maskedApiKey}</div>
                  </div>
                  <div className="rounded-[1.25rem] bg-slate-100 p-3">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      模型 ID
                    </div>
                    <div className="break-all text-slate-900">
                      {openRouterModelId || "未设置"}
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] bg-slate-100 p-3">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      评价提示词
                    </div>
                    <div className="text-slate-900">
                      {customSystemPrompt.trim() ? "使用用户覆盖" : "使用内置默认评价体系"}
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] bg-slate-100 p-3">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      Temperature
                    </div>
                    <div className="text-slate-900">{resolvedTemperature}</div>
                  </div>
                </div>
              </article>

              <article className="rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.45)]">
                <h3 className="text-xl font-semibold text-slate-950">说明</h3>
                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <p>设置保存在当前浏览器，本地持久化，不需要重复输入。</p>
                  <p>当前版本会由浏览器直接请求 OpenRouter，所以 API Key 会在本地浏览器中使用。</p>
                  <p>评价提示词和 temperature 支持用户覆盖；留空时自动回退到内置默认评价体系。</p>
                </div>
              </article>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
