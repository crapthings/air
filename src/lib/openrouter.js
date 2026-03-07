const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function extractTextContent(content) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item?.type === "text") {
          return item.text ?? "";
        }

        return "";
      })
      .join("");
  }

  return "";
}

function parseJsonPayload(text) {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "");
  return JSON.parse(cleaned);
}

function normalizeScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(numeric)));
}

function normalizeAnalysis(data) {
  return {
    scores: {
      confidence: normalizeScore(data?.scores?.confidence),
      verifiability: normalizeScore(data?.scores?.verifiability),
      signal: normalizeScore(data?.scores?.signal),
      clarity: normalizeScore(data?.scores?.clarity),
      insight: normalizeScore(data?.scores?.insight),
      taste: normalizeScore(data?.scores?.taste),
      manipulation: normalizeScore(data?.scores?.manipulation),
    },
    reasons: {
      confidence: String(data?.reasons?.confidence ?? ""),
      verifiability: String(data?.reasons?.verifiability ?? ""),
      signal: String(data?.reasons?.signal ?? ""),
      clarity: String(data?.reasons?.clarity ?? ""),
      insight: String(data?.reasons?.insight ?? ""),
      taste: String(data?.reasons?.taste ?? ""),
      manipulation: String(data?.reasons?.manipulation ?? ""),
    },
    summary: String(data?.summary ?? ""),
    profile: {
      thoughtSystemLabel: String(data?.profile?.thought_system_label ?? ""),
      thoughtSystemReason: String(data?.profile?.thought_system_reason ?? ""),
      coreJudgment: String(data?.profile?.core_judgment ?? ""),
      slopRisk: String(data?.profile?.slop_risk ?? ""),
      argumentShape: String(data?.profile?.argument_shape ?? ""),
      attentionWorth: String(data?.profile?.attention_worth ?? ""),
      weakestLink: String(data?.profile?.weakest_link ?? ""),
    },
  };
}

export async function analyzeWithOpenRouter({
  apiKey,
  model,
  input,
  systemPrompt,
  temperature,
  maxTokens,
}) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "AIR",
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: maxTokens,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: input,
        },
      ],
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    const message =
      payload?.error?.message || payload?.message || "OpenRouter 请求失败，请检查 key、模型或网络。";
    throw new Error(message);
  }

  const content = payload?.choices?.[0]?.message?.content;
  const text = extractTextContent(content);

  if (!text) {
    throw new Error("模型没有返回可解析的内容。");
  }

  try {
    return {
      analysis: normalizeAnalysis(parseJsonPayload(text)),
      model: payload?.model || model,
      usage: payload?.usage ?? null,
    };
  } catch {
    throw new Error("模型返回内容不是有效 JSON，请更换模型或调整提示词。");
  }
}
