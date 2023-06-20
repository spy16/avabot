import { env } from "$env/dynamic/private"
import { message } from "telegraf/filters"
import { type Context, Telegraf, Markup } from "telegraf"

import { gptRespond } from "./openai"
import { allocUser, prisma } from "../data"
import {
    privacyPolicy,
    userStats,
    helpDoc,
    commandList,
    exhausted
} from "./canned"
import type { AvaContext, Exchange } from "./types"
import configs, { computeCreditBurn, modelsForUser } from "./configs"

const threads: Record<string, Exchange[]> = {}

export const bot = new Telegraf<AvaContext>(env.TELEGRAM_TOKEN)
bot.catch((err) => console.error("bot error: ", err))

bot.use(async (ctx, next) => {
    const user = await allocUser(ctx)

    ctx.user = user
    ctx.isPremium = false
    ctx.isAdmin = user.id === env.ADMIN_USER_ID
    ctx.isNewUser = user.createdAt.getTime() === user.updatedAt.getTime()
    ctx.isExhausted = user.creditsLeft <= 0

    if (!ctx.isNewUser) {
        const sub = await prisma.subscription.findUnique({
            where: { userId: ctx.user.id },
            select: { id: true },
        })
        ctx.isPremium = sub !== null
    }

    return await next()
})

bot.telegram.setMyCommands(commandList).catch(reason => {
    console.error("failed to register commands: ", reason)
})

bot.start(async (ctx) => {
    await say(ctx, ctx.isNewUser ? helpDoc(ctx.user) : "Hello!")
})

bot.help(async (ctx) => {
    const user = await allocUser(ctx)
    await say(ctx, helpDoc(user))
})

bot.command("reset", async (ctx) => {
    delete threads[ctx.user.id];
    await say(ctx, "✅ Conversation memory has been cleared.")
})

bot.command("privacy", async (ctx) => {
    await say(ctx, privacyPolicy())
})

bot.command("model", async (ctx) => {
    const models = modelsForUser(ctx)
    let message = "Select the model you want to use."
    if (ctx.isPremium) {
        message += "\nAs premium user, you have access to all these models!"
    } else {
        message += "\n👉 You can get access to more models by subscribing!"
    }

    ctx.reply(message, Markup.inlineKeyboard(
        models.map(m => Markup.button.callback(m, "set model=" + m))
    ))
})

bot.action(/set model=(.*)/g, async (ctx, next) => {
    await ctx.answerCbQuery()

    const model = ctx.match[1]
    if (modelsForUser(ctx).includes(model)) {
        await prisma.user.update({
            where: { id: ctx.user.id },
            data: { model: model },
        })

        await ctx.editMessageText(
            `✅ Done! You are now using ${model}.`,
            { entities: [] },
        )
    } else {
        await say(ctx, `Sorry, you don't have access to '${model}'.`)
    }

    return next()
})

bot.command("stats", async (ctx) => {
    const sub = await prisma.subscription.findUnique({
        where: { userId: ctx.user.id },
    })

    let stats = userStats(ctx.user, sub)

    if (ctx.isAdmin) {
        const userCount = await prisma.user.count()
        const msgCount = await prisma.user.aggregate({
            _sum: { messagesSent: true }
        })

        stats = [
            stats,
            "\n\n🔐 ----------- ADMIN ----------- 🔐",
            `Total Users: ${userCount}`,
            `Total Messages: ${msgCount._sum.messagesSent || 0}`,
        ].join("\n")
    }

    await say(ctx, stats)
})

bot.on(message("text"), async (ctx) => {
    ctx.sendChatAction("typing").catch((reason) => {
        console.warn("ctx.sendChatAction(): ", reason)
    })

    if (ctx.isExhausted) {
        await say(ctx, exhausted(ctx.user))
        return
    }

    const { message, history, usage } = await gptRespond(
        ctx.user,
        ctx.message.text,
        threads[ctx.user.id] || [],
    )
    threads[ctx.user.id] = history

    await say(ctx, message)

    prisma.user
        .update({
            where: { id: ctx.user.id },
            data: {
                messagesSent: { increment: 1 },
                tokensUsed: { increment: usage?.total_tokens || 0 },
                creditsLeft: { decrement: computeCreditBurn(ctx.user.model || configs.defaultModel, usage) }
            },
        })
        .catch((reason) => {
            console.error("updateUsage: ", reason)
        })
})

// ======================== helpers =========================

const say = async (ctx: Context, text: string) => {
    const messages = splitMessage(text);
    try {
        for (const msg of messages) {
            try {
                // try as markdown.
                await ctx.replyWithMarkdown(msg)
            } catch (error) {
                console.warn("failed to send in markdown")
                // markdown didn't work. try as normal text.
                await ctx.reply(msg)
            }
        }
    } catch (error) {
        console.error("say(): ", error)
    }
}

function splitMessage(message: string): string[] {
    const MAX_LENGTH = 4096;
    const messageArray = [];

    while (message.length > 0) {
        messageArray.push(message.substring(0, MAX_LENGTH));
        message = message.substring(MAX_LENGTH);
    }

    return messageArray;
}
