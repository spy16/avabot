import type { AvaContext, TokenUsage } from "./types";

// models supported. cost is in $/1k tokens.
// Refer: https://openai.com/pricing
const models = [
    {
        name: "gpt-3.5-turbo",
        free: true,
        cost: (usage: TokenUsage) => {
            return usage.prompt_tokens * 0.0015 + usage.completion_tokens * 0.002
        },
    },
    {
        name: "gpt-3.5-turbo-16k",
        free: true,
        cost: (usage: TokenUsage) => {
            return usage.prompt_tokens * 0.003 + usage.completion_tokens * 0.004
        },
    },
    {
        name: "gpt-4",
        free: true,
        cost: (usage: TokenUsage) => {
            return usage.prompt_tokens * 0.03 + usage.completion_tokens * 0.06
        },
    }
]

const configs = {
    freeCredits: 1, // in USD.
    memoryLength: 5,
    defaultModel: "gpt-3.5-turbo",
    freeModels: models.filter(m => m.free).map(m => m.name),
    premiumModels: models.filter(m => !m.free).map(m => m.name),
}

export const modelsForUser = (ctx: AvaContext) => {
    const res = [...configs.freeModels]
    if (ctx.isPremium || ctx.isAdmin) res.push(...configs.premiumModels)
    return res;
}

export const computeCreditBurn = (modelName: string, usage?: TokenUsage) => {
    if (!usage) return 0

    const model = models.find(m => m.name === modelName || configs.defaultModel) || models[0]

    usage.completion_tokens = usage.completion_tokens / 1000
    usage.prompt_tokens = usage.prompt_tokens / 1000
    usage.total_tokens = usage.completion_tokens + usage.prompt_tokens
    return model.cost(usage)
}

export default { ...configs }
