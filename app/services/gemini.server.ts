import { type GenerationConfig, GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Environment
 */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-1.5-pro'
const GEMINI_SUGGEST_MODEL = process.env.GEMINI_SUGGEST_MODEL || 'gemini-1.5-flash'

if (!GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY is not set. Please add GEMINI_API_KEY to your server environment (e.g., .env) and restart the server.',
  )
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

/**
 * Types
 */
export type ChatRole = 'user' | 'assistant' | 'system'

export type ChatMessage = {
  role: ChatRole
  content: string
}

export type ChatContext = {
  timezone?: string
  currency?: string
  locale?: string
  sampledAt?: string
}

export type UsageMeta = {
  inputTokens?: number
  outputTokens?: number
}

export type ChatResult = {
  message: { role: 'assistant'; content: string; annotations?: any[] }
  usage?: UsageMeta
}

export type SubscriptionItem = {
  id: string
  name: string
  category: string
  amount: number
  currency: string
  billingCycle: string
  nextPaymentDate: string
  isActive: boolean
}

export type SuggestPreferences = {
  defaultCurrency?: string
  savingsGoal?: number
  locale?: string
  timezone?: string
}

export type Suggestion = {
  type: string
  title: string
  description: string
  targetIds: string[]
  impactEstimate?: {
    currency?: string
    monthly?: number
    yearly?: number
  }
  confidence?: 'low' | 'medium' | 'high'
  actions?: Array<{
    type: string
    label: string
    targetId?: string
  }>
}

export type SuggestionsResult = {
  suggestions: Suggestion[]
  summary?: string
  usage?: UsageMeta
}

/**
 * Constants and helpers
 */
const MAX_CHAT_MESSAGES = 50
const MAX_SUBSCRIPTIONS = 200
const MAX_TEXT_LENGTH = 4000
const DEFAULT_TIMEOUT_MS = 25_000

function trimText(s: string, max = MAX_TEXT_LENGTH): string {
  if (!s) return ''
  if (s.length <= max) return s
  return s.slice(0, max)
}

function capArray<T>(arr: T[], cap: number): T[] {
  if (!Array.isArray(arr)) return []
  if (arr.length <= cap) return arr
  return arr.slice(-cap)
}

function mapRoleToGemini(role: ChatRole): 'user' | 'model' {
  if (role === 'assistant') return 'model'
  return 'user'
}

function withTimeout<T>(promise: Promise<T>, ms = DEFAULT_TIMEOUT_MS): Promise<T> {
  return Promise.race<[Promise<T>, Promise<never>]>([
    promise,
    new Promise((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id)
        const err: any = new Error(`Gemini operation timed out after ${ms}ms`)
        err.code = 'TIMEOUT'
        reject(err)
      }, ms)
    }),
  ])
}

function extractUsage(result: any): UsageMeta | undefined {
  try {
    // Most recent SDKs expose usageMetadata on result.response
    const usage = result?.response?.usageMetadata
    if (!usage) return undefined
    const inputTokens = usage.inputTokenCount ?? usage.promptTokenCount ?? usage.totalPromptTokens ?? undefined
    const outputTokens = usage.outputTokenCount ?? usage.candidatesTokenCount ?? usage.totalTokens ?? undefined
    return { inputTokens, outputTokens }
  } catch {
    return undefined
  }
}

function buildSystemInstructionForChat(ctx?: ChatContext, extraSystem?: string): string | undefined {
  const parts: string[] = []
  if (extraSystem) parts.push(extraSystem)
  if (ctx?.timezone) parts.push(`Timezone: ${ctx.timezone}`)
  if (ctx?.currency) parts.push(`Currency: ${ctx.currency}`)
  if (ctx?.locale) parts.push(`Locale: ${ctx.locale}`)
  if (ctx?.sampledAt) parts.push(`SampledAt: ${ctx.sampledAt}`)
  return parts.length ? parts.join('\n') : undefined
}

function sanitizeSubscriptions(input: SubscriptionItem[]): SubscriptionItem[] {
  const items = capArray(input ?? [], MAX_SUBSCRIPTIONS)
  const sanitized: SubscriptionItem[] = []
  for (const it of items) {
    if (
      !it ||
      typeof it.id !== 'string' ||
      typeof it.name !== 'string' ||
      typeof it.category !== 'string' ||
      typeof it.amount !== 'number' ||
      !Number.isFinite(it.amount) ||
      typeof it.currency !== 'string' ||
      typeof it.billingCycle !== 'string' ||
      typeof it.nextPaymentDate !== 'string' ||
      typeof it.isActive !== 'boolean'
    ) {
      continue
    }
    sanitized.push({
      id: String(it.id),
      name: trimText(it.name, 200),
      category: trimText(it.category, 100),
      amount: Number(it.amount),
      currency: trimText(it.currency, 10),
      billingCycle: trimText(it.billingCycle, 30),
      nextPaymentDate: trimText(it.nextPaymentDate, 40),
      isActive: Boolean(it.isActive),
    })
  }
  return sanitized
}

/**
 * Chat helper
 * - Balanced quality profile
 * - History capped
 * - Optional context
 */
export async function geminiChat(messages: ChatMessage[], context?: ChatContext): Promise<ChatResult> {
  const trimmed = capArray((messages ?? []).filter(Boolean), MAX_CHAT_MESSAGES).map((m) => ({
    role: m.role,
    content: trimText(m.content ?? ''),
  }))

  const nonEmpty = trimmed.filter((m) => m.content && m.content.trim().length > 0)
  if (nonEmpty.length === 0) {
    const err: any = new Error('No valid messages provided')
    err.code = 'BAD_REQUEST'
    throw err
  }

  const systemTexts = nonEmpty.filter((m) => m.role === 'system').map((m) => m.content)
  const userModelMsgs = nonEmpty.filter((m) => m.role !== 'system')

  const systemInstruction = buildSystemInstructionForChat(
    context,
    systemTexts.length ? systemTexts.join('\n') : undefined,
  )

  const contents = userModelMsgs.map((m) => ({
    role: mapRoleToGemini(m.role),
    parts: [{ text: trimText(m.content) }],
  }))

  const generationConfig: GenerationConfig = {
    temperature: 0.6,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  }

  const model = genAI.getGenerativeModel({
    model: GEMINI_CHAT_MODEL,
    ...(systemInstruction ? { systemInstruction } : {}),
  })

  try {
    const result = await withTimeout(
      model.generateContent({
        contents,
        generationConfig,
      }),
    )

    const text = result?.response?.text?.() ?? ''
    const cand0 = result?.response?.candidates?.[0]
    let annotations: any[] | undefined
    if (cand0?.citationMetadata) {
      annotations = [cand0.citationMetadata]
    } else if (cand0?.safetyRatings) {
      annotations = cand0.safetyRatings as any[]
    }

    return {
      message: { role: 'assistant', content: text ?? '', annotations },
      usage: extractUsage(result),
    }
  } catch (error: any) {
    if (error?.code === 'TIMEOUT') throw error
    const err: any = new Error(error?.message || 'Gemini chat model error')
    err.code = 'MODEL_ERROR'
    throw err
  }
}

/**
 * Suggestions helper
 * - Deterministic, concise
 * - Sends only whitelisted fields
 * - JSON schema enforced via responseMimeType/responseSchema (best-effort)
 */
export async function geminiSuggestions(
  subscriptions: SubscriptionItem[],
  preferences?: SuggestPreferences,
  sampledAt?: string,
): Promise<SuggestionsResult> {
  const sanitized = sanitizeSubscriptions(subscriptions)
  if (sanitized.length === 0) {
    const err: any = new Error('No valid subscriptions provided')
    err.code = 'BAD_REQUEST'
    throw err
  }

  const generationConfig: GenerationConfig = {
    temperature: 0.2,
    topK: 20,
    topP: 0.9,
    maxOutputTokens: 1024,
    // These fields are supported on Gemini 1.5+; harmless if ignored on older SDKs.
    // @ts-ignore
    responseMimeType: 'application/json',
    // @ts-ignore
    responseSchema: {
      type: 'object',
      properties: {
        suggestions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              targetIds: {
                type: 'array',
                items: { type: 'string' },
              },
              impactEstimate: {
                type: 'object',
                properties: {
                  currency: { type: 'string' },
                  monthly: { type: 'number' },
                  yearly: { type: 'number' },
                },
              },
              confidence: {
                type: 'string',
                enum: ['low', 'medium', 'high'],
              },
              actions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    label: { type: 'string' },
                    targetId: { type: 'string' },
                  },
                  required: ['type', 'label'],
                },
              },
            },
            required: ['type', 'title', 'description', 'targetIds'],
          },
        },
        summary: { type: 'string' },
      },
      required: ['suggestions'],
    },
  } as any

  const model = genAI.getGenerativeModel({
    model: GEMINI_SUGGEST_MODEL,
    systemInstruction: [
      'You are a subscription optimization assistant.',
      'Produce concise, deterministic suggestions strictly following the provided JSON schema.',
      'Never include fields not defined in the schema.',
      'Ground all suggestions in the provided subscriptions snapshot only.',
    ].join('\n'),
  })

  const payload = {
    snapshot: sanitized,
    preferences: {
      ...(preferences?.defaultCurrency ? { defaultCurrency: String(preferences.defaultCurrency) } : {}),
      ...(typeof preferences?.savingsGoal === 'number' && Number.isFinite(preferences.savingsGoal)
        ? { savingsGoal: Number(preferences.savingsGoal) }
        : {}),
      ...(preferences?.locale ? { locale: String(preferences.locale) } : {}),
      ...(preferences?.timezone ? { timezone: String(preferences.timezone) } : {}),
    },
    sampledAt: sampledAt || new Date().toISOString(),
  }

  const userPrompt = [
    'Given the following subscriptions snapshot and optional user preferences, generate actionable suggestions.',
    'Be specific and concise. Avoid duplication. Tailor to billing cycles, amounts, currency, and activity.',
    'Only include fields permitted by the schema. Use IDs from the snapshot in targetIds.',
    '',
    'Input JSON:',
    '```json',
    JSON.stringify(payload),
    '```',
  ].join('\n')

  try {
    const result = await withTimeout(
      model.generateContent({
        contents: [{ role: 'user', parts: [{ text: trimText(userPrompt, 20_000) }] }],
        generationConfig,
      }),
    )

    const text = result?.response?.text?.() ?? ''
    let parsed: any = null
    try {
      parsed = text ? JSON.parse(text) : { suggestions: [] }
    } catch {
      // Fallback: attempt rudimentary extraction if the model returned text with code fences
      const match = text.match(/```json\s*([\s\S]+?)\s*```/i) || text.match(/```[\s\S]*?```/i)
      if (match && match[1]) {
        parsed = JSON.parse(match[1])
      } else {
        throw new Error('Model did not return valid JSON')
      }
    }

    // Normalize suggestions
    const suggestionsArr: Suggestion[] = Array.isArray(parsed?.suggestions) ? parsed.suggestions : []
    const normalized: Suggestion[] = suggestionsArr
      .filter(
        (s) =>
          s &&
          typeof s.type === 'string' &&
          typeof s.title === 'string' &&
          typeof s.description === 'string' &&
          Array.isArray(s.targetIds),
      )
      .map((s) => ({
        type: String(s.type),
        title: trimText(String(s.title), 200),
        description: trimText(String(s.description), 1000),
        targetIds: (s.targetIds as any[]).map(String).filter(Boolean),
        impactEstimate:
          s.impactEstimate && typeof s.impactEstimate === 'object'
            ? {
                ...(s.impactEstimate.currency ? { currency: String(s.impactEstimate.currency) } : {}),
                ...(typeof s.impactEstimate.monthly === 'number' ? { monthly: Number(s.impactEstimate.monthly) } : {}),
                ...(typeof s.impactEstimate.yearly === 'number' ? { yearly: Number(s.impactEstimate.yearly) } : {}),
              }
            : undefined,
        confidence:
          s.confidence === 'low' || s.confidence === 'medium' || s.confidence === 'high' ? s.confidence : undefined,
        actions: Array.isArray(s.actions)
          ? s.actions
              .filter((a: any) => a && typeof a.type === 'string' && typeof a.label === 'string')
              .map((a: any) => ({
                type: String(a.type),
                label: String(a.label),
                ...(a.targetId ? { targetId: String(a.targetId) } : {}),
              }))
          : undefined,
      }))

    return {
      suggestions: normalized,
      summary: typeof parsed?.summary === 'string' ? trimText(parsed.summary, 1000) : undefined,
      usage: extractUsage(result),
    }
  } catch (error: any) {
    if (error?.code === 'TIMEOUT') throw error
    const err: any = new Error(error?.message || 'Gemini suggestions model error')
    err.code = 'MODEL_ERROR'
    throw err
  }
}
