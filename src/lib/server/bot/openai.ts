import {
    OpenAIApi,
    Configuration,
    type CreateChatCompletionRequest,
} from "openai"
import { env } from "$env/dynamic/private"
import type { User } from "@prisma/client"

import configs from "./configs"
import { sysPrompt } from "./canned"
import type { Exchange } from "./types"

const openai = new OpenAIApi(new Configuration({
    apiKey: env.OPENAI_APIKEY,
}))

export async function gptRespond(user: User, text: string, history: Exchange[]) {
    const req: CreateChatCompletionRequest = {
        n: 1,
        user: user.id,
        model: user.model || configs.defaultModel,
        messages: [
            {
                role: "system",
                content: user.systemPrompt || sysPrompt(),
            },
        ]
    }

    history.forEach(entry => {
        req.messages.push(
            {
                role: "user",
                content: entry.user,
            },
            {
                role: "assistant",
                content: entry.bot,
            }
        )
    })

    req.messages = [
        ...req.messages,
        {
            role: "user",
            content: text,
        },
    ]

    const resp = await openai.createChatCompletion(req)
    const msgText = resp.data.choices[0].message?.content
    if (msgText) {
        history.push({
            user: text,
            bot: msgText,
        })

        history = history.slice(history.length - configs.memoryLength)
    }

    return {
        usage: resp.data.usage,
        message: msgText || "Oops, something went wrong",
        history
    };
}
