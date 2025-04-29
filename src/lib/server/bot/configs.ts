import type { AvaContext, TokenUsage } from './types';

// models supported. cost is in $/1k tokens.
// Refer: https://openai.com/pricing
const models = [
	{
		name: 'gpt-4.1',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.002 + usage.completion_tokens * 0.008
	},
	{
		name: 'gpt-4.1-mini',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.0004 + usage.completion_tokens * 0.0016
	},
	{
		name: 'gpt-4.1-nano',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.0001 + usage.completion_tokens * 0.0004
	},
	{
		name: 'gpt-4.5-preview',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.075 + usage.completion_tokens * 0.15
	},
	{
		name: 'gpt-4o',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.0025 + usage.completion_tokens * 0.01
	},
	{
		name: 'gpt-4o-audio-preview',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.0025 + usage.completion_tokens * 0.01
	},
	{
		name: 'gpt-4o-realtime-preview',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.005 + usage.completion_tokens * 0.02
	},
	{
		name: 'gpt-4o-mini',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.00015 + usage.completion_tokens * 0.0006
	},
	{
		name: 'gpt-4o-mini-audio-preview',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.00015 + usage.completion_tokens * 0.0006
	},
	{
		name: 'gpt-4o-mini-realtime-preview',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.0006 + usage.completion_tokens * 0.0024
	},
	{
		name: 'o1',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.015 + usage.completion_tokens * 0.06
	},
	{
		name: 'o1-pro',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.15 + usage.completion_tokens * 0.6
	},
	{
		name: 'o3',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.01 + usage.completion_tokens * 0.04
	},
	{
		name: 'o4-mini',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.0011 + usage.completion_tokens * 0.0044
	},
	{
		name: 'o3-mini',
		free: false,
		cost: (usage: TokenUsage) => usage.prompt_tokens * 0.0011 + usage.completion_tokens * 0.0044
	}
];

const configs = {
	freeCredits: 10000, // in tokens.
	memoryLength: 5,
	defaultModel: 'gpt-3.5-turbo',
	freeModels: models.filter((m) => m.free).map((m) => m.name),
	premiumModels: models.filter((m) => !m.free).map((m) => m.name)
};

export const modelsForUser = (ctx: AvaContext) => {
	const res = [...configs.freeModels];
	if (ctx.isPremium || ctx.isAdmin) res.push(...configs.premiumModels);
	return res;
};

export const computeCreditBurn = (modelName: string, usage?: TokenUsage) => {
	if (!usage) return 0;

	const model = models.find((m) => m.name === modelName || configs.defaultModel) || models[0];

	usage.completion_tokens = usage.completion_tokens / 1000;
	usage.prompt_tokens = usage.prompt_tokens / 1000;
	usage.total_tokens = usage.completion_tokens + usage.prompt_tokens;
	return model.cost(usage);
};

export default { ...configs };
