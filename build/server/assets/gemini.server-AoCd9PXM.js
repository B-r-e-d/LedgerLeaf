import { GoogleGenerativeAI } from "@google/generative-ai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-1.5-pro";
const GEMINI_SUGGEST_MODEL = process.env.GEMINI_SUGGEST_MODEL || "gemini-1.5-flash";
if (!GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not set. Please add GEMINI_API_KEY to your server environment (e.g., .env) and restart the server."
  );
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const MAX_CHAT_MESSAGES = 50;
const MAX_SUBSCRIPTIONS = 200;
const MAX_TEXT_LENGTH = 4e3;
const DEFAULT_TIMEOUT_MS = 25e3;
function trimText(s, max = MAX_TEXT_LENGTH) {
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max);
}
function capArray(arr, cap) {
  if (!Array.isArray(arr)) return [];
  if (arr.length <= cap) return arr;
  return arr.slice(-cap);
}
function mapRoleToGemini(role) {
  if (role === "assistant") return "model";
  return "user";
}
function withTimeout(promise, ms = DEFAULT_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        const err = new Error(`Gemini operation timed out after ${ms}ms`);
        err.code = "TIMEOUT";
        reject(err);
      }, ms);
    })
  ]);
}
function extractUsage(result) {
  var _a;
  try {
    const usage = (_a = result == null ? void 0 : result.response) == null ? void 0 : _a.usageMetadata;
    if (!usage) return void 0;
    const inputTokens = usage.inputTokenCount ?? usage.promptTokenCount ?? usage.totalPromptTokens ?? void 0;
    const outputTokens = usage.outputTokenCount ?? usage.candidatesTokenCount ?? usage.totalTokens ?? void 0;
    return { inputTokens, outputTokens };
  } catch {
    return void 0;
  }
}
function buildSystemInstructionForChat(ctx, extraSystem) {
  const parts = [];
  if (extraSystem) parts.push(extraSystem);
  if (ctx == null ? void 0 : ctx.timezone) parts.push(`Timezone: ${ctx.timezone}`);
  if (ctx == null ? void 0 : ctx.currency) parts.push(`Currency: ${ctx.currency}`);
  if (ctx == null ? void 0 : ctx.locale) parts.push(`Locale: ${ctx.locale}`);
  if (ctx == null ? void 0 : ctx.sampledAt) parts.push(`SampledAt: ${ctx.sampledAt}`);
  return parts.length ? parts.join("\n") : void 0;
}
function sanitizeSubscriptions(input) {
  const items = capArray(input ?? [], MAX_SUBSCRIPTIONS);
  const sanitized = [];
  for (const it of items) {
    if (!it || typeof it.id !== "string" || typeof it.name !== "string" || typeof it.category !== "string" || typeof it.amount !== "number" || !Number.isFinite(it.amount) || typeof it.currency !== "string" || typeof it.billingCycle !== "string" || typeof it.nextPaymentDate !== "string" || typeof it.isActive !== "boolean") {
      continue;
    }
    sanitized.push({
      id: String(it.id),
      name: trimText(it.name, 200),
      category: trimText(it.category, 100),
      amount: Number(it.amount),
      currency: trimText(it.currency, 10),
      billingCycle: trimText(it.billingCycle, 30),
      nextPaymentDate: trimText(it.nextPaymentDate, 40),
      isActive: Boolean(it.isActive)
    });
  }
  return sanitized;
}
async function geminiChat(messages, context) {
  var _a, _b, _c, _d;
  const trimmed = capArray((messages ?? []).filter(Boolean), MAX_CHAT_MESSAGES).map((m) => ({
    role: m.role,
    content: trimText(m.content ?? "")
  }));
  const nonEmpty = trimmed.filter((m) => m.content && m.content.trim().length > 0);
  if (nonEmpty.length === 0) {
    const err = new Error("No valid messages provided");
    err.code = "BAD_REQUEST";
    throw err;
  }
  const systemTexts = nonEmpty.filter((m) => m.role === "system").map((m) => m.content);
  const userModelMsgs = nonEmpty.filter((m) => m.role !== "system");
  const systemInstruction = buildSystemInstructionForChat(
    context,
    systemTexts.length ? systemTexts.join("\n") : void 0
  );
  const contents = userModelMsgs.map((m) => ({
    role: mapRoleToGemini(m.role),
    parts: [{ text: trimText(m.content) }]
  }));
  const generationConfig = {
    temperature: 0.6,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048
  };
  const model = genAI.getGenerativeModel({
    model: GEMINI_CHAT_MODEL,
    ...systemInstruction ? { systemInstruction } : {}
  });
  try {
    const result = await withTimeout(
      model.generateContent({
        contents,
        generationConfig
      })
    );
    const text = ((_b = (_a = result == null ? void 0 : result.response) == null ? void 0 : _a.text) == null ? void 0 : _b.call(_a)) ?? "";
    const cand0 = (_d = (_c = result == null ? void 0 : result.response) == null ? void 0 : _c.candidates) == null ? void 0 : _d[0];
    let annotations;
    if (cand0 == null ? void 0 : cand0.citationMetadata) {
      annotations = [cand0.citationMetadata];
    } else if (cand0 == null ? void 0 : cand0.safetyRatings) {
      annotations = cand0.safetyRatings;
    }
    return {
      message: { role: "assistant", content: text ?? "", annotations },
      usage: extractUsage(result)
    };
  } catch (error) {
    if ((error == null ? void 0 : error.code) === "TIMEOUT") throw error;
    const err = new Error((error == null ? void 0 : error.message) || "Gemini chat model error");
    err.code = "MODEL_ERROR";
    throw err;
  }
}
async function geminiSuggestions(subscriptions, preferences, sampledAt) {
  var _a, _b;
  const sanitized = sanitizeSubscriptions(subscriptions);
  if (sanitized.length === 0) {
    const err = new Error("No valid subscriptions provided");
    err.code = "BAD_REQUEST";
    throw err;
  }
  const generationConfig = {
    temperature: 0.2,
    topK: 20,
    topP: 0.9,
    maxOutputTokens: 1024,
    // These fields are supported on Gemini 1.5+; harmless if ignored on older SDKs.
    // @ts-ignore
    responseMimeType: "application/json",
    // @ts-ignore
    responseSchema: {
      type: "object",
      properties: {
        suggestions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
              targetIds: {
                type: "array",
                items: { type: "string" }
              },
              impactEstimate: {
                type: "object",
                properties: {
                  currency: { type: "string" },
                  monthly: { type: "number" },
                  yearly: { type: "number" }
                }
              },
              confidence: {
                type: "string",
                enum: ["low", "medium", "high"]
              },
              actions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    label: { type: "string" },
                    targetId: { type: "string" }
                  },
                  required: ["type", "label"]
                }
              }
            },
            required: ["type", "title", "description", "targetIds"]
          }
        },
        summary: { type: "string" }
      },
      required: ["suggestions"]
    }
  };
  const model = genAI.getGenerativeModel({
    model: GEMINI_SUGGEST_MODEL,
    systemInstruction: [
      "You are a subscription optimization assistant.",
      "Produce concise, deterministic suggestions strictly following the provided JSON schema.",
      "Never include fields not defined in the schema.",
      "Ground all suggestions in the provided subscriptions snapshot only."
    ].join("\n")
  });
  const payload = {
    snapshot: sanitized,
    preferences: {
      ...(preferences == null ? void 0 : preferences.defaultCurrency) ? { defaultCurrency: String(preferences.defaultCurrency) } : {},
      ...typeof (preferences == null ? void 0 : preferences.savingsGoal) === "number" && Number.isFinite(preferences.savingsGoal) ? { savingsGoal: Number(preferences.savingsGoal) } : {},
      ...(preferences == null ? void 0 : preferences.locale) ? { locale: String(preferences.locale) } : {},
      ...(preferences == null ? void 0 : preferences.timezone) ? { timezone: String(preferences.timezone) } : {}
    },
    sampledAt: sampledAt || (/* @__PURE__ */ new Date()).toISOString()
  };
  const userPrompt = [
    "Given the following subscriptions snapshot and optional user preferences, generate actionable suggestions.",
    "Be specific and concise. Avoid duplication. Tailor to billing cycles, amounts, currency, and activity.",
    "Only include fields permitted by the schema. Use IDs from the snapshot in targetIds.",
    "",
    "Input JSON:",
    "```json",
    JSON.stringify(payload),
    "```"
  ].join("\n");
  try {
    const result = await withTimeout(
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: trimText(userPrompt, 2e4) }] }],
        generationConfig
      })
    );
    const text = ((_b = (_a = result == null ? void 0 : result.response) == null ? void 0 : _a.text) == null ? void 0 : _b.call(_a)) ?? "";
    let parsed = null;
    try {
      parsed = text ? JSON.parse(text) : { suggestions: [] };
    } catch {
      const match = text.match(/```json\s*([\s\S]+?)\s*```/i) || text.match(/```[\s\S]*?```/i);
      if (match && match[1]) {
        parsed = JSON.parse(match[1]);
      } else {
        throw new Error("Model did not return valid JSON");
      }
    }
    const suggestionsArr = Array.isArray(parsed == null ? void 0 : parsed.suggestions) ? parsed.suggestions : [];
    const normalized = suggestionsArr.filter(
      (s) => s && typeof s.type === "string" && typeof s.title === "string" && typeof s.description === "string" && Array.isArray(s.targetIds)
    ).map((s) => ({
      type: String(s.type),
      title: trimText(String(s.title), 200),
      description: trimText(String(s.description), 1e3),
      targetIds: s.targetIds.map(String).filter(Boolean),
      impactEstimate: s.impactEstimate && typeof s.impactEstimate === "object" ? {
        ...s.impactEstimate.currency ? { currency: String(s.impactEstimate.currency) } : {},
        ...typeof s.impactEstimate.monthly === "number" ? { monthly: Number(s.impactEstimate.monthly) } : {},
        ...typeof s.impactEstimate.yearly === "number" ? { yearly: Number(s.impactEstimate.yearly) } : {}
      } : void 0,
      confidence: s.confidence === "low" || s.confidence === "medium" || s.confidence === "high" ? s.confidence : void 0,
      actions: Array.isArray(s.actions) ? s.actions.filter((a) => a && typeof a.type === "string" && typeof a.label === "string").map((a) => ({
        type: String(a.type),
        label: String(a.label),
        ...a.targetId ? { targetId: String(a.targetId) } : {}
      })) : void 0
    }));
    return {
      suggestions: normalized,
      summary: typeof (parsed == null ? void 0 : parsed.summary) === "string" ? trimText(parsed.summary, 1e3) : void 0,
      usage: extractUsage(result)
    };
  } catch (error) {
    if ((error == null ? void 0 : error.code) === "TIMEOUT") throw error;
    const err = new Error((error == null ? void 0 : error.message) || "Gemini suggestions model error");
    err.code = "MODEL_ERROR";
    throw err;
  }
}
export {
  geminiChat,
  geminiSuggestions
};
