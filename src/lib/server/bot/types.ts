import type { User } from "@prisma/client"
import type { Context } from "telegraf"

export type Exchange = {
    user: string,
    bot: string,
}

export interface AvaContext extends Context {
    user: User
    isAdmin: boolean
    isNewUser: boolean
    isPremium: boolean
    isExhausted: boolean
}

export interface TokenUsage {
    total_tokens: number
    prompt_tokens: number;
    completion_tokens: number;
}
